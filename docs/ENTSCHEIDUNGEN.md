# Gestaltungsentscheidungen

## 04.08.2026 Next.js 16

**Entscheidung:** Next.js 16 statt Version 15 aus der Spezifikation.
**Begründung:** War die aktuelle Version, kein Grund veraltet anzufangen.
**Alternative:** Bei 15 bleiben. Verworfen.

## 04.08.2026 Ethikvotum

**Entscheidung:** Erstmal ohne förmliches Ethikvotum weiterbauen.
**Begründung:** Einwilligung der Teilnehmenden brauche ich so oder so. Ob ein Votum nötig ist, kläre ich noch mit Holly.
**Alternative:** Warten bis geklärt. Verworfen, hätte nur aufgehalten.

## 04.08.2026 Zweites Häkchen Einwilligung

**Entscheidung:** Zwei Häkchen statt einem: "gelesen und nehme teil" und "weiß, dass ich jederzeit abbrechen kann".
**Begründung:** Wollte den Abbruch-Punkt extra absichern.
**Alternative:** Ein kombiniertes Häkchen wie ursprünglich geplant. Verworfen.

## 04.08.2026 Keine E-Mail von Teilnehmenden

**Entscheidung:** Kein E-Mail-Feld für Teilnehmende.
**Begründung:** Würde die Pseudonymisierung über die Codes aushebeln. Ich kenne die Leute eh persönlich, für Löschanfragen reicht meine eigene Adresse im Einwilligungstext.
**Alternative:** E-Mail-Feld trotzdem einbauen. Verworfen.

## 04.08.2026 Löschdatum

**Entscheidung:** Konkretes Löschdatum 11.11.2026 im Einwilligungstext.
**Begründung:** Klarer als eine vage Formulierung.
**Alternative:** Vage lassen ("nach Abschluss der Arbeit"). Verworfen.

## 04.08.2026 Passwörter neutral

**Entscheidung:** Zugangscodes wie "Wolke-71B" statt thematischer Wörter wie "HandyWeg!01".
**Begründung:** Thematische Passwörter könnten schon vor der Vorbefragung aufs Studienthema hindeuten und die Antworten beeinflussen.
**Alternative:** Bei der thematischen Idee bleiben. Verworfen.

## 04.08.2026 Sounds selbst gebaut

**Entscheidung:** Töne für den Pausenhinweis per Web Audio API selbst erzeugt, keine fertigen Dateien.
**Begründung:** Lautstärke genau einstellbar, keine Lizenzfragen.
**Alternative:** Fertige Sounds z. B. von freesound.org. Als Rückfallplan im Hinterkopf behalten.

## 04.08.2026 Glocke statt Holzklopfen

**Entscheidung:** Ton geht Richtung weiche Glocke, nicht Holzklopfen.
**Begründung:** Holzklopfen klang beim Testen einfach nicht gut. Zehn Varianten gebaut und verglichen.
**Alternative:** Holzklopfen. Verworfen nach dem Hörtest.

## 04.08.2026 Ton-Zeitplan Arbeitsphase

**Entscheidung:** Eskalation ab Ablauf: -30s leise, 0:00 etwas lauter, +1min und +2min wieder, ab +3min pulsierend jede Minute.
**Begründung:** In einem Hintergrund-Tab sieht man die visuellen Stufen nicht, nur Ton fällt auf.
**Alternative:** Nur der eine leise Ton aus der Spezifikation. Verworfen, zu wenig für unsichtbare Tabs. Läuft zusätzlich zu den visuellen Stufen.

## 05.08.2026 Kein Verschieben um 5 Minuten

**Entscheidung:** Option "Pause um 5 Min verschieben" raus. Bleibt: Pause starten, überspringen.
**Begründung:** Blindes Verschieben ohne genaue Minutenangabe ist ungenau, das übernimmt jetzt das Kurzfeedback.
**Alternative:** Aus Spezifikation übernehmen. Verworfen.

## 05.08.2026 Kurzfeedback vor Aktivität und Pause

**Entscheidung:** Kurzfeedback direkt nach Reaktion auf den Pausenhinweis, vor Aktivität und Pause.
**Begründung:** Frage bezieht sich auf die gerade beendete Arbeitsphase, das beantwortet man direkt danach ehrlicher als nach einer Pause.
**Alternative:** Reihenfolge aus Spezifikation behalten. Verworfen nach eigenem Test.

## 05.08.2026 Sitzung fortsetzen oder final abgeben

**Entscheidung:** Nach "Sitzung beenden" zwei Wege: fortsetzen (falls aus Versehen) oder final abgeben (endgültig).
**Begründung:** Ein Klick sollte nicht sofort unwiderruflich sein.
**Alternative:** Beenden bleibt endgültig wie ursprünglich gebaut. Verworfen.

## 09.08.2026 Überzeit-Anzeige

**Entscheidung:** Nach Ablauf der Arbeitszeit zeigt der Timer "+MM:SS" statt leer zu bleiben.
**Begründung:** Beim Testen verschwand die Anzeige einfach, wirkte kaputt.
**Alternative:** So lassen. Verworfen.

## 09.08.2026 Signal am Pausenende

**Entscheidung:** Letzte 10 Sekunden der Pause: leiser Countdown-Ton, bei 0 ein deutliches Signal.
**Begründung:** Vorher gab es am Pausenende gar kein Signal.
**Alternative:** Kein Signal, wie ursprünglich gebaut. Verworfen.

## 09.08.2026 Überspringen wirklich umsetzen

**Entscheidung:** "Überspringen" geht direkt in die nächste Arbeitsrunde, ganz ohne Aktivität und Pause.
**Begründung:** In der ersten Version lief Überspringen trotzdem durch Aktivität und Pause, nur der Name im Protokoll war anders. Ergab so keinen Sinn.
**Alternative:** So lassen. Verworfen.

## 10.08.2026 Nachbefragung erst nach Sitzungsende

**Entscheidung:** Nachbefragung nur erreichbar, wenn die Sitzung beendet ist, danach automatisch final.
**Begründung:** Die Fragen bewerten die ganze Sitzung im Rückblick, vorher ergibt das keinen Sinn.
**Alternative:** Jederzeit zugänglich machen. Verworfen.

## 11.08.2026 Minuten-Zähler statt fester Knöpfe beim Kurzfeedback

**Entscheidung:** Bei der Anpassung der Arbeitszeit gibt es jetzt einen Zähler in 5-Minuten-Schritten
(minus/plus), frei nach oben oder unten, statt der vier festen Knöpfe -10/-5/+5/+10.
**Begründung:** Die festen Sprünge waren zu grob, jemand der z.B. 15 Minuten mehr wollte, kam damit nicht
direkt hin.
**Alternative:** Bei den vier festen Knöpfen bleiben. Verworfen.

## 24.08.2026 Demografischer Block und finale Nachbefragung

