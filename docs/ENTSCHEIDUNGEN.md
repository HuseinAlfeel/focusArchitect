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
**Begründung:** Husin meldete zwei gleichzeitig laufende, gegeneinander klingende Töne bei Minute 3. Ursache:
wenn der Tick durch Tab-Drosselung verzögert wird, können zwei Schwellen (z.B. +2 Min und +3 Min) im selben
Tick fällig werden und dann nahezu gleichzeitig abspielen. Mit gleichem Klangcharakter klingt ein solcher
seltener Doppel-Treffer wie ein einzelner, etwas voller Ton statt wie zwei widersprüchliche Klänge.
**Alternative:** Nur den Klangcharakter angleichen, den Tick-Loop unangetastet lassen. Verworfen, weil das nur
das Symptom für genau diese eine Minuten-Kombination kaschiert hätte, nicht die Ursache.

## 25.08.2026 Zehn Teilnehmende statt sechs

**Entscheidung:** Teilnehmerzahl auf zehn erhöht (P07-P10 als neue Accounts angelegt), Probelauf-Person
entsprechend zur "elften Person" statt "siebten Person".
**Begründung:** Empfehlung von Husins Beraterin.
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
**Begründung:** Husin fand die Anzeige nicht - sie war zwar da, stand aber an einer eigenen zentrierten
Stelle im Layout, während `NudgeModal` (Stufe 3) als `fixed inset-0` zentriertes Fenster optisch genau darüber
lag und sie damit verdeckte. Direkt in der Karte ist sie unübersehbar mit der Entscheidung verbunden, die sie
begründet.
**Alternative:** Position der alten Anzeige anpassen. Verworfen, direkt in der Karte ist eindeutiger.

## 26.08.2026 Aktivitätserfassung im Tab (ACTIVITY_TICK)

**Entscheidung:** Neuer Hook `useActivityTicks.ts`: zählt `mousemove`/`wheel` (zusammen als `mouseMoves`),
`mousedown` (`clicks`) und `keydown` (`keyPresses`) auf `window`, sendet einmal pro Minute ein `ACTIVITY_TICK`
mit den vier Aggregaten plus `tabVisible`. Kein Tick, wenn der Tab am Ende der Minute nicht sichtbar ist.
**Begründung:** Husins Vorschlag, objektives Signal für "wie oft schaut jemand zur Anwendung" als Grundlage
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
beenden" sichtbar) - bewusst so gebaut, um ein verwirrendes "0:00" zu vermeiden. Husin fand das falsch: wirkte
wie ein Fehler ("Timer geht weg, unsichtbar"). Korrigiert: eigener Countdown "Nächster Hinweis in M:SS" während
der Gnadenfrist, gespeist aus `useCountdown(nudgeEndsAt)`. Leere Bildschirme sind nicht automatisch das ruhige
Design, das Regel 7 will - eine Person muss trotzdem erkennen können, dass etwas passiert.

## 26.08.2026 Pausenzeit hat Vorrang vor Aktivitätsdauer

**Entscheidung:** `readyToContinue` in `BreakScreen` hängt nur noch von `breakDone` ab, nicht mehr zusätzlich
von `allStepsDone`. Die Aktivitätsanzeige wird ausgeblendet, sobald die Pause vorbei ist, auch wenn die
Aktivität selbst noch laufen würde.
**Begründung:** Husin testete mit einer 2-Minuten-Pause und einer länger dauernden Aktivität - "Sitzung
starten" erschien erst, wenn die Aktivität zu Ende war, nicht wenn die Pause endete. Aktivitäten haben feste
Presets (2/3/5 Min), die Pause ist aber frei einstellbar (initialBreakMin, zusätzlich per Kurzfeedback
anpassbar) - eine kürzere Pause als das gewählte Aktivitäts-Preset ist ein realistischer Fall, nicht nur ein
Testartefakt.
**Alternative:** Aktivität immer zu Ende laufen lassen, auch über die Pausenzeit hinaus. Verworfen, das war
genau der gemeldete Bug.

## 26.08.2026 Pausenende-Countdown reagiert jetzt auf Tab-Rücksprung

**Entscheidung:** `useBreakEndSound.ts` prüft jetzt zusätzlich sofort bei jedem `visibilitychange`, nicht nur
im 200ms-Takt.
**Begründung:** Husin hörte bei einer Pause nur das Endsignal, keinen der zehn Klopftöne davor. Ursache:
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

## 01.09.2026 Restzeit größer, nur Minuten in der Arbeitsphase, Rundenanzeige ergänzt

**Entscheidung:** Drei Änderungen am Arbeits-/Pausenbildschirm: (1) Restzeit deutlich größer dargestellt,
weiterhin kontrastarm. (2) Während der Arbeitsphase nur Minuten, keine Sekunden (`formatRemainingMinutes`,
aufgerundet) - die Pause zeigt weiterhin M:SS. (3) Kleine, kontrastarme Zeile "Fokus · Runde N" bzw.
"Pause · Runde N" oberhalb der Restzeit, aus der schon gespeicherten Zyklusnummer, keine neue Zählung.
**Begründung:** Befund der Betreuung im Gespräch Ende August 2026, hier am 01.09.2026 umgesetzt: nicht
erkennbar, ob Arbeits- oder Pausenphase läuft; Restzeit zu klein zum Lesen aus normalem Sitzabstand; ein
sekundengenauer Countdown in der Arbeitsphase zieht Blicke an und widerspricht der bewusst zurückhaltenden
Gestaltung (Regel 7) - Zielkollision aufgelöst durch "groß, aber kontrastarm" statt "klein".
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
