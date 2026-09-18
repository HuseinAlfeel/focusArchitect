-- ACHTUNG: Loescht ALLE Aktivitaetsdaten. Die zwoelf Accounts bleiben stehen.
--
-- Gedacht fuer genau zwei Momente:
--   1. vor dem Probelauf, damit keine Testsitzungen mehr herumliegen
--   2. nach dem Probelauf, bevor die echten Teilnehmenden anfangen
--
-- Warum das noetig ist und nicht nur Kosmetik: Eine Person hat genau eine
-- Sitzung. Liegt fuer einen Code schon eine Testsitzung mit Einwilligung und
-- Vorbefragung vor, bekommt die echte Person diese Sitzung wieder vorgesetzt.
-- Sie sieht dann weder Einwilligung noch Vorbefragung, sondern landet direkt
-- im laufenden Timer der Testsitzung, und ihre Daten landen an der alten
-- Sitzung. Deshalb vorher zuruecksetzen.
--
-- ALLE Befehle hier sind fuer PowerShell und werden im Projektordner
-- ausgefuehrt. Wichtig: PowerShell kennt die Umleitungen "<" und teilweise ">"
-- nicht so wie eine Unix-Shell. Deshalb wird der Projektordner in den
-- Container eingebunden (-v) und mit -f gearbeitet, das umgeht beides.
--
-- 1. Vorher eine Sicherung ziehen:
--    docker run --rm -v "${PWD}:/arbeit" postgres:16 pg_dump "DIREKTER_NEON_STRING" -f /arbeit/sicherung.sql
--
-- 2. Ausfuehren gegen die Produktionsdatenbank (DIREKTER String, nicht der
--    gepoolte):
--    docker run --rm -v "${PWD}:/arbeit" postgres:16 psql "DIREKTER_NEON_STRING" -v ON_ERROR_STOP=1 -f /arbeit/scripts/studiendaten-zuruecksetzen.sql
--
-- Lokal gegen die Entwicklungsdatenbank geht es einfacher, weil der Container
-- schon laeuft:
--    Get-Content scripts\studiendaten-zuruecksetzen.sql | docker exec -i focusarchitect-db-1 psql -U focus -d focusdb -v ON_ERROR_STOP=1

BEGIN;

-- Reihenfolge wegen der Fremdschluessel: erst alles, was an einer Sitzung
-- haengt, dann die Sitzungen selbst.
DELETE FROM "Event";
DELETE FROM "SurveyResponse";
DELETE FROM "CycleFeedback";
DELETE FROM "Session";

COMMIT;

-- Kontrolle: Teilnehmer muessen 12 sein, alles andere 0.
SELECT
  (SELECT count(*) FROM "Participant")    AS teilnehmer_muessen_12_sein,
  (SELECT count(*) FROM "Session")        AS sitzungen,
  (SELECT count(*) FROM "Event")          AS ereignisse,
  (SELECT count(*) FROM "SurveyResponse") AS befragungen,
  (SELECT count(*) FROM "CycleFeedback")  AS kurzfeedback;