**Entscheidung:** Vorbefragung um einen demografischen Block (D1-D5: Altersgruppe, Geschlecht, Tätigkeit,
Arbeitsstunden pro Tag, davon im Sitzen) ergänzt, ganz vorne vor V1. Die Nachbefragung komplett durch eine
neue Fassung ersetzt (N1-N19): Zustand nach der Sitzung, dazu zwei etablierte Skalen ("wahrgenommene
Überzeugungskraft" und "wahrgenommene Aufdringlichkeit", je 1-7 mit voll ausbeschrifteten Zustimmungsstufen),
danach Vergleichsfrage und Freitext.
**Begründung:** Mit Holly abgestimmt. Die etablierten Skalen sind wissenschaftlich stärker als die alten
selbst gebauten N3-N6-Fragen, weil sie geprüft und vergleichbar sind.
**Alternative:** Bei den alten N1-N10 bleiben. Verworfen, da nicht mehr die abgestimmte Fassung.

## 24.08.2026 Zwei Töne gleichzeitig bei +3 Min behoben

**Entscheidung:** Zwei Änderungen an `useNudgeSoundSchedule.ts`: (1) Der Klang bei +3 Min ist jetzt derselbe
sanfte Sinuston wie bei 0:00, statt des abweichenden "pulsing-tone". (2) Der Tick-Loop spielt jetzt nur noch
die zuletzt fällige feste Stufe wirklich ab, falls durch einen verzögerten Tick (gedrosselter Hintergrund-Tab)
mehrere Schwellen im selben Tick überschritten werden - genau dieselbe Absicherung, die es für die minütlichen
Wiederholungstöne ab +4 Min schon seit dem 10.08. gibt, war für die festen Stufen (-30s bis +3 Min) nie gebaut.
**Begründung:** Bei Minute 3 liefen zwei gegeneinander klingende Töne gleichzeitig. Ursache:
wenn der Tick durch Tab-Drosselung verzögert wird, können zwei Schwellen (z.B. +2 Min und +3 Min) im selben
Tick fällig werden und dann nahezu gleichzeitig abspielen. Mit gleichem Klangcharakter klingt ein solcher
seltener Doppel-Treffer wie ein einzelner, etwas voller Ton statt wie zwei widersprüchliche Klänge.
**Alternative:** Nur den Klangcharakter angleichen, den Tick-Loop unangetastet lassen. Verworfen, weil das nur
das Symptom für genau diese eine Minuten-Kombination kaschiert hätte, nicht die Ursache.

## 25.08.2026 Zehn Teilnehmende statt sechs

**Entscheidung:** Teilnehmerzahl auf zehn erhöht (P07-P10 als neue Accounts angelegt), Probelauf-Person
entsprechend zur "elften Person" statt "siebten Person".
**Begründung:** Empfehlung von meine Beraterin.
**Alternative:** Bei sechs bleiben. Verworfen auf Empfehlung.

## 25.08.2026 Offenes Sitzungsende statt fester 120 Minuten

**Entscheidung:** Keine Obergrenze für die Sitzungsdauer mehr. Teilnehmende arbeiten so lange, wie sie
möchten, und beenden selbst über den vorhandenen "Sitzung beenden"-Knopf. Rundenzähler war im Code ohnehin
schon unbegrenzt (reines Hochzählen, kein Cap) - es musste nichts entfernt werden, nur die Dokumentation
(CLAUDE.md, SPEZIFIKATION.md, CHECKLIST.md) beschrieb noch "ca. 120 Min / 4 Runden" als falschen Eindruck
einer Grenze. Gesamtdauer wird im Export (`participants.csv`, Spalte `durationMin`) aus `endedAt - startedAt`
berechnet, nicht redundant als eigenes DB-Feld gespeichert - beide Zeitstempel existieren schon.
**Begründung:** Mehr Zyklen bedeuten mehr Gelegenheiten zur Intervallanpassung, der aussagekräftigsten
Datenquelle der Studie, und entspricht realer Nutzung besser als eine künstliche Grenze.
**Folge für die Auswertung:** Unterschiedliche Sitzungslängen pro Person - die Zyklenanzahl muss pro Person
mitberichtet werden, gehört als Punkt in die Limitationen.
**Alternative:** Bei fester Obergrenze bleiben. Verworfen, siehe Begründung.

## 25.08.2026 Reaktionslatenz zum Tab-Rückkehr protokolliert

**Entscheidung:** Jedes `NUDGE_STAGE_0` bis `_3`-Ereignis speichert jetzt zusätzlich im Payload
`tabVisibleAtNudge: true | false` (Tab-Sichtbarkeit in genau dem Moment). Im Export (`cycles.csv`) daraus drei
neue Spalten je Runde: `nudgeStage1At`, `firstTabVisibleAfterNudge` (nächstes `TAB_VISIBLE` danach) und
`latencyToTabReturnSeconds` (Differenz, leer wenn der Tab durchgehend sichtbar war). Kein neuer Frontend-Code
nötig, die Basis-Ereignisse (`NUDGE_STAGE_*`, `TAB_VISIBLE`) gab es schon.
**Begründung:** Misst objektiv, ob ein zurückhaltender Hinweis überhaupt wahrgenommen wird - direkt relevant
für die Forschungsfrage, unabhängig von der Selbstauskunft in der Nachbefragung.

## 25.08.2026 Überzeit-Anzeige in die Hinweis-Karte verschoben

**Entscheidung:** Die "+MM:SS seit Rundenende"-Anzeige steht jetzt direkt in `NudgeCard`/`NudgeModal`, über
den beiden Knöpfen "Pause starten"/"Überspringen", statt separat mittig auf dem Bildschirm.
**Begründung:** Die Anzeige war nicht zu finden: sie war zwar da, stand aber an einer eigenen zentrierten
Stelle im Layout, während `NudgeModal` (Stufe 3) als `fixed inset-0` zentriertes Fenster optisch genau darüber
lag und sie damit verdeckte. Direkt in der Karte ist sie unübersehbar mit der Entscheidung verbunden, die sie
begründet.
**Alternative:** Position der alten Anzeige anpassen. Verworfen, direkt in der Karte ist eindeutiger.

## 26.08.2026 Aktivitätserfassung im Tab (ACTIVITY_TICK)

**Entscheidung:** Neuer Hook `useActivityTicks.ts`: zählt `mousemove`/`wheel` (zusammen als `mouseMoves`),
`mousedown` (`clicks`) und `keydown` (`keyPresses`) auf `window`, sendet einmal pro Minute ein `ACTIVITY_TICK`
mit den vier Aggregaten plus `tabVisible`. Kein Tick, wenn der Tab am Ende der Minute nicht sichtbar ist.
**Begründung:** mein Vorschlag, objektives Signal für "wie oft schaut jemand zur Anwendung" als Grundlage
für eine mögliche spätere Desktop-Erweiterung.
**Einschränkung, bewusst mitdokumentiert (siehe SPEZIFIKATION.md Abschnitt 4):** Erfasst nur Eingaben im
eigenen Fenster. Während der eigentlichen Arbeitsphase arbeiten Teilnehmende erwartungsgemäß in einer
anderen Anwendung (Regel 7: bewusst fast leerer Bildschirm) - `keydown` braucht Tastaturfokus im Tab,
`mousemove` braucht den Cursor über dem Fenster. Beides ist während echter Arbeit woanders selten der Fall.
Die meisten Ticks werden also nahe 0 liegen und sind inhaltlich nah an dem, was `TAB_VISIBLE`/`TAB_HIDDEN`
schon zeigt. Trotzdem umgesetzt, da harmlos (keine Inhalte, nur Zähler) und explizit gewünscht - die
Erwartungen an den Erkenntniswert sollten aber niedrig bleiben.
**Alternative:** Nicht bauen, da die Aussagekraft während der Arbeitsphase gering ist. Verworfen auf
ausdrücklichen Wunsch.

## 26.08.2026 "Noch 5 Minuten" (BREAK_SNOOZED) wieder eingeführt

**Entscheidung:** Dritte Option neben "Pause starten"/"Überspringen" in `NudgeCard` und `NudgeModal`: fest
5 Minuten, nicht wählbar, keine Obergrenze fürs wiederholte Snoozen. Verschiebt nur die Eskalation (eigener
Bezugspunkt `nudgeEndsAt`, getrennt von der echten Rundenendzeit `endsAt`), nicht die Rundenlänge selbst -
danach beginnt sie wieder bei Stufe 1, Ton eingeschlossen. Eigener Ereignistyp `BREAK_SNOOZED` mit
`{ stage, secondsAfterEnd }`, getrennt von `BREAK_ACCEPTED`/`BREAK_SKIPPED`. Anzahl pro Runde als `snoozeCount`
in `cycles.csv`.
**Wichtig, direkter Bezug zur Entscheidung vom 05.08.2026 ("Kein Verschieben um 5 Minuten"):** Das ist
bewusst kein Rückfall in die damals verworfene Funktion. Die alte Funktion hat blind die **Rundenlänge**
verändert, ohne Minutenangabe - genau das war das Problem, das seitdem das Kurzfeedback (F8) löst. Der neue
Snooze ändert die Rundenlänge überhaupt nicht, er verschiebt nur, wann der Hinweis erneut auftaucht. Da er
als eigener Ereignistyp getrennt geloggt wird, bleibt die Kernkennzahl (bei welcher Stufe wird wirklich
reagiert) unberührt.
**Begründung für fest statt wählbar:** Ein Minuten-Regler mitten im bewusst ruhigen Hinweis würde Regel 8
widersprechen (sanft, nicht aufdringlich), und feste 5 Minuten machen `snoozeCount` über alle zehn Personen
vergleichbar. Keine Obergrenze, weil das der zitierten Nutzerautonomie (De Russis & Monge Roffarello 2017)
widersprechen würde - häufiges Snoozen ist selbst ein Befund, kein Fehlverhalten, das verhindert werden muss.
**Alternative:** Wählbare Dauer. Verworfen wegen der UI-Komplexität an der falschen Stelle und schlechterer
Vergleichbarkeit der Daten.

**Nachtrag 26.08.2026:** Der Bildschirm blieb während der 5-Minuten-Gnadenfrist komplett leer (nur "Sitzung
beenden" sichtbar) - bewusst so gebaut, um ein verwirrendes "0:00" zu vermeiden. Das war falsch: es wirkte
wie ein Fehler ("Timer geht weg, unsichtbar"). Korrigiert: eigener Countdown "Nächster Hinweis in M:SS" während
der Gnadenfrist, gespeist aus `useCountdown(nudgeEndsAt)`. Leere Bildschirme sind nicht automatisch das ruhige
Design, das Regel 7 will - eine Person muss trotzdem erkennen können, dass etwas passiert.

## 26.08.2026 Pausenzeit hat Vorrang vor Aktivitätsdauer

**Entscheidung:** `readyToContinue` in `BreakScreen` hängt nur noch von `breakDone` ab, nicht mehr zusätzlich
von `allStepsDone`. Die Aktivitätsanzeige wird ausgeblendet, sobald die Pause vorbei ist, auch wenn die
Aktivität selbst noch laufen würde.
**Begründung:** Getestet mit einer 2-Minuten-Pause und einer länger dauernden Aktivität: "Sitzung
starten" erschien erst, wenn die Aktivität zu Ende war, nicht wenn die Pause endete. Aktivitäten haben feste
Presets (2/3/5 Min), die Pause ist aber frei einstellbar (initialBreakMin, zusätzlich per Kurzfeedback
anpassbar) - eine kürzere Pause als das gewählte Aktivitäts-Preset ist ein realistischer Fall, nicht nur ein
Testartefakt.
**Alternative:** Aktivität immer zu Ende laufen lassen, auch über die Pausenzeit hinaus. Verworfen, das war
genau der gemeldete Bug.

## 26.08.2026 Pausenende-Countdown reagiert jetzt auf Tab-Rücksprung

**Entscheidung:** `useBreakEndSound.ts` prüft jetzt zusätzlich sofort bei jedem `visibilitychange`, nicht nur
im 200ms-Takt.
**Begründung:** Bei einer Pause kam nur das Endsignal an, keiner der zehn Klopftöne davor. Ursache:
jeder Klopfton hat nur eine einzige Sekunde Zeitfenster, in dem der Tick ihn treffen muss - bei gedrosseltem
Hintergrund-Tab (realistisch, da man während der Pause meist nicht auf den Bildschirm schaut) reicht das
leicht zum Verpassen. Das Endsignal dagegen trifft bei jedem Tick nach 0:00 erneut zu, deshalb kam nur das an.
**Alternative:** Taktrate weiter erhöhen. Verworfen, das hilft nicht gegen Browser-Drosselung selbst, nur die
Rückkehr zum Tab kann das zuverlässig auslösen.

## 01.09.2026 Ethikvotum nicht erforderlich, Phase A im Kern abgeschlossen

**Entscheidung:** Kein Ethikvotum nötig (Aussage der Betreuung), ein Antrag hätte ohnehin ~2 Monate gedauert
und war zeitlich nicht machbar. Einwilligungstext inhaltlich abgestimmt bis auf die Aufbewahrungsfrist (siehe
nächster Eintrag).
**Begründung:** Klare Aussage der Betreuung im Gespräch Ende August 2026, hier am 01.09.2026 nachgetragen.
**Bezug:** Aktualisiert den Stand aus dem 04.08.2026-Eintrag "Ethikvotum" (dort noch offen, jetzt geklärt).

## 01.09.2026 "Final abgeben" entfernt, Sitzung schließt nur über Nachbefragung ab

**Entscheidung:** Der manuelle "Final abgeben"-Knopf auf der Hub-Seite (`/study`) ist komplett entfernt,
inklusive der Komponente `finalize-session-button.tsx`. Nach Sitzungsende stehen nur noch zwei Optionen als
richtige Knöpfe (vorher Textlinks): primär "Weiter zur Nachbefragung", sekundär "Sitzung fortsetzen".
`SESSION_FINALIZED` wird ausschließlich noch automatisch beim Absenden der Nachbefragung gesetzt (das gab es
schon vorher in `post-survey-form.tsx`, unverändert) - der Weg darüber hinweg entfällt.
**Begründung:** Befund der Betreuung im Gespräch Ende August 2026, hier am 01.09.2026 umgesetzt:
"Final abgeben" ließ sich versehentlich klicken, sperrte die Sitzung endgültig und machte die Nachbefragung
dauerhaft unerreichbar - echter Datenverlust, kein Trainingsfehler.
**Bezug:** Ändert die Entscheidung vom 05.08.2026 ("Sitzung fortsetzen oder final abgeben") ab - der
Unfall-Schutz (Reopen) bleibt, der zweite, riskantere Weg (manuelles Final-Abgeben) nicht.
**Alternative:** Nur eine Sicherheitsabfrage vor "Final abgeben" ergänzen. Verworfen, es gab schon eine
Rückfrage und trotzdem kam der Bug vor - die Option muss ganz weg, nicht nur schwerer erreichbar werden.

## 01.09.2026 Restzeit größer, Rundenanzeige ergänzt

**Entscheidung:** Drei Änderungen am Arbeits-/Pausenbildschirm: (1) Restzeit deutlich größer dargestellt,
weiterhin kontrastarm. (2) Während der Arbeitsphase testweise nur Minuten statt M:SS
(`formatRemainingMinutes`, aufgerundet) - am 12.09. wieder zurückgenommen, siehe dortigen Eintrag. (3) Kleine,
kontrastarme Zeile "Fokus · Runde N" bzw. "Pause · Runde N" oberhalb der Restzeit, aus der schon
gespeicherten Zyklusnummer, keine neue Zählung.
**Begründung:** Befund der Betreuung im Gespräch Ende August 2026, hier am 01.09.2026 umgesetzt: nicht
erkennbar, ob Arbeits- oder Pausenphase läuft; Restzeit zu klein zum Lesen aus normalem Sitzabstand -
Zielkollision aufgelöst durch "groß, aber kontrastarm" statt "klein".
**Alternative:** Fortschrittsbalken oder Prozentanzeige statt Minutenzahl. Verworfen, das wäre näher an einer
Statistik-Anzeige als die Betreuung wollte.

## 01.09.2026 "Sitzung beenden" als richtiger Knopf statt Textlink

**Entscheidung:** `EndSessionButton` bekommt einen sichtbaren Rahmen statt nur blassem Text.
**Begründung:** Befund der Betreuung im Gespräch Ende August 2026, hier am 01.09.2026 umgesetzt: der Knopf
war zu unauffällig, um zuverlässig gefunden zu werden. Weiterhin klein und am Rand, mit Rückfrage vor dem
Beenden - erkennbar, aber nicht dominant.

## 01.09.2026 Aufbewahrungsfrist auf 11.11.2027 (ein Jahr nach der ursprünglichen Frist)

**Entscheidung:** Einwilligungstext geändert von festem Datum 11.11.2026 auf festes Datum 11.11.2027.
**Begründung:** Vorgabe der Betreuung im Gespräch Ende August 2026: relative Angabe raus, konkretes Datum
rein - ein Jahr länger als die ursprünglich geplante Frist.

## 12.09.2026 Vorbefragung in vier Blöcke geteilt, Einstellung von Verhalten getrennt

**Entscheidung:** Die alte D1-D5/V1-V7-Fassung ist komplett ersetzt durch vier Blöcke: A (Person und
Tätigkeit), B (tatsächliches Pausenverhalten), C (Einstellung), D (typisches Befinden am Ende eines
Arbeitstages). "Wie oft machst du bewusst Pausen?" (Skala) und "Wie zufrieden bist du mit deiner
Pausenroutine?" entfallen ersatzlos, dafür neu in Block B: "Machst du bewusst Pausen?" (Ja/Nein, bei Ja
zusätzlich die Anzahl pro Tag), "Nutzt du Hilfsmittel?" (Ja/Nein, bei Ja Freitext welche/wie regelmäßig) und
"Beschreibe kurz, wie du Pausen machst" (Freitext). Bei "Nein" wird das jeweilige Anschlussfeld leer
mitgespeichert, nicht übersprungen.
**Begründung:** Befund der Betreuung: die alte Fassung vermischte an mehreren Stellen Einstellung
("wie wichtig/zufrieden") und tatsächliches Verhalten - beides misst etwas anderes und sollte nicht in einer
Skala beantwortet werden.
**Bezug:** V7 ("wie ausgeruht jetzt gerade") ist raus aus der Vorbefragung, siehe nächster Eintrag.

## 12.09.2026 Zustand direkt vor der Sitzung wandert vom Fragebogen zum Sitzungsstart

**Entscheidung:** `/study/start` fragt jetzt zusätzlich zur Tätigkeit "wie ausgeruht" und "wie konzentriert"
fühlst du dich jetzt gerade (Skala 1-7). Ersetzt das alte V7 aus der Vorbefragung. Gespeichert als eigene
Felder auf `Session` (`restedAtStart`, `focusAtStart`) statt in der Vorbefragung, landen aber weiterhin in
`participants.csv`.
**Begründung:** Eine Messung unmittelbar vor der Sitzung ist ein verlässlicherer Vergleichswert als eine
Einschätzung des typischen Zustands (Vorbefragung kann zeitlich vor der eigentlichen Sitzung liegen) - beide
Werte lassen sich jetzt direkt gegen N1/N2 aus der Nachbefragung stellen.
**Alternative:** Als weiteren `SurveyResponse`-Eintrag mit `phase: "PRE"` nachspeichern. Verworfen, eigene
Session-Felder sind einfacher abzufragen und die Sitzung existiert an dieser Stelle bereits.

## 12.09.2026 Feedback zur Bedienoberfläche in der Nachbefragung ergänzt

**Entscheidung:** Neues optionales Freitextfeld N20 "Wie hat dir die Bedienoberfläche gefallen? Was würdest
du daran ändern?", steht im Formular vor den bestehenden Feldern N17-N19. Die neun PPS-Items und die vier
Obtrusiveness-Items bleiben unverändert in Wortlaut und Reihenfolge.
**Begründung:** Vorgabe der Betreuung, zusätzliches Feedback zur Bedienung einzusammeln.

## 12.09.2026 Arbeits- und Pausenbildschirm visuell überarbeitet

**Entscheidung:** Beide Bildschirme bekommen einen sehr sanften, langsam atmenden Farbfleck im Hintergrund
(kühl bei Arbeit, warm bei Pause), die Restzeit steht jetzt groß in einem dezenten Rahmen statt als nackter
Text, und die Rundenbeschriftung ist eine kleine Pille statt Fließtext. Reine Typografie/Layout-Änderung,
keine neue Information: kein Fortschrittsbalken, keine Kennzahl, keine Motivationssprüche, weiterhin
kontrastarm. Nebenbei global behoben: `body` nutzte trotz konfigurierter Geist-Schriftart hart Arial.
**Begründung:** Holly fand den bisherigen Stand (reiner Grau-Text auf Weiß) "zu langweilig und trocken", zu
minimalistisch statt bewusst schlicht.
**Bezug:** Ändert nichts an Regel 7 (weiterhin kontrastarm, weiterhin fast leer) - nur wie das umgesetzt ist.

## 12.09.2026 Sekundenanzeige in der Arbeitsphase doch wieder da

**Entscheidung:** Die Arbeitsphase zeigt die Restzeit wieder als M:SS (`formatRemaining`), genau wie die
Pause - nicht mehr nur Minuten.
**Begründung:** mein ausdrücklicher Wunsch, nach dem visuellen Überarbeiten von Fokus- und
Pausenbildschirm am selben Tag. Der Eintrag vom 01.09. ("Restzeit größer, Rundenanzeige ergänzt") hatte die
testweise Minuten-Anzeige fälschlich mit einem Befund der Betreuung begründet. Holly/Orhan haben
das nie so gesagt, diese Zuschreibung war schlicht falsch.
**Alternative:** Bei Minuten bleiben. Auf Nachfrage klar abgelehnt.

## 12.09.2026 "Sitzung beenden" nach oben rechts verschoben, eigener Bestätigungsdialog

**Entscheidung:** Der Knopf steht jetzt oben rechts statt unten links, und die Rückfrage vor dem Beenden ist
ein eigenes Fenster im Stil des Pausenhinweises statt `window.confirm()`.
**Begründung:** Der Knopf unten links überlappte in der lokalen Entwicklung mit dem Next.js-Dev-Icon; der
native Browser-Dialog wirkte hässlich und primitiv.

## 14.09.2026 Pause manuell starten, ohne auf den Hinweis zu warten

**Entscheidung:** Neuer, zurückhaltender Knopf „Pause jetzt starten" unten rechts, sichtbar solange die
Arbeitsphase läuft und noch kein Hinweis erschienen ist. Beendet die Runde sofort und führt direkt zur
Aktivitätsauswahl - kein Kurzfeedback, keine Intervallanpassung für diese Runde, die nächste läuft mit dem
bisherigen Wert weiter. Neues Ereignis `BREAK_SELF_INITIATED` mit
`payload: { cycleNumber, secondsIntoWork }`. In `cycles.csv` über `reactionType: "SELF_INITIATED"` sichtbar
(neuer Wert, bestehende Werte unverändert) plus eigener Spalte `reactionSecondsIntoWork`.
**Begründung:** Vorgabe: Nutzende sollen eine Pause auch aus eigenem Antrieb beginnen können, nicht
nur als Reaktion auf den Systemhinweis.
**Bezug:** Kein Kurzfeedback in diesem Fall, weil es nichts zu bewerten gibt ("war der Zeitpunkt passend"
bezieht sich auf den *Hinweis*, den es hier nicht gab). Die `workMin`-Spalte in `cycles.csv` wird dafür
jetzt fortlaufend mitgeführt statt je Runde nur aus dem direkt vorherigen `CycleFeedback` abgeleitet - sonst
stünde die Arbeitszeit der Runde nach einer selbst gestarteten Pause fälschlich leer da.

## 14.09.2026 Pausenanleitung wird vorgelesen

**Entscheidung:** Jeder Schritt der Aktivitäts-Anleitung (Augenentlastung, Nacken und Schultern, Aufstehen)
wird einmal per `speechSynthesis` vorgelesen (`useSpeech.ts`, neuer Hook). Deutsche Stimme, falls verfügbar,
sonst Standardstimme; unter mehreren deutschen Stimmen wird die vermutlich natürlichste gewählt (Heuristik:
"Online"/"Natural"/"Google" im Namen, Netzwerk- statt lokale Stimme bevorzugt - die eigentliche Klangqualität
liefert das Betriebssystem, wir wählen nur unter dem Verfügbaren aus). `rate` 0.9. Schalter „Sprachausgabe:
an/aus" direkt bei der Anleitung, Voreinstellung an, protokolliert als `SPEECH_TOGGLED` mit `{ enabled }`.
Laufende Ausgabe wird abgebrochen (`speechSynthesis.cancel()`), sobald der Schritt wechselt, die Anleitung
endet oder die Pause vorbei ist - sonst überlappt es mit dem nächsten Bildschirm. Ohne `speechSynthesis` im
Browser: kein Fehler, Text erscheint wie bisher nur schriftlich.
**Begründung:** Vorgabe. Bei der Augenentlastung schaut man bewusst vom Bildschirm weg - ein reiner
Anleitungstext ist in dem Moment funktional unbrauchbar, weil er sich nicht lesen lässt. Bei der
Nackenübung abgeschwächt dasselbe Problem.
**Bezug:** Ausschließlich in den Pausenanleitungen, nicht in der Arbeitsphase und nicht beim Pausenhinweis -
dort bleibt es bei der bewusst zurückhaltenden Gestaltung (Regel 7/8).
**Getestet:** Per Playwright mit instrumentiertem `speechSynthesis` (echte Audioausgabe lässt sich headless
nicht prüfen) - Text, Sprechgeschwindigkeit, Sprache und gewählte Stimme pro Schritt korrekt, kein erneutes
Vorlesen bei ausgeschaltetem Schalter, Fortsetzen beim Wiedereinschalten erst beim nächsten Schritt, Ereignis
`SPEECH_TOGGLED` mit korrektem `enabled`-Wert in beide Richtungen. Auf diesem Windows-Entwicklungsrechner
liefert Chromium tatsächlich eine deutsche Stimme ("Microsoft Katja") - auf anderen Rechnern/Systemen kann
das abweichen oder ganz fehlen, deshalb der Fallback auf die Standardstimme bzw. reinen Text.

## 14.09.2026 Onboarding auf drei Bildschirme verdichtet, leere Zwischenseite weg

**Entscheidung:** Einwilligung bleibt ein eigener Schritt, aber alles zwischen Einwilligung und Sitzungsstart
ist jetzt genau drei Bildschirme ohne Zwischenklick:
1. `/study/pre`, Schritt 1: Block A (Person/Tätigkeit) - Titel "Willkommen! Ein paar Angaben zu deinem
   Arbeitsalltag.", Knopf "Weiter (1/2)".
2. `/study/pre`, Schritt 2 (gleiche Seite, gleiche Komponente, nur Client-State): Block B+C+D - Titel "Noch
   dein Pausenverhalten.", Knöpfe "Zurück" (Antworten aus Schritt 1 bleiben erhalten) und "Profil
   speichern & Weiter" (erst hier tatsächlich `POST /api/survey`, beide Schritte zusammen als eine
   `SurveyResponse`). Die Frage nach der typischen Konzentration (frühere D2) ist ersatzlos gestrichen.
