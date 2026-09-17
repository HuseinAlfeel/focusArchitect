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
**Begründung:** Husins ausdrücklicher Wunsch, nach dem visuellen Überarbeiten von Fokus- und
Pausenbildschirm am selben Tag. Der Eintrag vom 01.09. ("Restzeit größer, Rundenanzeige ergänzt") hatte die
testweise Minuten-Anzeige fälschlich mit einem Befund der Betreuung begründet - laut Husin haben Holly/Orhan
das nie so gesagt, diese Zuschreibung war schlicht falsch.
**Alternative:** Bei Minuten bleiben. Auf Nachfrage klar abgelehnt.

## 12.09.2026 "Sitzung beenden" nach oben rechts verschoben, eigener Bestätigungsdialog

**Entscheidung:** Der Knopf steht jetzt oben rechts statt unten links, und die Rückfrage vor dem Beenden ist
ein eigenes Fenster im Stil des Pausenhinweises statt `window.confirm()`.
**Begründung:** Der Knopf unten links überlappte in der lokalen Entwicklung mit dem Next.js-Dev-Icon; der
native Browser-Dialog wirkte "hässlich und primitiv" (Husin).

## 14.09.2026 Pause manuell starten, ohne auf den Hinweis zu warten

**Entscheidung:** Neuer, zurückhaltender Knopf „Pause jetzt starten" unten rechts, sichtbar solange die
Arbeitsphase läuft und noch kein Hinweis erschienen ist. Beendet die Runde sofort und führt direkt zur
Aktivitätsauswahl - kein Kurzfeedback, keine Intervallanpassung für diese Runde, die nächste läuft mit dem
bisherigen Wert weiter. Neues Ereignis `BREAK_SELF_INITIATED` mit
`payload: { cycleNumber, secondsIntoWork }`. In `cycles.csv` über `reactionType: "SELF_INITIATED"` sichtbar
(neuer Wert, bestehende Werte unverändert) plus eigener Spalte `reactionSecondsIntoWork`.
**Begründung:** Husins Vorgabe - Nutzende sollen eine Pause auch aus eigenem Antrieb beginnen können, nicht
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
**Begründung:** Husins Vorgabe. Bei der Augenentlastung schaut man bewusst vom Bildschirm weg - ein reiner
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
**Begründung:** Husins Vorgabe - "Time-to-Value" (Zeit bis der Timer läuft) drastisch verkürzen, keine
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
**Begründung:** Husin fiel bei der Augenentlastung auf, dass der erste Anleitungsschritt mit einer anderen,
roboterhafter klingenden Stimme gesprochen wurde als Schritt 2 und 3. Ursache: `speechSynthesis.getVoices()`
liefert bei manchen Browsern (v.a. Chrome/Chromium) direkt nach dem Laden der Seite noch eine leere Liste,
die echte Stimmenliste kommt asynchron über das `voiceschanged`-Ereignis nach. Der Hook wählte beim allerersten
Aufruf also aus einer leeren Liste (Ergebnis: keine Stimme gesetzt, Browser nimmt seine eigene Standardstimme),
und erst ab dem zweiten Aufruf stand die eigentlich gewünschte, bessere Stimme fest. Jetzt wird auf
`voiceschanged` gewartet (mit 300ms-Fallback, falls das Ereignis nie feuert), bevor überhaupt gesprochen wird.
**Bezug:** Reine Bugfix, an der Stimmauswahl-Heuristik selbst (siehe Eintrag oben) ändert sich nichts.

## 14.09.2026 Emoji im "Zurück"-Knopf entfernt

**Entscheidung:** Der Knopf in der Vorbefragung heißt jetzt nur noch "Zurück", ohne das 🔙-Emoji davor.
**Begründung:** Husin fand es kindisch wirkend - das Emoji zeigt in den meisten Emoji-Schriftarten zusätzlich
den englischen Schriftzug "BACK" mit an, was neben dem deutschen "Zurück" unpassend aussah.

## 14.09.2026 Hydration-Fehler nach Reload mitten in einer Pause

**Entscheidung:** `useRoundTimer.ts` startet den allerersten Render (Server UND Client) immer mit dem
Server-Fallback (Runde WORK) und liest `sessionStorage` erst in einem `useEffect` nach dem Hydrieren, statt
direkt im `useState`-Initializer.
**Begründung:** Husin bekam beim Reload eines `/study/session`-Tabs mitten in einer Pause einen React-
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
**Begründung:** Husin fiel das nach "Sitzung fortsetzen" (Reopen) unangenehm auf: erst der
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
**Begründung:** Husins Vorgabe - kognitive Last durch Paging reduzieren, ohne methodische Standards zu
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
**Begründung:** Husins Vorgabe - alles, was Teilnehmende sehen, soll einheitlich aussehen. Vorher wirkten
diese Bildschirme merklich schlichter/älter als die frisch überarbeiteten Fokus-/Pausen- und Onboarding-
Bildschirme.
**Bezug:** Rein optisch, keine Text- oder Verhaltensänderung. Dashboard, Vorbefragung und Nachbefragung
haben denselben Farbfleck ergänzt bekommen, obwohl nicht explizit genannt - für echte Einheitlichkeit über
den gesamten sichtbaren Ablauf.

## 14.09.2026 Alter Pausenhinweis erschien nach einem Reload während Pause/Kurzfeedback wieder

**Entscheidung:** `NudgeCard`/`NudgeModal` werden jetzt nur noch gerendert, wenn `state === "WORK"` ist,
nicht mehr nur abhängig von `!hasReacted`.
**Begründung:** Husin bekam nach "Sitzung beenden am Ende einer Pause" einen widersprüchlichen Bildschirm:
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
**Begründung:** Husins Befund nach eigenem Test aller drei Aktivitäten: "alle 20 bis 59 Sekunden nur eine
Anweisung" fühle sich trotz Sprachausgabe passiv und langweilig an. Beim Nachvollziehen bestätigt: die
visuelle Hierarchie war verkehrt - das auffälligste Element am Bildschirm (die große Zahl) war die
Gesamtpausenzeit, nicht der laufende Schritt, und zwischen den Schritten änderte sich nur ein Satz Text ohne
jedes Fortschritts- oder Wechselsignal.
**Alternative:** Ein Knopf zum manuellen Weiterschalten je Schritt. Verworfen - die Übungen (z. B. "20
Sekunden in die Ferne schauen") funktionieren nur, wenn die Zeit wirklich abläuft, ein Skip würde den
gesundheitlichen Zweck der Übung untergraben. Die Interaktivität kommt stattdessen aus reicherem Feedback
während der ohnehin nötigen Wartezeit (Ring, Ton, Fortschrittszählung), nicht aus mehr Kontrolle.
**Bezug:** "Keine Aktivität" bleibt unverändert (einfach die normale Pausenuhr, wie von Husin bestätigt kein
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
**Begründung:** Husins Befund - die Durchführung ist ortsunabhängig und unbegleitet, Teilnehmende bekommen
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
**Begründung:** Husins Bitte, Phase I jetzt umzusetzen und ihm dabei Docker/Deployment beizubringen - beide
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
**Hinweis für Husin:** Beim Testen aus Versehen kurz die lokale `.env` mit Test-Werten überschrieben (beim
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