3. `/study` selbst, sobald Profil steht und die Sitzung noch nicht läuft: kombiniertes Dashboard mit
   Begrüßung "Hallo {Code}!", den drei situativen Feldern (Tätigkeit, ausgeruht, konzentriert - wie zuvor
   unter `/study/start`) und einem großen Knopf "🚀 Fokus-Sitzung starten", der bei Erfolg sofort zu
   `/study/session` springt statt zurück zum Dashboard.
Die alte, inhaltsleere "Eingeloggt als..."-Seite (nur Text + Link) ist komplett weg, `/study/start` als
eigene Route ebenso - dessen Inhalt (`start-form.tsx`) ist jetzt `dashboard-start-form.tsx` und wird direkt
von `/study/page.tsx` gerendert, sobald der Zustand passt. Alle anderen Zustände von `/study` (Sitzung
läuft, beendet, abgeschlossen) sind unverändert, nur im selben File zusammengeführt statt über Links auf
separate Seiten zu verweisen.
**Begründung:** Vorgabe: "Time-to-Value" (Zeit bis der Timer läuft) drastisch verkürzen, keine
Bildschirme ohne eigenen Zweck.
**Bezug:** Ändert nichts am Datenmodell oder an der API - `POST /api/survey`, `PATCH /api/session/:id/start`
und die Feldnamen bleiben exakt wie in den Einträgen vom 12.09. Betrifft ausschließlich, wie das Formular im
Browser aufgeteilt ist und wie `/study` je nach Sitzungszustand rendert.
**Getestet:** Per Playwright, kompletter Durchlauf von Login bis Timer-Ansicht - Weiterleitung ohne Klick
nach Login/Einwilligung, Pflichtfeld-Validierung pro Schritt, Antworten bleiben beim Zurückgehen erhalten,
D2 tatsächlich nicht mehr vorhanden, Dashboard zeigt korrekten Teilnehmercode, `PATCH .../start` liefert 200
und die Seite springt direkt zur Timer-Ansicht.

## 14.09.2026 Erster vorgelesener Schritt klang anders als die folgenden

**Entscheidung:** `useSpeech.ts` spricht jetzt erst, wenn `voicesReady` true ist (neuer Rückgabewert des
Hooks) - `BreakScreen` wartet damit vor dem allerersten Vorlesen kurz, statt sofort loszulegen.
**Begründung:** Bei der Augenentlastung ist aufgefallen, dass der erste Anleitungsschritt mit einer anderen,
roboterhafter klingenden Stimme gesprochen wurde als Schritt 2 und 3. Ursache: `speechSynthesis.getVoices()`
liefert bei manchen Browsern (v.a. Chrome/Chromium) direkt nach dem Laden der Seite noch eine leere Liste,
die echte Stimmenliste kommt asynchron über das `voiceschanged`-Ereignis nach. Der Hook wählte beim allerersten
Aufruf also aus einer leeren Liste (Ergebnis: keine Stimme gesetzt, Browser nimmt seine eigene Standardstimme),
und erst ab dem zweiten Aufruf stand die eigentlich gewünschte, bessere Stimme fest. Jetzt wird auf
`voiceschanged` gewartet (mit 300ms-Fallback, falls das Ereignis nie feuert), bevor überhaupt gesprochen wird.
**Bezug:** Reine Bugfix, an der Stimmauswahl-Heuristik selbst (siehe Eintrag oben) ändert sich nichts.

## 14.09.2026 Emoji im "Zurück"-Knopf entfernt

**Entscheidung:** Der Knopf in der Vorbefragung heißt jetzt nur noch "Zurück", ohne das 🔙-Emoji davor.
**Begründung:** Es wirkte kindisch, und das Emoji zeigt in den meisten Emoji-Schriftarten zusätzlich
den englischen Schriftzug "BACK" mit an, was neben dem deutschen "Zurück" unpassend aussah.

## 14.09.2026 Hydration-Fehler nach Reload mitten in einer Pause

**Entscheidung:** `useRoundTimer.ts` startet den allerersten Render (Server UND Client) immer mit dem
Server-Fallback (Runde WORK) und liest `sessionStorage` erst in einem `useEffect` nach dem Hydrieren, statt
direkt im `useState`-Initializer.
**Begründung:** Beim Reload eines `/study/session`-Tabs mitten in einer Pause kam ein React-
Hydration-Fehler ("server rendered HTML didn't match the client"). Ursache: `useRoundTimer` las
`sessionStorage` bisher direkt im `useState`-Initializer - der läuft aber beim allerersten Render sowohl auf
dem Server (kein `sessionStorage`, also immer der Fallback "WORK") als auch beim Hydrieren im Browser (dort
schon echtes `sessionStorage`, z.B. mit Stand "BREAK"). Genau der von React selbst genannte Klassiker
`if (typeof window !== 'undefined')`. React erkannte den Unterschied, verwarf den betroffenen Teilbaum und
baute ihn neu auf - funktional passierte nichts Schlimmes, aber sichtbar als Fehler und nicht sauber.
**Bezug:** Rein technischer Bugfix, das eigentliche Verhalten (Reload verliert den Rundenstand nicht) bleibt
wie in den früheren Einträgen zu `useRoundTimer` beschrieben.
**Getestet:** Per Playwright - Runde per "Pause jetzt starten" in den BREAK-Zustand gebracht, Seite neu
geladen, keine Hydration-Fehler mehr in der Konsole (vorher reproduzierbar der exakt gemeldete Fehler).

## 14.09.2026 "Sitzung fortsetzen" führte auf eine hässliche Zwischenseite

**Entscheidung:** Läuft die Sitzung bereits (`startedAt` gesetzt, `endedAt` noch leer), leitet `/study` jetzt
direkt zu `/study/session` weiter (`redirect()`), statt eine eigene Info-Seite mit Textlink "Zur Sitzung" zu
zeigen.
**Begründung:** Nach "Sitzung fortsetzen" (Reopen) fiel das unangenehm auf: erst der
Bestätigungsdialog zum Beenden, dann diese zusätzliche, spärliche Zwischenseite mit einem Link statt einem
Knopf, bevor man wirklich zurück im Timer war - zu viele Schritte für "ich will einfach weiterarbeiten".
**Bezug:** Gleiche Logik wie beim Dashboard (12./14.09.): gibt es an dieser Stelle nur einen sinnvollen
nächsten Schritt, wird direkt dorthin weitergeleitet statt eine Zwischenseite mit einem Klick zu zeigen.
Betrifft nicht nur den Reopen-Fall, sondern jeden Login während einer laufenden Sitzung.

## 14.09.2026 Nachbefragung auf drei Seiten aufgeteilt, mit Lesezeit-Messung

**Entscheidung:** `/study/post` ist jetzt ein Drei-Schritte-Formular in einer Komponente (Client-Zustand,
wie schon bei der Vorbefragung): (1) N1/N2/N16 plus direkt darunter N17, (2) die validierten Skalen N3-N15
mit einer einzigen Instruktion+Legende und einer schlichten grauen Trennlinie ohne Text zwischen den beiden
Skalen, (3) N19/N18/N20 als optionale Freitexte in dieser Reihenfolge. Dezenter Fortschritt "Schritt X von
3" oben auf jeder Seite. Wortlaut und Reihenfolge der neun PPS- und vier Obtrusiveness-Items unverändert.
Zusätzlich wird je Seite `page_load_timestamp`/`page_submit_timestamp` erfasst (`answers.pageTimings`,
gleiche `SurveyResponse` wie bisher) und im Export als `postPage1Seconds` bis `postPage3Seconds` in
`participants.csv` aufbereitet (Differenz in Sekunden).
**Begründung:** Vorgabe: kognitive Last durch Paging reduzieren, ohne methodische Standards zu
verletzen (keine wertenden Zwischenüberschriften, kein Priming). Die Lesezeit je Seite soll später helfen,
Blindklicker (Leute, die ohne zu lesen durchklicken) als Ausreißer zu erkennen.
**Bezug:** N17 gehörte bisher zu den gesammelten Freitextfeldern am Ende, steht jetzt inhaltlich direkt bei
der Vergleichsfrage N16, zu der es sich äußert. Ändert nichts an den IDs, Pflichtfeldern oder am
Datenmodell - nur an Seitenaufteilung und Reihenfolge im Formular.
**Getestet:** Per Playwright, kompletter Durchlauf mit allen drei Seiten - Pflichtfeld-Validierung je Seite,
Antworten bleiben beim Zurückblättern erhalten, N19/N18/N20 in der vorgegebenen Reihenfolge, `POST
/api/survey` und `PATCH .../finalize` liefern beide 200, `pageTimings` korrekt in der Datenbank, neue
Export-Spalten in `participants.csv` vorhanden und korrekt berechnet.

## 14.09.2026 Restliche Bildschirme optisch an den Rest angeglichen

**Entscheidung:** Login, Einwilligung, Abschlussseite, Kurzfeedback und Aktivitätsauswahl bekommen denselben
ruhigen, atmenden Hintergrund-Farbfleck wie Fokus-/Pausenbildschirm und Dashboard - dafür eine neue neutrale
Variante `--glow-neutral`/`.phase-glow-neutral` (weder Arbeit-Blau noch Pause-Grün, für alles, was zu keiner
Phase gehört). Inhalte selbst unverändert, nur Rahmen/Karten-Optik und der Farbfleck ergänzt. Login bekommt
zusätzlich eine kleine "FocusArchitect"-Kennzeichnung über der Überschrift - vorher stand nirgends, welche
App das überhaupt ist.
**Begründung:** Vorgabe: alles, was Teilnehmende sehen, soll einheitlich aussehen. Vorher wirkten
diese Bildschirme merklich schlichter/älter als die frisch überarbeiteten Fokus-/Pausen- und Onboarding-
Bildschirme.
**Bezug:** Rein optisch, keine Text- oder Verhaltensänderung. Dashboard, Vorbefragung und Nachbefragung
haben denselben Farbfleck ergänzt bekommen, obwohl nicht explizit genannt - für echte Einheitlichkeit über
den gesamten sichtbaren Ablauf.

## 14.09.2026 Alter Pausenhinweis erschien nach einem Reload während Pause/Kurzfeedback wieder

**Entscheidung:** `NudgeCard`/`NudgeModal` werden jetzt nur noch gerendert, wenn `state === "WORK"` ist,
nicht mehr nur abhängig von `!hasReacted`.
**Begründung:** Nach "Sitzung beenden am Ende einer Pause" kam ein widersprüchlicher Bildschirm:
"Pause vorbei." mit dem "Sitzung starten"-Knopf UND gleichzeitig die Hinweis-Karte "Zeit für eine Pause" mit
"Seit Rundenende: +0:24". Ursache: `hasReacted` (und der Bezugspunkt der Eskalation, `nudgeEndsAt`) sind
gewöhnlicher React-State in `SessionTimer`, nicht Teil des in `sessionStorage` gesicherten Rundenzustands -
nach einem Reload/Remount fallen sie auf ihren Ausgangswert zurück (`hasReacted = false`), während der
eigentliche Rundenzustand (z. B. "BREAK") korrekt aus `sessionStorage` wiederhergestellt wird. Traf das
Remount auf einen Moment, in dem die alte Rundenendzeit schon eine Weile zurücklag, interpretierte die
Hinweis-Logik das fälschlich als "Stufe 1/2 erreicht" - obwohl man sich längst in einer ganz anderen Phase
befand. Die Daten selbst waren nicht betroffen: `useNudgeSoundSchedule`/`useNudgeStageLogging` hatten schon
vorher ein `state === "WORK"`-Gate, nur die beiden sichtbaren Komponenten nicht.
**Bezug:** Vermutlich durch den Hydration-Fix vom selben Tag erst richtig auffällig geworden - vorher wurde
der betroffene Teilbaum bei einem Hydration-Mismatch ohnehin verworfen und neu aufgebaut, was den falschen
Zwischenzustand meist nur sehr kurz sichtbar machte.
**Getestet:** Per Playwright - Pause bis nach ihrem Ende laufen lassen, danach Seite neu laden; vorher
erschien die Hinweis-Karte trotz "Pause vorbei.", jetzt nicht mehr.

## 14.09.2026 Pausenaktivitäten wirkten zu passiv, jetzt mit Ring und Übergangston

**Entscheidung:** Während eines Anleitungsschritts zeigt die Pause jetzt eine eigene Ansicht: eine
Beschriftung "{Aktivität} · Schritt X von Y", einen Ring, der die Restzeit des aktuellen Schritts sichtbar
abzählt (SVG, `stroke-dashoffset`), die Anleitung selbst größer und prominenter, und die verbleibende
Gesamtpausenzeit nur noch als kleine Zeile darunter - vorher war es umgekehrt (große Pausenuhr dominant, die
eigentliche Anleitung ein kleiner Nebensatz mit eigenem kleinen Timer). Bei jedem Schrittwechsel zusätzlich
ein leiser Übergangston (`playNudgeSound(0.25, "water-drop")`, dieselbe Tonbibliothek wie beim
Pausenhinweis). Nach dem letzten Schritt erscheint wieder die normale große Pausenuhr.
**Begründung:** Befund aus dem eigenen Test aller drei Aktivitäten: "alle 20 bis 59 Sekunden nur eine
Anweisung" fühle sich trotz Sprachausgabe passiv und langweilig an. Beim Nachvollziehen bestätigt: die
visuelle Hierarchie war verkehrt - das auffälligste Element am Bildschirm (die große Zahl) war die
Gesamtpausenzeit, nicht der laufende Schritt, und zwischen den Schritten änderte sich nur ein Satz Text ohne
jedes Fortschritts- oder Wechselsignal.
**Alternative:** Ein Knopf zum manuellen Weiterschalten je Schritt. Verworfen - die Übungen (z. B. "20
Sekunden in die Ferne schauen") funktionieren nur, wenn die Zeit wirklich abläuft, ein Skip würde den
gesundheitlichen Zweck der Übung untergraben. Die Interaktivität kommt stattdessen aus reicherem Feedback
während der ohnehin nötigen Wartezeit (Ring, Ton, Fortschrittszählung), nicht aus mehr Kontrolle.
**Bezug:** "Keine Aktivität" bleibt unverändert (einfach die normale Pausenuhr, und das ist kein
Verbesserungsbedarf). Inhalt und Dauer der einzelnen Übungsschritte (`activities.ts`) unverändert, nur wie
sie während des Wartens dargestellt werden.
**Getestet:** Alle drei Aktivitäten einmal komplett per Playwright durchlaufen (Ring, Schrittzählung,
Tonaufruf ohne Fehler, korrekter Rücksprung zur normalen Pausenuhr nach dem letzten Schritt) und per
Screenshot mit der vorherigen Fassung verglichen.

## 14.09.2026 Kurze Erklärung "So funktioniert die App" vor der Vorbefragung

**Entscheidung:** Neuer Schritt 0 vor der Vorbefragung (`onboarding-intro.ts`), rein informativ: Rundenprinzip
(Arbeiten in Runden, leiser Hinweis am Rundenende, kann verschoben/übersprungen werden), dass man auch selbst
eine Pause starten kann, dass nach jeder Pause kurz nach dem Zeitpunkt gefragt wird, und dass man jederzeit
über "Sitzung beenden" aufhören kann. Nur ein "Los geht's"-Knopf, keine Pflichtfelder. Bewusst als eigener
Schritt und nicht als Zusatz im Einwilligungstext - der ist mit der Betreuung abgestimmt und bleibt
unangetastet, hier geht es nicht um Rechte/Zweck, sondern reine Bedienung. "Schritt X von 3" jetzt oben auf
allen drei Vorbefragungs-Seiten (vorher nur "Willkommen..." und "Noch dein Pausenverhalten." ohne Zählung).
**Begründung:** Befund: die Durchführung ist ortsunabhängig und unbegleitet, Teilnehmende bekommen
nur Link und Zugangsdaten per Nachricht, niemand erklärt vor Ort, wie die App bedient wird. Die Einwilligung
beantwortet nur "warum", nicht "wie".
**Bezug:** Rein zusätzlicher Inhalt, ändert nichts an Einwilligung, Datenmodell oder den bestehenden zwei
Vorbefragungs-Schritten - die zählen jetzt nur als Schritt 2 und 3 statt 1 und 2.
**Getestet:** Per Playwright - Schritt erscheint nach der Einwilligung mit korrekter Schrittzählung, "Los
geht's" führt zu Block A weiter, dort korrekt "Schritt 2 von 3".

## 14.09.2026 Phase I: Dockerfile, docker-compose.yml, Caddyfile für den Server

**Entscheidung:** Deployment-Dateien für den Hetzner-Server geschrieben: `Dockerfile` (dreistufig: deps,
builder, runner), `docker-compose.yml` (db/app/caddy), `Caddyfile`, `.dockerignore`, `.env.example`. Zwei
bewusste Abweichungen vom ursprünglichen Plan in `docs/CHECKLIST.md`:
1. Kein `output: "standalone"` in `next.config.ts`. Grund: `npx prisma db seed` (siehe `prisma/seed.ts`)
   braucht zur Laufzeit das Prisma-CLI, `tsx` und die Quelldateien unter `src/` (Pfad-Alias `@/...`) - mit
   `standalone` wird `node_modules` gerade auf das gekürzt, was der reine Next.js-Server braucht, das CLI
   wäre weg. Stattdessen bekommt die Runner-Stufe das volle `node_modules` (aus der `deps`-Stufe, nicht der
   `builder`-Stufe - keine Build-Artefakte mitschleppen) plus `src/` und `tsconfig.json` mit. Etwas größeres
   Image, dafür funktioniert `docker compose exec app npx prisma migrate deploy`/`db seed` ohne Sonderweg -
   für ein Einzelperson-Projekt auf einem eigenen Server wichtiger als ein paar hundert MB Ersparnis.
2. `node:22-bookworm-slim` statt `node:22-alpine` als Basis-Image. Alpine nutzt musl statt glibc, Prisma
   braucht dafür einen eigenen `binaryTargets`-Eintrag in `schema.prisma` - vermeidbare Fehlerquelle für den
   Einstieg. Debian "slim" ist etwas größer, dafür funktioniert Prisma ohne Sonderkonfiguration. `openssl`
   zusätzlich per `apt-get` installiert, weil die Prisma-Engine zur Laufzeit dagegen linkt und "slim" das
   nicht mitbringt.
**Begründung:** meine Bitte, Phase I jetzt umzusetzen und ihm dabei Docker/Deployment beizubringen - beide
Abweichungen sind bewusste Vereinfachungen für den Einstieg, nicht Nachlässigkeit.
**Getestet, nicht nur gebaut:** Kompletten Stack lokal hochgefahren (`docker compose up -d --build`, isolierte
Test-`.env` außerhalb des Projekts, eigener `-p`-Projektname und Port, um die echte lokale Dev-Datenbank nicht
zu berühren) - `db`-Healthcheck greift korrekt, `npx prisma migrate deploy` und `npx prisma db seed` liefen
im laufenden `app`-Container durch, Login und `/admin` funktionierten per `curl` über den echten HTTP-Port,
Caddy startet und versucht korrekt (aber erwartbar erfolglos) ein Zertifikat für die Platzhalter-Domain zu
holen. Dabei zwei echte Fehler gefunden und behoben, bevor sie auf dem echten Server aufgefallen wären: der
Seed-Befehl schlug erst fehl (fehlendes `src/`/`tsconfig.json`, siehe oben), und `credentials.local.json`
fehlte im Container (liegt per `.dockerignore` bewusst nicht im Image, jetzt stattdessen zur Laufzeit
eingehängt).
**Hinweis:** Beim Testen aus Versehen kurz die lokale `.env` mit Test-Werten überschrieben (beim
allerersten Versuch, den Stack lokal hochzufahren, bevor die isolierte Test-Env-Datei benutzt wurde) - sofort
bemerkt und mit der korrekten `DATABASE_URL` (aus `docker-compose.dev.yml` rekonstruiert) sowie einem neuen
`SESSION_SECRET` wiederhergestellt. Einzige Auswirkung: bestehende Login-Cookies in deinem Browser sind
ungültig geworden, einmal neu einloggen genügt.

## 17.09.2026 Ton-Eskalation an die vier Stufen gekoppelt

**Entscheidung:** Die bisherige eigene Ton-Zeitschiene (`useNudgeSoundSchedule.ts`, sieben und mehr Töne über
die ganze Sequenz, ab einem Punkt jede Minute wiederholt) ersetzt durch `useNudgeStageSound.ts`: genau ein Ton
je erreichter Stufe, direkt an `useNudgeStage` gekoppelt statt an einen eigenen Zeitplan. Stufe 0 bleibt
tonlos, Stufe 1 ein leiser Sinuston, Stufe 2 ein etwas deutlicherer Glockenton, Stufe 3 ein klarer
aufsteigender Ton. Danach keine Wiederholung mehr.
**Begründung:** Befund der Betreuung nach Durchsicht der Eskalationslogik - sieben Töne in einer Sequenz waren
mehr, als die Eskalation eigentlich braucht, und ein Ton bei Stufe 0 hätte aus dem kaum bewusst wahrnehmbaren
Übergang eine hörbare Vorwarnung gemacht. Die Eskalation soll über Deutlichkeit laufen, nicht über
Wiederholung - passt zur Auto-Analogie: das ist die abgestufte Geschwindigkeitsrückmeldung im Auto, nicht die
Tankanzeige.
**Bezug:** SPEZIFIKATION.md Abschnitt [6], CHECKLIST.md F6. Korrigiert dabei auch eine falsche Formulierung
der Auto-Analogie in einem früheren Chat-Bericht von mir (dort stand fälschlich "Tankwarnung") - in den
Projektdateien war die Analogie nie falsch dokumentiert, das war ein reiner Fehler in meiner Zusammenfassung.
**Getestet:** Per Playwright (`page.clock`, isolierte Test-Session außerhalb der echten Teilnehmerdaten) alle
vier Stufen und deutlich darüber hinaus durchlaufen, danach per `psql` geprüft: genau drei
`NUDGE_SOUND_PLAYED`-Ereignisse insgesamt, bei Stufe 1/2/3, keins bei Stufe 0, keine Wiederholung nach
Stufe 3.

## 17.09.2026 Pausenende-Countdown lauter, Kurzfeedback jetzt auch nach selbst gestarteter Pause

**Entscheidung:** Zwei getrennte Korrekturen, beide beim Testen aufgefallen:
1. `useBreakEndSound.ts`: die Klopftöne der letzten Sekunden vor Pausenende liefen bisher mit Intensität 0.4,
   das Endsignal (`double-chime`) mit 0.9 - reichlich leiser, dadurch praktisch unhörbar neben dem lauten
   Endsignal. Jetzt beide auf 0.9. Zusätzlich `COUNTDOWN_SECONDS` von 10 auf 9 korrigiert, damit die Klopftöne
   wirklich bei 9 beginnen und nicht bei 10.
2. `session-timer.tsx`, `initiateBreakSelf`: eine selbst gestartete Pause ("Pause jetzt starten") sprang bisher
   direkt zur Aktivitätsauswahl, ohne das Kurzfeedback ("War der Zeitpunkt der Pause passend?") zu zeigen -
   Begründung war, es gäbe keinen Systemhinweis, den man bewerten könnte. Jetzt läuft sie stattdessen wie jede
   andere Runde erst durchs Kurzfeedback (`setRound("FEEDBACK", ...)` statt `setRound("ACTIVITY_CHOICE", ...)`),
   keine neue Komponente nötig, die bestehende `FeedbackScreen`/`handleFeedbackSubmitted`-Logik greift
   unverändert.
**Begründung:** Der leise Countdown ist zweimal aufgefallen (schon am 26.08., dann erneut heute): ich höre
nur das laute Endsignal, nicht die Klopftöne davor, das Gegenteil vom beabsichtigten "beep beep runterzählen".
Beim Kurzfeedback wollte er die Frage auch nach einer freiwillig beendeten Runde gestellt haben: eine Antwort
wie "Zu früh" ist genauso aussagekräftig, egal ob die Runde durch den Systemhinweis oder aus eigenem Antrieb
endete, und soll genauso die nächste Rundenlänge beeinflussen können.
**Bezug:** SPEZIFIKATION.md Abschnitt [9] (Countdown) und [7]/[BREAK_SELF_INITIATED] (Kurzfeedback-Ausnahme
entfernt), CHECKLIST.md F5/F7/F9, `src/app/api/admin/export/route.ts` (Kommentar zu `workMinTracker`
korrigiert - CycleFeedback existiert jetzt auch für selbst gestartete Pausen, die Export-Logik selbst brauchte
keine Änderung, sie liest ohnehin generisch über die Rundennummer).
**Getestet:** Countdown-Ton per Playwright ohne `page.clock` (echte 1-Minuten-Pause, reale Zeit) verifiziert,
mit einem Patch auf `OscillatorNode.prototype.start` mitgeschnitten: genau neun Klopftöne im Sekundenabstand
(9 bis 1) plus die zwei Töne des Endsignals - exakt wie beabsichtigt. Mit `page.clock` und großen
`fastForward`-Sprüngen kam anfangs fälschlich gar kein Ton an - lag am Test, nicht am Code: zwei parallel
laufende Intervalle (200ms/1000ms), bei einem einzigen großen Sprung über viele fällige Ticks hinweg verschluckt
die simulierte Uhr offenbar Wiederholungen. Mit echter Zeit reproduzierbar korrekt. Die selbst gestartete Pause
end-zu-Ende durchgeklickt (P01, Testdaten danach entfernt): "Pause jetzt starten" → Kurzfeedback erscheint →
"Passend" → Aktivitätsauswahl → Pause, wie vorgesehen.

## 17.09.2026 Pausenhinweis: Hintergrund eskaliert mit, Karte blendet ein, Töne feinabgestimmt, Dark Mode aus

**Entscheidung:** Konkreter Gestaltungsvorschlag der Betreuung umgesetzt, vier Teile:
1. Der Hintergrund bleibt ab Stufe 0 nicht mehr konstant, sondern wandert mit jeder Stufe eine Nuance weiter:
   Beige (Stufe 0/1) → gedämpftes Bernstein (Stufe 2) → gedämpftes Terrakotta (Stufe 3), neue CSS-Variablen
   `--background-nudge-1/2/3` in `globals.css`. Bei Stufe 0 zieht zusätzlich die Zifferfarbe des Timers mit
   (`--foreground-nudge`) - der Wechsel fällt so genau dort auf, wo man ohnehin gelegentlich hinschaut.
2. Die Hinweis-Karte blendet bei Stufe 1 einmalig per CSS-Keyframe ein (`.animate-nudge-card-in`, ~400ms,
   Onset nach Hillstrom/Yantis: ein bewegter Reiz wird eher bemerkt als ein schlagartig dastehender). Das
   Wachsen zu Stufe 2 läuft über eine weiche `transition` statt eines Sprungs, dabei rückt die Karte auch
   sichtbar näher zur Mitte.
3. Die drei Töne (`soft-sine`/`soft-bell`/`rising-sweep` in `nudgeSound.ts`) feinabgestimmt: weicherer Einsatz
   (Attack von 12–20ms auf 50ms angehoben, nichts beginnt mehr abrupt) und Grundfrequenzen in den mittleren
   Bereich verschoben (440/480/350–700 Hz → 560/680/550–880 Hz), damit nichts schrill/hoch klingt. Eskalation
   bleibt über Klangfülle, nicht Lautstärke - Intensitäten unverändert.
4. Dark Mode abgeschaltet: `@custom-variant dark (&:where(.dark, .dark *))` in `globals.css` sorgt dafür, dass
   `dark:`-Klassen nirgends mehr matchen (nie eine `.dark`-Klasse gesetzt), `color-scheme: light` ergänzt. Die
   frühere `@media (prefers-color-scheme: dark)`-Variable-Definition ist entfernt.
**Begründung:** Die Betreuung fand die bisherige Umsetzung im Kern richtig, aber unvollständig gegen das
"Onset-Problem": eine Karte, die schlagartig da ist, und ein Hintergrund, der nach Stufe 0 nicht mehr
weiterwandert, lassen sich leicht übersehen. Die drei Änderungen zusammen (mitwandernde Farbe am Punkt der
Aufmerksamkeit, Bewegung beim Erscheinen, weiterlaufende Hintergrundeskalation) adressieren das, ohne von
"auffallen statt erschrecken" abzuweichen - deshalb gedämpfte Farben, kein reines Rot, keine schnelle Animation.
Bei den Tönen: ein abrupter Einsatz wirkt erschreckend, das widerspricht demselben Prinzip; zu tiefe oder zu
hohe Frequenzen wirken dumpf bzw. schrill statt klar wahrnehmbar. Dark Mode ist bei einer Studie über visuelle
Gestaltung eine unkontrollierte Variable - ein Teilnehmender mit dunkler Systemeinstellung hätte sonst eine
andere Version der untersuchten Gestaltung gesehen als der Rest, ohne dass das irgendwo auffällt.
**Bezug:** SPEZIFIKATION.md Abschnitt [6] (Tabelle und technischer Hinweis), CLAUDE.md (Regel 9 neu, Tabelle
"Der abgestufte Hinweis" aktualisiert), CHECKLIST.md F5/F6. Zusätzlich `onboarding-intro.ts` um einen Hinweis
ergänzt, das Fenster mit der App sichtbar zu lassen (ein Viertel bis ein Drittel des Bildschirms daneben, oder
ein zweiter Bildschirm) - eine mitwandernde Hintergrundfarbe nützt nichts, wenn das Fenster ohnehin komplett
verdeckt ist.
**Getestet:** Per Playwright alle vier Stufen durchlaufen und die tatsächlich gesetzten Zielwerte geprüft
(Hintergrund- und Zifferfarbe als CSS-Variable, nicht der zwischenzeitlich animierte Pixelwert, da die
60-Sekunden-Transition über die echte Bildschirm-Framerate läuft, nicht über die von `page.clock` simulierte
Uhr): Stufe 0 setzt Hintergrund auf `--background-nudge-1` und Ziffernfarbe auf `--foreground-nudge`, Stufe 1
bleibt bei `--background-nudge-1` mit `.animate-nudge-card-in` auf der frisch gemounteten Karte, Stufe 2 auf
`--background-nudge-2` mit gewachsener/verschobener Karte, Stufe 3 auf `--background-nudge-3` mit dem Modal.
Zusätzlich mit erzwungener `colorScheme: "dark"`-Emulation getestet (simuliert dunkle Systemeinstellung): App
bleibt durchgehend bei `color-scheme: light`, keine dark-Werte übernommen. `tsc`/`lint` sauber, Testdaten
danach entfernt.

## 17.09.2026 Taktung der Pausenaktivitäten komplett überarbeitet

**Entscheidung:** Alle drei Aktivitäten in `activities.ts` neu getaktet. Vorher dauerten einzelne Schritte
30-90 Sekunden bei einem einzigen kurzen Satz am Anfang - bei „Aufstehen und bewegen" etwa: "Steh auf und geh
ein paar Schritte..." (ca. 5 Sekunden Sprechzeit), dann 90 Sekunden Schrittdauer, also rund 85 Sekunden reine
Stille, ohne dass der Satz das ankündigt. Jetzt gilt konsequent für jeden Schritt: die Ansage nennt immer die
eigene Dauer oder Wiederholzahl ("... 15 Sekunden lang ...", "Wiederhole das dreimal"), und kein Schritt lässt
mehr als rund 15 Sekunden Stille nach dem letzten gesprochenen Wort. Jede Aktivität endet zusätzlich mit einem
kurzen Abschlusssatz ("Gut gemacht, ..."), statt mitten im Ablauf aufzuhören. Dadurch insgesamt kürzer:
Augenentlastung ca. 1:08 (vorher grob mit "2 Min" beziffert, tatsächlich waren es auch vorher nur 60s reiner
Schrittzeit), Nacken/Schultern ca. 1:38 (vorher grob "3 Min"), Aufstehen/Bewegen ca. 1:33 (vorher grob
"5 Min").
**Begründung:** Zweimal aufgefallen: zuerst grob, dann konkret an "Aufstehen und bewegen"
festgemacht: "ein Satz und danach 80 Sekunden Stille" wirkt unbegleitet nicht wie eine unterstützte Übung,
sondern wie ein Hänger oder Bug. Ohne Live-Anleitung muss die App selbst die ganze "Anwesenheit" tragen - ein
Satz, der die eigene Dauer nennt, macht die folgende Stille erwartbar statt beunruhigend. Ein besser
getaktetes, kürzeres Programm ist einer schlecht getakteten, länger wirkenden Version vorzuziehen - die reine
Pausenzeit (`initialBreakMin`) ist davon unabhängig, nach dem letzten Schritt übernimmt ohnehin wieder die
normale Pausenuhr für den Rest der Pause.
**Bezug:** SPEZIFIKATION.md Abschnitt [8]/[9], CHECKLIST.md F7, `src/content/activities.ts`.
**Getestet:** Sprechzeit jeder einzelnen neuen Anleitung per echter `speechSynthesis`-Wiedergabe in Chromium
gemessen (nicht nur per Wortzahl geschätzt) und gegen die jeweilige Schrittdauer geprüft - größte verbliebene
Stille nach einem Satz: 16,5 Sekunden (Augenentlastung, dritte Wiederholung), alle anderen darunter, keine
Anleitung wurde durch das Schrittende abgeschnitten (mindestens 3 Sekunden Puffer nach Sprechende überall).
Zusätzlich den kompletten Ablauf von "Nacken und Schultern" (jetzt 7 statt 5 Schritte) per Playwright
durchlaufen (P01, Testdaten danach entfernt): korrekte Reihenfolge und Beschriftung "Schritt X von 7", nach
dem letzten Schritt korrekt zurück zur normalen, großen Pausenuhr.

## 17.09.2026 Visuelle Eskalation war praktisch unsichtbar - Farben und Übergänge nachgeschärft

**Entscheidung:** Farbstufen des Pausenhinweises von `#fdf3e6`/`#f6ddb8`/`#efc9a8` auf
`#f6e7cd`/`#f0cd94`/`#dd9b6c` angehoben, Zifferfarbe bei Stufe 0 von `#8a6f52` auf `#9a6b3f`. Die
60-Sekunden-Transition gilt nur noch für Stufe 0 (dort laut Spezifikation absichtlich unmerklich), ab Stufe 1
sind es 15 Sekunden.
**Begründung:** Beim Live-Test der Eskalation war nichts zu sehen, nur Weiß, auch nach dem Ende
vom Timer. Nachgemessen am gerenderten Bildschirm stimmt das: Stufe 1 landete nach 60 Sekunden bei
`rgb(253,243,230)`, also 2/12/25 RGB-Punkte neben Weiß, und lag 10 Sekunden nach dem Stufenwechsel noch bei
`rgb(255,253,251)`. Auf einem Laptop-Display, ohne Weiß daneben als Vergleich, ist das nichts. Der Vorschlag
der Betreuung war ausdrücklich, dass der Hintergrund nach 0:00 *weiterwandert* - mit so schwachen Abständen
konnte das nicht ankommen.
**Mein Fehler dabei, offen dokumentiert:** Ich hatte die erste Fassung am selben Tag "verifiziert", aber nur
geprüft, dass der richtige *Zielwert* (`var(--background-nudge-2)` usw.) gesetzt wird - nicht, ob man die
Farbe sieht. Den Unterschied hatte ich sogar selbst bemerkt (die 60-Sekunden-Transition läuft über die echte
Bildwiederholrate, nicht über die von `page.clock` simulierte Uhr) und bin ihm trotzdem ausgewichen, statt
echte Zeit abzuwarten. Bei Gestaltungsänderungen ist der gesetzte Zielwert kein Nachweis - es zählt die
gemessene, gerenderte Farbe.
**Bezug:** SPEZIFIKATION.md Abschnitt [6], CHECKLIST.md F6, `globals.css`, `session-timer.tsx`.
**Getestet:** Diesmal ohne `page.clock`, mit Sitzungen, deren `startedAt` so in der Vergangenheit liegt, dass
die Seite direkt in der jeweiligen Stufe startet, und mit Messung der tatsächlich gerenderten
`backgroundColor` über echte Zeit plus Screenshots: Stufe 0 wandert über 60s nach `rgb(246,231,205)` und die
Ziffern stehen auf `rgb(154,107,63)`, Stufe 1 erreicht `rgb(246,231,205)`, Stufe 2 `rgb(240,205,148)`,
Stufe 3 `rgb(221,155,108)` - jeweils innerhalb von etwa 15 Sekunden und auf dem Screenshot klar erkennbar.

## 17.09.2026 Vorbefragung: B3 (Hilfsmittel) hängt jetzt an B2 (machst du bewusst Pausen)

**Entscheidung:** B3 "Nutzt du Hilfsmittel für Pausen" erscheint nur noch, wenn B2 "Machst du bei solcher
Arbeit bewusst Pausen?" mit Ja beantwortet wurde (neues Feld `showIf` in `pre-survey.ts`). B4 "Beschreibe
kurz, wie du Pausen machst" bleibt in beiden Fällen sichtbar. Wird eine Frage durch ein "Nein" verborgen,
nachdem sie schon beantwortet war, wird die Antwort verworfen statt mitgeschickt.
**Begründung:** Hinweis: wer keine bewussten Pausen macht, wurde trotzdem gefragt, ob er Hilfsmittel
*für Pausen* nutzt. Das wirkte wie eine verdrehte Logik und liefert keine verwertbare Antwort. B4 soll
bewusst bleiben, weil auch "ich mache keine festen Pausen" eine Antwort ist, die man auswerten kann.
**Bezug:** SPEZIFIKATION.md Abschnitt [3] Block B, CHECKLIST.md F2.
**Getestet, und dabei einen zweiten Fehler gefunden:** Die Sichtbarkeitsregel liegt jetzt als
`isPreSurveyItemVisible` in `pre-survey.ts` und wird von Formular **und** `POST /api/survey` benutzt. Im
ersten Versuch hatte ich sie nur im Formular, worauf die Server-Prüfung ("Fehlende Antworten") die
Vorbefragung mit "Nein" bei B2 komplett abgewiesen hat - die Teilnehmenden wären an dieser Stelle
festgesteckt. Im Playwright-Durchlauf aufgefallen, weil nach dem Absenden die URL auf `/study/pre` blieb.
Danach beide Wege durchgeklickt (P02, Testdaten entfernt): bei Nein sind Anzahl-Frage und B3 weg, B4 da,
Absenden geht durch, gespeichert wird `"B2": {"yes": false}` ohne B3; bei Ja erscheinen beide Anschlussfragen
und landen vollständig im Datensatz.

## 17.09.2026 Deployment auf Vercel + Neon statt Hetzner

**Entscheidung:** Die Studie läuft auf Vercel (App, Region Frankfurt) mit Neon als Postgres (Region
Frankfurt). Der fertige Hetzner-Weg (Dockerfile, docker-compose.yml, Caddyfile) bleibt vollständig im Repo
und in CHECKLIST.md I1-I5 dokumentiert, nur eben ungenutzt. Einzige nötige Codeänderung: `npm run build`
heißt jetzt `prisma generate && next build`.
**Begründung:** Vorgabe: "ich will die app live haben für die leute". Ein eigener Server kostet vor
der Studie Zeit, die er nicht hat: SSH, Firewall, Systemupdates, Zertifikate. Bei Vercel genügt ein
`git push`. Für zehn Teilnehmende reicht der kostenlose Tarif, und wenn später Zeit ist, kann er auf den
schon gebauten Hetzner-Stack umziehen, ohne dass etwas verloren wäre.
**Zur Einwilligung:** Dort steht "Die Daten werden auf einem Server in Deutschland gespeichert". Das bleibt
korrekt, **solange bei Neon die Region Frankfurt gewählt wird** - die Daten liegen dann physisch in
Deutschland. Der Unterschied zu vorher ist der Anbieter (Vercel Inc. und Neon sind US-Firmen, Hetzner ist
deutsch), nicht der Speicherort. Ich habe entschieden, das nicht vorher mit der Betreuung abzustimmen; der
Einwilligungstext selbst wurde deshalb **nicht** angefasst (CLAUDE.md: Einwilligungstexte werden mit der
Betreuung abgestimmt, nicht eigenmächtig geändert) - er musste auch nicht, weil die Zusage mit
Frankfurt-Region weiter zutrifft. Falls die Ethik-Einreichung ausdrücklich Hetzner nennt, ist das ein Punkt
für eine kurze Mail an Holly, kein technisches Problem.
**Warum `prisma generate` in den Build muss:** Der Client wird nach `src/generated/prisma` erzeugt, und der
Ordner liegt bewusst nicht im Git. Der Dockerfile-Weg hatte dafür eine eigene `RUN npx prisma generate`-Zeile,
Vercel hat die nicht - ohne die Änderung bricht der Build dort mit "Cannot find module '@/generated/prisma'"
ab. Das wäre beim ersten Deploy-Versuch aufgefallen, kostet aber unnötig Nerven.
**Warum Migration und Seed nicht bei Vercel laufen:** `prisma/seed.ts` liest `credentials.local.json` mit den
echten Teilnehmer-Passwörtern. Die Datei soll auf keinen fremden Server, deshalb laufen `migrate deploy` und
`db seed` von meinem Laptop gegen die **direkte** Neon-Verbindung. Vercel selbst bekommt nur den
**gepoolten** String, weil jede Serverless-Funktion sonst eine eigene DB-Verbindung aufmacht und das
Verbindungslimit sprengt.
**Getestet:** `npm run build` läuft durch. Zusätzlich die Vercel-Situation nachgestellt, indem
`src/generated/prisma` gelöscht und neu gebaut wurde - `prisma generate` erzeugt den Client (ohne
DB-Verbindung, braucht also beim Build keine Datenbank), danach kompiliert Next fehlerfrei. Das eigentliche
Deployment steht noch aus, die Schritte stehen in CHECKLIST.md I0.

## 18.09.2026 Datenverlust-Prüfung der ganzen App, zwei echte Funde behoben

**Anlass:** Nach dem "Nein"-Fehler in der Vorbefragung: ich will niemandem Feedback oder Daten
verlieren, jeder Teilnehmende ist extrem wertvoll. Deshalb die App einmal gezielt darauf durchgesehen, wo
Teilnehmerdaten verloren gehen, überschrieben oder falsch zugeordnet werden können.

**Fund 1 (der schwerste): eine zweite Einwilligung legte eine zweite, leere Sitzung an.**
`POST /api/session` hat bedingungslos eine neue Sitzung erzeugt, und `/study/consent` war nach dem Einwilligen
weiterhin erreichbar - per Zurück-Taste, Reload oder Lesezeichen. Weil **alle** Seiten die Sitzung per
`findFirst` mit `orderBy: createdAt desc` holen, hätte die App danach mit der neuen, leeren Sitzung
weitergearbeitet: Vorbefragung, Ereignisse und Kurzfeedback der ersten Sitzung wären unsichtbar geworden, die
Person hätte von vorn angefangen und die Nachbefragung wäre an der leeren Sitzung gelandet. Gelöscht wurde
dabei nie etwas (die Daten lägen weiter in der Datenbank), aber im Export stünde diese Person als zwei kaputte
Hälften - und genau eine Person fehlt dann in der Auswertung. Reproduziert, bevor repariert: zwei Aufrufe von
`POST /api/session` ergaben zwei Sitzungszeilen.
**Behoben in zwei Schichten:** `POST /api/session` gibt eine vorhandene Sitzung zurück, statt eine zweite
anzulegen, und `/study/consent` leitet nach `/study` weiter, sobald eine Einwilligung vorliegt. Beides
zusammen, weil die Seitenweiche allein einen wiederholten API-Aufruf nicht abfängt und die API-Prüfung allein
den verwirrenden Einwilligungsbildschirm stehen lassen würde. Die Bedingung der Weiterleitung ist genau die
Umkehrung der Weiche in `/study`, dadurch ist eine Weiterleitungsschleife ausgeschlossen (die wäre ihrerseits
eine Blockade gewesen).

**Fund 2: die Ereignis-Warteschlange konnte sich dauerhaft verstopfen und Ereignisse falsch zuordnen.**
In `eventQueue.ts` brach `flush()` bei jeder nicht erfolgreichen Antwort ab und behielt den Stapel. Bei einer
Antwort, die der Server **nie** annimmt (400 ungültig, 404 Sitzung gibt es nicht), hätte das ewig wiederholt -
und alles, was dahinter in der Schlange steht, wäre nie gesendet worden, also der ganze Rest der Sitzung.
Zusätzlich wurde die `sessionId` nur aus dem **ersten** Eintrag gelesen und auf den ganzen Stapel angewendet:
lagen noch Reste einer älteren Sitzung in `localStorage` (harter Browser-Absturz, `sendBeacon` nicht
durchgekommen), wären neue Ereignisse unter der alten Sitzung gelandet - stille Falschzuordnung, die im Export
gar nicht auffällt und damit schlimmer ist als ein Verlust.
**Behoben:** Ein Stapel enthält nur noch Ereignisse derselben Sitzung, und ein dauerhaft abgelehnter Stapel
(400/404) wird verworfen, statt alles dahinter zu blockieren - das rettet mehr Daten, als ihn zu behalten.
Netzwerkfehler, 401 (abgelaufenes Cookie) und 5xx bleiben liegen und werden weiter wiederholt, die können beim
nächsten Versuch klappen. `flushWithBeacon` hatte denselben sessionId-Fehler und wurde mitkorrigiert.

**Geprüft und in Ordnung (keine Änderung nötig):**
- `prisma/seed.ts` arbeitet mit `upsert` und fasst nur `passwordHash`/`role` an - ein erneuter Seed-Lauf gegen
  die Produktionsdatenbank löscht keine Sitzungen. Wichtig für den Vercel/Neon-Weg, wo der Seed von Hand läuft.
- Nirgends im App-Code wird gelöscht (`delete`/`deleteMany` kommen nur im generierten Prisma-Client vor), und
  keine Migration enthält `DROP`/`TRUNCATE`.
- `end`, `reopen`, `finalize`, `start` setzen ausschließlich Zeitstempel und überschreiben nie Antworten.
- Die Nachbefragung hat nicht denselben Fehler wie die Vorbefragung: Formular und Server prüfen beide gegen
  dieselbe Liste `requiredPostSurveyIds`, die optionalen Freitextfelder stehen nicht darin.
- Der Export filtert nichts: `findMany` ohne `where` über Sitzungen, Runden und Ereignisse. Auch eine
  abgebrochene oder nie finalisierte Sitzung taucht auf, niemand verschwindet still aus den Daten.

**Bekannt und bewusst so (kein Fehler, gehört in die Limitationen):** Bei einem harten Absturz des Browsers
können bis zu 10 Sekunden Ereignisse fehlen - der reguläre Takt sendet alle 10s, beim normalen Schließen
greift `sendBeacon`. Befragungsantworten sind davon nicht betroffen, die gehen direkt beim Absenden raus.

## 18.09.2026 Hinweis mit Häkchen vor dem Start, Einwilligungstext präzisiert

**Entscheidung:** Drei Dinge, alle klein, alle aus der Durchsicht vor dem Einfrieren der App.

1. Über dem Startknopf steht jetzt ein Kasten mit drei Zeilen und einem Pflichthäkchen: Fenster sichtbar
   lassen, Ton an, eigene echte Aufgabe. Ohne Häkchen bleibt der Startknopf gesperrt. Text in
   `session-start.ts`, Anzeige in `dashboard-start-form.tsx`.
2. Im Einwilligungstext steht statt "auf einem Server in Deutschland" jetzt "bei einem Hosting-Dienstleister
   mit Serverstandort in Deutschland".
3. Das Raketen-Emoji im Startknopf ist raus, wie vorher schon beim Zurück-Knopf der Vorbefragung.

**Begründung zu 1:** Die Erklärseite "So funktioniert die App" steht vor der Vorbefragung und erklärt dort
den Ablauf, das bleibt auch so. Zwischen dem Lesen und dem echten Sitzungsstart liegen aber rund zehn Minuten
Fragebogen, und wer das Fenster danach zurechtrücken soll, hat es bis dahin vergessen. Das ist keine
Formalie: bleibt das Fenster im Hintergrund, wirkt die visuelle Eskalation bei dieser Person gar nicht, und
dann wird bei ihr etwas anderes gemessen als bei den übrigen neun. Weil der Startknopf ohne Häkchen gesperrt
ist, gilt für jede gestartete Sitzung, dass die Bedingungen zur Kenntnis genommen wurden. Das reicht für
Kapitel 6.4, ein eigenes Datenbankfeld braucht es dafür nicht.

**Begründung zu 2:** Grammatisch bezog sich das "ausschließlich" schon vorher auf die Verwendung der Daten,
nicht auf den Server, der Satz war also nicht falsch. Aber in einer Einwilligungserklärung zählt, wie eine
Teilnehmerin ihn liest, nicht was sich grammatisch ableiten lässt. Mit dem Halbsatz ist eindeutig, dass die
Speicherung bei einem Dienstleister passiert, und genau so lässt sich das auch im Datenschutzabschnitt der
Arbeit beschreiben. Der Speicherort bleibt Deutschland, solange bei Neon die Region Frankfurt steht.

**Getestet:** Den ganzen Weg von Login über Einwilligung und Vorbefragung bis zum Startbildschirm auf 640px
Fensterbreite durchgeklickt (P04, Testdaten danach entfernt): ohne Häkchen bleibt man auf `/study` und
bekommt "Bitte einmal bestätigen", mit Häkchen startet die Sitzung wie vorher. Produktionsbuild läuft durch.

## 18.09.2026 Kommentare und Doku als eigene Notizen geschrieben

**Entscheidung:** In allen Kommentaren und in der Doku stehen keine Formulierungen mehr wie "Husin hat
gemeldet", "auf Husins Wunsch" oder "Husins Vorgabe". Die Notizen sind jetzt so geschrieben, wie ich sie
selbst schreiben würde: entweder neutral ("beim Testen aufgefallen", "Vorgabe: ...") oder in der ersten
Person ("ich höre nur das Endsignal"). Dazu sind die langen Gedankenstriche überall raus, ersetzt durch
Komma, Doppelpunkt oder Punkt.

**Begründung:** Das Repo ist öffentlich und das sind meine eigenen Projektnotizen. Notizen, die mich in der
dritten Person zitieren, lesen sich, als würde jemand anderes über mich Buch führen. Die langen
Gedankenstriche fallen als typische KI-Schreibweise auf.

**Umfang:** 16 Dateien unter `src/`, dazu SPEZIFIKATION.md, CHECKLIST.md, ENTSCHEIDUNGEN.md und CLAUDE.md.
Stehen bleiben durfte der Name an drei Stellen, wo er hingehört: in den Titelzeilen der Dokumente als Autor
und im Einwilligungstext, den die Teilnehmenden lesen. "Betreuung" als Quelle bleibt ebenfalls stehen, das
schreibt man in eigenen Notizen ganz normal so.

## 18.09.2026 Rundenlänge vorübergehend auf 5 Minuten (Testwert)

**Entscheidung:** `initialWorkMin` in `prisma/schema.prisma` von 25 auf 5 gesetzt, Migration
`testwert_rundenlaenge_5min`. Die Pausenlänge bleibt unverändert bei 5 Minuten.

**Begründung:** Zum Testen soll der ganze Ablauf schnell durchspielbar sein, ohne 25 Minuten zu warten. Das
ist ausdrücklich vorübergehend. In CLAUDE.md steht eigentlich, dass die Standardwerte im Code bei 25/5
bleiben und man zum Testen nur kurze Zeiten benutzt. Die Abweichung ist bewusst und an drei Stellen
markiert: als Kommentar direkt an der Stelle im Schema, als Kasten ganz oben in PHASE J der Checkliste und
hier.

**Zurückstellen:** `initialWorkMin` auf 25, `npx prisma migrate dev`, danach gegen die Produktionsdatenbank
`npx prisma migrate deploy`. Wichtig vor dem Probelauf, nicht erst vor der Studie.

**Zu beachten:** Der Wert wirkt nur auf **neu angelegte** Sitzungen. Sitzungen, die schon existieren, haben
ihre 25 gespeichert und behalten sie. Zum Testen also mit einem Code starten, der noch keine Sitzung hat.

## 18.09.2026 Zwei gleichzeitig offene Fenster beschädigen die Daten, Gegenmaßnahme ist die Anweisung

**Beobachtung:** Beim Testen war die App gleichzeitig in zwei Browsern für denselben Teilnehmer offen, in
beiden wurde "Pause starten" geklickt. Ergebnis in den Daten von P01: jede Nudge-Stufe doppelt protokolliert
(die Fenster liefen 4 Sekunden versetzt), zwei `BREAK_ACCEPTED`, zwei `BREAK_STARTED` und **zwei
widersprechende Kurzfeedbacks für dieselbe Runde** (einmal minus 20 Minuten, einmal minus 5). Dazu über die
ganze Sitzung doppelte `ACTIVITY_TICK`, was die Aktivitätswerte verdoppelt.

**Warum das so ist:** Der Rundenzustand (WORK, FEEDBACK, ACTIVITY_CHOICE, BREAK) liegt je Tab im
`sessionStorage`. Der Server kann daraus nur die Arbeitsrunde rekonstruieren, über das jüngste
`WORK_STARTED`. Von einer laufenden Pause weiß er nichts. Ein zweites Fenster startet deshalb immer in der
Arbeitsphase und steuert die Sitzung unabhängig weiter, beide Ereignisströme landen aber in derselben
Sitzung. Dieselbe Ursache erklärt auch die doppelten `BREAK_STARTED` in älteren Testsitzungen (P05 Runde 2,
P07 Runde 1): dort wurde mitten in einer Pause neu geladen.

**Das eigentlich Gefährliche:** Der Export nimmt bei mehrdeutigen Runden den ersten Treffer
(`cycleEvents.find(...)`, `session.cycles.find(...)`) und verwirft den Rest stillschweigend. Es kommt eine
ganz normal aussehende Zeile heraus, in der nichts darauf hindeutet, dass es eine zweite, widersprüchliche
Realität gab. Ein Fehler, den man am Ergebnis nicht sieht, ist schlimmer als einer, der kracht.

**Entscheidung:** Kein technischer Zwang, sondern die Anweisung. Die erste Zeile im Hinweiskasten vor dem
Start heißt jetzt "Die App läuft in genau einem Fenster, und das bleibt sichtbar", bestätigt per Pflichthäkchen.
Dazu eine Prüfabfrage in PHASE J der Checkliste, die doppelt gesteuerte Runden findet.

**Warum nicht spiegeln:** Damit zwei Fenster denselben Stand zeigen, müsste der Server die alleinige Wahrheit
über den Rundenzustand werden und Änderungen aktiv an alle Fenster schicken, dazu käme Konfliktauflösung bei
gleichzeitigen Klicks. Das ist eine andere Architektur und misst nichts, was diese Arbeit untersucht. Bei
zehn Teilnehmenden mit je einer Sitzung steht der Aufwand in keinem Verhältnis.

**Offen, falls der Probelauf zeigt, dass die Anweisung nicht reicht:** Ein serverseitiger Riegel wäre
machbar, ohne die Architektur umzubauen. Die Sitzung merkt sich, welches Fenster sie zuletzt beansprucht hat,
und ein Fenster, das den Anspruch verliert, zeigt statt der Sitzung nur noch den Hinweis "Diese Sitzung ist
in einem anderen Fenster geöffnet". Schätzung rund eine halbe Stunde. Bewusst nicht vorab gebaut, weil es vor
dem Einfrieren zusätzliche Fehlerfläche wäre und die Anweisung den realistischen Fall abdeckt.

## 18.09.2026 dotenv als echte Abhängigkeit eingetragen

**Entscheidung:** `dotenv` steht jetzt als devDependency in der `package.json`.

**Begründung:** `prisma.config.ts` beginnt mit `import "dotenv/config"`, aber das Paket war nirgends
deklariert. Aufgelöst wurde es nur zufällig über vier Ebenen: `prisma` zu `@prisma/config` zu `c12` zu
`dotenv`. Solange das Paket oben in `node_modules` landet, funktioniert es. Ändert ein Prisma-Update diese
Kette, schlägt `prisma generate` fehl, und weil das seit dem Umstieg auf Vercel Teil von `npm run build` ist,
fällt damit der ganze Deploy aus. Gefunden bei der Durchsicht vor dem ersten Hosting.

**Getestet:** `src/generated/prisma` gelöscht und komplett neu gebaut, dazu `npx prisma db seed` gegen die
lokale Datenbank, beides läuft mit der jetzt expliziten dotenv-Version 18 durch.

## 18.09.2026 Nachgemessen: Töne pro Hinweispunkt

**Anlass:** Beim Testen war ein Ton deutlich vor 0:00 zu hören, dann ein zweiter etwa 13 Sekunden später.
Nachgemessen statt geraten, mit einem Mitschnitt aller tatsächlich gestarteten Oszillatoren im echten
Browser.

**Ergebnis Arbeitsphase:** In den 59 Sekunden vor dem Rundenende kommt kein einziger Ton. Bei 0:00 genau
einer. Das ist so gewollt.

**Ergebnis Pause (2 Minuten, Augenentlastung):** 14 Oszillatoren, alle erklärbar. Drei `water-drop` bei den
Schrittwechseln der Aktivität (20s, 40s, 60s), neun `soft-mallet` im Sekundentakt von 9 bis 1 vor dem
Pausenende, und zum Schluss zwei gleichzeitig startende Oszillatoren. Die zwei sind kein doppelter Ton,
sondern das Endsignal `double-chime`, das absichtlich aus zwei kurz versetzten Tönen besteht. Genauso hat
`soft-bell` auf Stufe 2 einen zusätzlichen Oberton. Pro Hinweispunkt gibt es also genau ein wahrnehmbares
Signal, auch wenn technisch zwei Oszillatoren laufen.

**Erklärung für das Gehörte:** Es lag an den zwei gleichzeitig offenen Fenstern. In den eigenen Daten steht
es eindeutig: Runde gestartet 13:10:23, also Ende 13:15:23, Stufe-1-Ton um 13:15:23.971 und ein zweiter um
13:15:24.546. Später drifteten die Fenster auseinander, zwei Stufe-1-Töne lagen um 13:31:17 und 13:32:34, das
sind 77 Sekunden Abstand. Wer auf das zweite Fenster schaut, hört den Ton des ersten, während die eigene
Anzeige noch über eine Minute zeigt. Siehe den Eintrag zu den zwei Fenstern weiter oben.

## 18.09.2026 Datenbank geleert und Rundenlänge zurück auf 25

**Entscheidung:** Alle Aktivitätsdaten aus der lokalen Datenbank gelöscht (Sitzungen, Ereignisse,
Befragungen, Kurzfeedback), die zwölf Teilnehmer-Accounts bleiben unberührt. Danach `initialWorkMin` im
Schema von 5 zurück auf 25, Migration `rundenlaenge_zurueck_auf_25`.

**Begründung:** Vor dem Hosting soll alles frisch sein, damit die Teilnehmenden mit ihren eigenen Eingaben
starten. Die Testdaten waren ohnehin teilweise unbrauchbar, etwa die doppelt gesteuerte Sitzung von P01 aus
den zwei gleichzeitig offenen Fenstern. Vor dem Löschen wurde ein vollständiger `pg_dump` abgelegt, falls
doch noch etwas gebraucht wird.

**Geprüft:** Nach dem Löschen zwölf Teilnehmer mit korrekten Rollen, null Sitzungen, null Ereignisse, null
Befragungen, null Kurzfeedback. Nach der Migration in einer frisch über die API angelegten Sitzung
nachgesehen: 25 Minuten Arbeit, 5 Minuten Pause.

**Zum Merken, hat zweimal Zeit gekostet:** Eine geänderte Vorgabe im Schema wirkt lokal erst, wenn nach
`npx prisma migrate dev` auch `npx prisma generate` gelaufen **und** der Dev-Server neu gestartet ist. Der
generierte Client trägt den Vorgabewert in sich, und der laufende Server hält den alten im Speicher. Beim
ersten Versuch sah es deshalb so aus, als hätte die Änderung nicht gewirkt. Bei Vercel ist das kein Thema,
dort steckt `prisma generate` im Build.

**Zum Testen künftig:** Nicht mehr den Standard im Schema verstellen, sondern die Werte direkt auf der
Testsitzung setzen. Dann bleibt der Studienwert immer korrekt.

## 18.09.2026 Export lesbar gemacht: Ja/Nein-Fragen und Zeilenumbrüche

**Anlass:** Erster echter Export aus der Produktion, in Excel geöffnet. Genau der Schritt aus PHASE J, und er
hat zwei Dinge gefunden.

**Problem 1, Ja/Nein-Antworten standen als roher JSON-Text im CSV.** In der Zelle für B2 stand
`{"yes":false,"followUp":""}`. Damit lässt sich in Excel nicht rechnen und nicht filtern.
**Gelöst:** Jede Ja/Nein-Frage bekommt jetzt zwei Spalten, `B2` mit dem Wert `ja` oder `nein` und
`B2_followUp` mit der Anschlussantwort. Eine leere `B3`-Spalte bedeutet weiterhin, dass die Frage gar nicht
gestellt wurde, weil B2 mit Nein beantwortet war.

**Problem 2, Zeilenumbrüche in Freitextantworten sprengten die Zeile.** Ein Absatz in einer Antwort ist
maskiert zwar gültiges CSV, aber in Excel wird die Zeile dann meterhoch und die Datei sieht kaputt aus.
**Gelöst:** In `toCsv` werden Folgen von Leerraum zu einem Leerzeichen zusammengezogen. Ein Datensatz bleibt
damit immer eine physische Zeile. Es geht kein Wort verloren, nur die Absatzstruktur.

**Kein Fehler, aber Ursache für den ersten Schreck:** Excel hatte die Datei gar nicht in Spalten zerlegt,
alles stand in Spalte A. Die Datei benutzt Semikolon und eine UTF-8-BOM, das ist auf deutsches Excel
ausgelegt. Steht das Listentrennzeichen von Windows auf Komma, ignoriert Excel die Semikolons. Abhilfe ohne
Änderung an der Datei: in Excel über Daten, Aus Text/CSV importieren und dort Semikolon wählen.

**Getestet:** Testdatensatz mit allen drei Fallen gleichzeitig angelegt, echter Zeilenumbruch, Semikolon und
Anführungszeichen in derselben Freitextantwort. Export gezogen und mit einem CSV-Parser gegengelesen:
49 Spalten im Kopf, 49 Werte in der Datenzeile, `B2` gleich `ja`, `B2_followUp` gleich `4`, `B3` gleich
`nein`, und der Freitext einzeilig mit erhaltenem Semikolon und erhaltenen Anführungszeichen. Testdaten
danach wieder entfernt.

**Hinweis zum Auswerten:** Der Export filtert bewusst nichts. Die Zeilen von PILOT und ADMIN stehen deshalb
mit in `participants.csv` und müssen bei der Auswertung ausgeschlossen werden.

## 18.09.2026 ADMIN kann keine Studiensitzung mehr anlegen

**Entscheidung:** Wer mit dem ADMIN-Konto angemeldet ist, wird von `/study` und `/study/consent` auf `/admin`
weitergeleitet.

**Begründung:** Nach dem Login geht es für alle auf `/study`, und ohne Sitzung landet man von dort auf der
Einwilligung. Beim ersten Ausprobieren in Produktion wurde die Einwilligung mit dem ADMIN-Konto einmal
durchgeklickt, dadurch stand ADMIN als ganz normale Teilnehmerzeile im Export. Das Konto ist zum Auswerten
da, zum Ausprobieren des Ablaufs gibt es PILOT.

**Erster Versuch war unvollständig, nachgebessert am selben Tag:** Die Prüfung stand zuerst nur in
`/study` und `/study/consent`. Unter `/study` liegen aber sechs Seiten, und `/study/pre` liess sich als ADMIN
weiterhin direkt aufrufen. Aufgefallen ist das beim Nachprüfen in der Produktion, nicht mir. Jetzt liegt die
Regel in `src/app/study/layout.tsx` und gilt damit automatisch für alles darunter, auch für Seiten, die
später dazukommen. Die beiden Einzelprüfungen sind wieder raus, damit die Regel nur an einer Stelle steht.
Zusätzlich lehnt `POST /api/session` das ADMIN-Konto mit 403 ab, denn eine Seitenweiche schützt nicht gegen
einen direkten Aufruf der Schnittstelle.

**Getestet:** Als ADMIN führen alle sechs Seiten (`/study`, `consent`, `pre`, `session`, `post`, `complete`)
mit 307 auf `/admin`, der direkte Aufruf von `POST /api/session` antwortet mit 403. Gegenprobe mit PILOT:
kommt weiterhin normal auf die Einwilligung. Danach null Sitzungen in der Datenbank, der Test hat also keine
angelegt.
