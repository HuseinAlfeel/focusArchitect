# Codebuch

Datenwörterbuch zu den drei Exportdateien von FocusArchitect. Erklärt jede Spalte:
Wortlaut der Frage, wo sie gestellt wird, welches Format und welcher Wertebereich gelten,
unter welcher Bedingung sie überhaupt erscheint und was eine leere Zelle bedeutet.

> **Diese Datei wird erzeugt, nicht von Hand geschrieben.** Sie entsteht aus den
> Fragedefinitionen in `src/content/` und der Spaltenliste in `src/lib/exportColumns.ts` –
> also aus derselben Quelle, aus der auch der Export selbst gebaut wird. Damit kann sie nicht
> von der Anwendung abweichen. Änderungen am Wortlaut gehören in die Inhaltsdateien, danach:
>
> ```
> npm run codebuch
> ```
>
> Zuletzt erzeugt am 2026-09-22.

## Was eine leere Zelle bedeutet

Eine leere Zelle ist nicht immer dasselbe. Es gibt genau drei Fälle, und die Spalte
„Leere Zelle bedeutet“ nennt für jede Spalte den zutreffenden:

| Fall | Bedeutung |
|---|---|
| **nicht gezeigt** | Die Frage wurde aufgrund einer Bedingung gar nicht angezeigt. Es fehlt keine Antwort – die Frage gab es für diese Person nicht. |
| **nicht beantwortet** | Die Frage wurde angezeigt, war freiwillig und blieb leer. |
| **nicht anwendbar** | Die Kennzahl ist für diese Zeile nicht definiert, etwa die Reaktionslatenz bei durchgehend sichtbarem Tab. |

Für Pflichtfelder ist eine leere Zelle immer ein Hinweis auf ein Problem, nicht auf eine
Enthaltung – sie können ohne Antwort nicht abgeschickt werden.

## Die beiden Skalen der Nachbefragung

| Skala | Spalten | Anzahl | Auswertung |
|---|---|---|---|
| Wahrgenommene Überzeugungskraft (Persuasiveness) | `N3`, `N4`, `N5`, `N6`, `N7`, `N8`, `N9`, `N10`, `N11` | 9 | Mittelwert je Person über alle 9 Aussagen |
| Wahrgenommene Aufdringlichkeit (Intrusiveness) | `N12`, `N13`, `N14`, `N15` | 4 | Mittelwert je Person über alle 4 Aussagen |

Beide Skalen sind siebenstufig (1 = „Stimme überhaupt nicht zu“ bis 7 = „Stimme voll und ganz zu“)
und wortgleich aus der Vorlage übernommen, einschließlich des Tippfehlers in N4
(„diesem Assistenzsystems“) – bei validierten Skalen wird der Wortlaut nicht korrigiert.

> **PLATZHALTER – Quellenangabe fehlt.** Im Projekt ist an keiner Stelle festgehalten, aus
> welcher Veröffentlichung die beiden Skalen stammen; die Dateien sprechen nur von einer
> „etablierten Skala“. Die genaue Quelle ist mit der Betreuung zu klären und hier einzutragen
> (in `scripts/codebuch-erzeugen.ts`, nicht in dieser Datei).

Über alle Personen hinweg werden Mittelwert, Standardabweichung, Minimum und Maximum beider
Skalen berichtet.

## participants.csv

Eine Zeile je Sitzung, in der Praxis je teilnehmende Person. Vor- und Nachbefragung stehen nebeneinander.

| Spalte | Fragetext / Inhalt | Seite / Block | Format | Wertebereich | Bedingung | Leere Zelle bedeutet |
|---|---|---|---|---|---|---|
| `code` | Teilnahme-Code | Sitzung | Text | `P01`–`P20`, `PILOT`, `ADMIN` | immer | nicht anwendbar |
| `sessionId` | Technische Kennung der Sitzung | Sitzung | Text | cuid | immer | nicht anwendbar |
| `consentAt` | Zeitpunkt der Einwilligung | Sitzung | Zeitstempel | ISO 8601, UTC | immer | keine Einwilligung erteilt – dann dürfen auch keine Studiendaten vorliegen |
| `startedAt` | Zeitpunkt des Sitzungsstarts | Sitzung | Zeitstempel | ISO 8601, UTC | nach der Vorbefragung | Sitzung nie gestartet |
| `endedAt` | Zeitpunkt des Sitzungsendes | Sitzung | Zeitstempel | ISO 8601, UTC | beim Beenden über den Knopf | Sitzung nicht beendet (abgebrochen oder noch offen) |
| `durationMin` | Sitzungsdauer, berechnet aus endedAt minus startedAt | Sitzung | Zahl (Minuten) | ganze Minuten | nur wenn startedAt und endedAt vorliegen | nicht anwendbar |
| `finalizedAt` | Zeitpunkt der endgültigen Abgabe, danach kein Wiedereröffnen | Sitzung | Zeitstempel | ISO 8601, UTC | nach der Nachbefragung | noch nicht endgültig abgegeben |
| `initialWorkMin` | Rundenlänge zu Beginn der Sitzung | Sitzung | Zahl (Minuten) | Standard 25 | immer | nicht anwendbar |
| `initialBreakMin` | Geplante Pausenlänge, über die ganze Sitzung unverändert | Sitzung | Zahl (Minuten) | Standard 5 | immer | nicht anwendbar |
| `taskDescription` | „Woran arbeitest du?“, frei beschrieben beim Sitzungsstart | Sitzungsstart | Freitext | freier Text | immer sichtbar | nicht beantwortet |
| `restedAtStart` | „Wie ausgeruht fühlst du dich jetzt gerade?“, unmittelbar vor Sitzungsstart | Sitzungsstart | Skala 1–7 | 1–7 (1 = gar nicht, 7 = sehr) | immer sichtbar | nicht beantwortet |
| `focusAtStart` | „Wie konzentriert fühlst du dich jetzt gerade?“, unmittelbar vor Sitzungsstart | Sitzungsstart | Skala 1–7 | 1–7 (1 = gar nicht, 7 = sehr) | immer sichtbar | nicht beantwortet |
| `A1` | Altersgruppe | Vorbefragung, Schritt 1 (Person und Tätigkeit) | Auswahl | `18-24`, `25-34`, `35-44`, `45-54`, `55+` | immer sichtbar | nicht beantwortet |
| `A2` | Geschlecht | Vorbefragung, Schritt 1 (Person und Tätigkeit) | Auswahl | `weiblich`, `maennlich`, `divers`, `keine_angabe` | immer sichtbar | nicht beantwortet |
| `A3` | Welche Tätigkeit übst du aus? (Berufsbezeichnung oder Studiengang) | Vorbefragung, Schritt 1 (Person und Tätigkeit) | Freitext | freier Text | immer sichtbar | nicht beantwortet |
| `A4` | Arbeitest du überwiegend im Homeoffice? | Vorbefragung, Schritt 1 (Person und Tätigkeit) | Auswahl | `ja`, `teilweise`, `nein` | immer sichtbar | nicht beantwortet |
| `A5` | Wie viele Stunden arbeitest du an einem typischen Arbeitstag? | Vorbefragung, Schritt 1 (Person und Tätigkeit) | Zahl | ganze Zahl | immer sichtbar | nicht beantwortet |
| `A6` | Wie viele davon sitzend am Bildschirm? | Vorbefragung, Schritt 1 (Person und Tätigkeit) | Zahl | ganze Zahl | immer sichtbar | nicht beantwortet |
| `B1` | Wie lange arbeitest du üblicherweise am Stück am Bildschirm, ohne Pause? | Vorbefragung, Schritt 2 (Pausenverhalten) | Auswahl | `<30`, `30-60`, `60-120`, `>120` | immer sichtbar | nicht beantwortet |
| `B2` | Machst du bei solcher Arbeit bewusst Pausen? | Vorbefragung, Schritt 2 (Pausenverhalten) | Auswahl (ja/nein) | `ja`, `nein` | immer sichtbar | nicht beantwortet |
| `B2_followUp` | Wie viele bewusste Pausen machst du an einem typischen Arbeitstag? | Vorbefragung, Schritt 2 (Pausenverhalten), Anschlussfrage zu B2 | Zahl | ganze Zahl | nur wenn B2 = ja | nicht gezeigt (wenn B2 = nein) oder nicht beantwortet (wenn B2 = ja und das Feld leer blieb) |
| `B3` | Nutzt du Hilfsmittel für Pausen (z. B. Timer, Pomodoro-App)? | Vorbefragung, Schritt 2 (Pausenverhalten) | Auswahl (ja/nein) | `ja`, `nein` | nur wenn B2 = ja | nicht gezeigt |
| `B3_followUp` | Welche, und wie regelmäßig nutzt du sie? | Vorbefragung, Schritt 2 (Pausenverhalten), Anschlussfrage zu B3 | Freitext | freier Text | nur wenn B2 = ja UND B3 = ja | nicht gezeigt (wenn B3 = nein) oder nicht beantwortet (wenn B3 = ja und das Feld leer blieb) |
| `B4` | Beschreibe kurz, wie du Pausen machst. | Vorbefragung, Schritt 2 (Pausenverhalten) | Freitext (mehrzeilig) | freier Text | immer sichtbar | nicht beantwortet |
| `C1` | Wie wichtig sind dir Pausen bei der Bildschirmarbeit? | Vorbefragung, Schritt 2 (Einstellung) | Skala 1–7 | 1–7 (1 = „gar nicht wichtig", 7 = „sehr wichtig") | immer sichtbar | nicht beantwortet |
| `D1` | Wie erschöpft fühlst du dich typischerweise am Ende eines Arbeitstages? | Vorbefragung, Schritt 2 (typisches Befinden) | Skala 1–7 | 1–7 (1 = „gar nicht", 7 = „sehr") | immer sichtbar | nicht beantwortet |
| `N1` | Wie konzentriert warst du in dieser Sitzung? | Nachbefragung, Seite 1 (Zustand nach der Sitzung) | Skala 1–7 | 1–7 (1 = „gar nicht", 7 = „sehr") | immer sichtbar, Pflichtfeld | nicht beantwortet (Pflichtfeld, sollte nicht vorkommen) |
| `N2` | Wie erschöpft fühlst du dich jetzt? | Nachbefragung, Seite 1 (Zustand nach der Sitzung) | Skala 1–7 | 1–7 (1 = „gar nicht", 7 = „sehr") | immer sichtbar, Pflichtfeld | nicht beantwortet (Pflichtfeld, sollte nicht vorkommen) |
| `N3` | Durch die Nutzung dieses Assistenzsystem werde ich meine Einstellung verändern. | Nachbefragung, Seite 2 (Skala Überzeugungskraft) | Skala 1–7 (Likert) | 1–7 (1 = „Stimme überhaupt nicht zu", 7 = „Stimme voll und ganz zu") | immer sichtbar, Pflichtfeld | nicht beantwortet (Pflichtfeld, sollte nicht vorkommen) |
| `N4` | Ich glaube, dass Erinnerungen von diesem Assistenzsystems richtig sind. | Nachbefragung, Seite 2 (Skala Überzeugungskraft) | Skala 1–7 (Likert) | 1–7 (1 = „Stimme überhaupt nicht zu", 7 = „Stimme voll und ganz zu") | immer sichtbar, Pflichtfeld | nicht beantwortet (Pflichtfeld, sollte nicht vorkommen) |
| `N5` | Dieses Assistenzsystem hat das Potential andere Nutzer*innen zu beeinflussen. | Nachbefragung, Seite 2 (Skala Überzeugungskraft) | Skala 1–7 (Likert) | 1–7 (1 = „Stimme überhaupt nicht zu", 7 = „Stimme voll und ganz zu") | immer sichtbar, Pflichtfeld | nicht beantwortet (Pflichtfeld, sollte nicht vorkommen) |
| `N6` | Dieses Assistenzsystem bewirkt, dass ich einige Veränderungen an meinem Verhalten vornehme. | Nachbefragung, Seite 2 (Skala Überzeugungskraft) | Skala 1–7 (Likert) | 1–7 (1 = „Stimme überhaupt nicht zu", 7 = „Stimme voll und ganz zu") | immer sichtbar, Pflichtfeld | nicht beantwortet (Pflichtfeld, sollte nicht vorkommen) |
| `N7` | Dieses Assistenzsystem hat das Potential das Verhalten anderer Nutzer*innen zu verändern. | Nachbefragung, Seite 2 (Skala Überzeugungskraft) | Skala 1–7 (Likert) | 1–7 (1 = „Stimme überhaupt nicht zu", 7 = „Stimme voll und ganz zu") | immer sichtbar, Pflichtfeld | nicht beantwortet (Pflichtfeld, sollte nicht vorkommen) |
| `N8` | Dieses Assistenzsystem wird Veränderungen in meinem Verhalten herbei führen. | Nachbefragung, Seite 2 (Skala Überzeugungskraft) | Skala 1–7 (Likert) | 1–7 (1 = „Stimme überhaupt nicht zu", 7 = „Stimme voll und ganz zu") | immer sichtbar, Pflichtfeld | nicht beantwortet (Pflichtfeld, sollte nicht vorkommen) |
| `N9` | Dieses Assistenzsystem hat das Potential andere Nutzer*innen zu inspirieren. | Nachbefragung, Seite 2 (Skala Überzeugungskraft) | Skala 1–7 (Likert) | 1–7 (1 = „Stimme überhaupt nicht zu", 7 = „Stimme voll und ganz zu") | immer sichtbar, Pflichtfeld | nicht beantwortet (Pflichtfeld, sollte nicht vorkommen) |
| `N10` | Erinnerungen von diesem Assistenzsystem sind akkurat. | Nachbefragung, Seite 2 (Skala Überzeugungskraft) | Skala 1–7 (Likert) | 1–7 (1 = „Stimme überhaupt nicht zu", 7 = „Stimme voll und ganz zu") | immer sichtbar, Pflichtfeld | nicht beantwortet (Pflichtfeld, sollte nicht vorkommen) |
| `N11` | Dieses Assistenzsystem ist vertrauenswürdig. | Nachbefragung, Seite 2 (Skala Überzeugungskraft) | Skala 1–7 (Likert) | 1–7 (1 = „Stimme überhaupt nicht zu", 7 = „Stimme voll und ganz zu") | immer sichtbar, Pflichtfeld | nicht beantwortet (Pflichtfeld, sollte nicht vorkommen) |
| `N12` | Die Qualität meiner Arbeit hat sich in Anwesenheit des Assistenzsystems verschlechtert. | Nachbefragung, Seite 2 (Skala Aufdringlichkeit) | Skala 1–7 (Likert) | 1–7 (1 = „Stimme überhaupt nicht zu", 7 = „Stimme voll und ganz zu") | immer sichtbar, Pflichtfeld | nicht beantwortet (Pflichtfeld, sollte nicht vorkommen) |
| `N13` | Das Assistenzsystem stört meinen Arbeitsfluss. | Nachbefragung, Seite 2 (Skala Aufdringlichkeit) | Skala 1–7 (Likert) | 1–7 (1 = „Stimme überhaupt nicht zu", 7 = „Stimme voll und ganz zu") | immer sichtbar, Pflichtfeld | nicht beantwortet (Pflichtfeld, sollte nicht vorkommen) |
| `N14` | Ich fühle mich genervt von dem Assistenzsystem. | Nachbefragung, Seite 2 (Skala Aufdringlichkeit) | Skala 1–7 (Likert) | 1–7 (1 = „Stimme überhaupt nicht zu", 7 = „Stimme voll und ganz zu") | immer sichtbar, Pflichtfeld | nicht beantwortet (Pflichtfeld, sollte nicht vorkommen) |
| `N15` | Das Assistenzsystem lenkt mich ab. | Nachbefragung, Seite 2 (Skala Aufdringlichkeit) | Skala 1–7 (Likert) | 1–7 (1 = „Stimme überhaupt nicht zu", 7 = „Stimme voll und ganz zu") | immer sichtbar, Pflichtfeld | nicht beantwortet (Pflichtfeld, sollte nicht vorkommen) |
| `N16` | Im Vergleich zu deiner gewohnten Arbeitsweise war diese Sitzung … | Nachbefragung, Seite 1 (Vergleich) | Auswahl | `besser`, `gleich`, `schlechter` | immer sichtbar, Pflichtfeld | nicht beantwortet (Pflichtfeld, sollte nicht vorkommen) |
| `N17` | Warum? (optional) | Nachbefragung, Seite 1 (Begründung zum Vergleich) | Freitext | freier Text | immer sichtbar, freiwillig | nicht beantwortet |
| `N18` | Was hat dich am meisten gestört? | Nachbefragung, Seite 3 (abschließendes Feedback) | Freitext (mehrzeilig) | freier Text | immer sichtbar, freiwillig | nicht beantwortet |
| `N19` | Was hat am besten funktioniert? | Nachbefragung, Seite 3 (abschließendes Feedback) | Freitext (mehrzeilig) | freier Text | immer sichtbar, freiwillig | nicht beantwortet |
| `N20` | Wie hat dir die Bedienoberfläche gefallen? Was würdest du daran ändern? | Nachbefragung, Seite 3 (abschließendes Feedback) | Freitext (mehrzeilig) | freier Text | immer sichtbar, freiwillig | nicht beantwortet |
| `postPage1Seconds` | Bearbeitungsdauer Seite 1 der Nachbefragung | Nachbefragung, abgeleitet | Zahl (Sekunden) | ganze Sekunden | nur wenn Lade- und Absendezeitpunkt vorliegen | nicht anwendbar |
| `postPage2Seconds` | Bearbeitungsdauer Seite 2 der Nachbefragung (13 Aussagen). Richtwert für Blindklicken: unter 20 Sekunden | Nachbefragung, abgeleitet | Zahl (Sekunden) | ganze Sekunden | nur wenn Lade- und Absendezeitpunkt vorliegen | nicht anwendbar |
| `postPage3Seconds` | Bearbeitungsdauer Seite 3 der Nachbefragung | Nachbefragung, abgeleitet | Zahl (Sekunden) | ganze Sekunden | nur wenn Lade- und Absendezeitpunkt vorliegen | nicht anwendbar |

## cycles.csv

Eine Zeile je Runde. Hier stehen die Kernkennzahlen der Arbeit: bei welcher Stufe reagiert wurde, wie lange Pausen tatsächlich dauerten, wie die Rundenlänge angepasst wurde.

| Spalte | Fragetext / Inhalt | Seite / Block | Format | Wertebereich | Bedingung | Leere Zelle bedeutet |
|---|---|---|---|---|---|---|
| `code` | Teilnahme-Code | Sitzung | Text | `P01`–`P20`, `PILOT`, `ADMIN` | immer | nicht anwendbar |
| `sessionId` | Technische Kennung der Sitzung | Sitzung | Text | cuid | immer | nicht anwendbar |
| `cycle` | Rundennummer innerhalb der Sitzung | Runde | Zahl | ab 1 aufsteigend | immer | Ereignis gehört zu keiner Runde (z. B. Einwilligung, Vorbefragung) |
| `workMin` | Rundenlänge dieser Runde | Runde | Zahl (Minuten) | mindestens 5 | immer | nicht anwendbar |
| `workStartedAt` | Beginn der Arbeitsphase dieser Runde | Runde | Zeitstempel | ISO 8601, UTC | immer | kein WORK_STARTED protokolliert |
| `reactionType` | Art der Reaktion, die die Runde beendet hat | Runde | Auswahl | `BREAK_ACCEPTED`, `BREAK_SKIPPED`, `SELF_INITIATED` | immer | Runde wurde nicht beendet (letzte Runde bei Sitzungsende) |
| `reactionStage` | Stufe des Hinweises zum Zeitpunkt der Reaktion – die Kernkennzahl der Arbeit | Runde | Zahl | 0–3 | nur bei Reaktion auf einen Systemhinweis | nicht anwendbar (selbst gestartete Pause, kein Hinweis im Spiel) |
| `reactionSecondsAfterEnd` | Sekunden zwischen Rundenende und Reaktion | Runde | Zahl (Sekunden) | kann negativ sein, wenn vor 0:00 reagiert wurde | nur bei Reaktion auf einen Systemhinweis | nicht anwendbar |
| `reactionSecondsIntoWork` | Sekunden seit Beginn der Arbeitsphase bei selbst gestarteter Pause | Runde | Zahl (Sekunden) | ab 0 | nur bei `SELF_INITIATED` | nicht anwendbar |
| `reactionAt` | Zeitpunkt der Reaktion | Runde | Zeitstempel | ISO 8601, UTC | immer bei Reaktion | Runde wurde nicht beendet |
| `nudgeStage1At` | Zeitpunkt, zu dem Stufe 1 erreicht wurde (Rundenende, 0:00) | Runde | Zeitstempel | ISO 8601, UTC | nur wenn der Hinweis Stufe 1 erreicht hat | nicht anwendbar (Pause vorher selbst gestartet) |
| `tabVisibleAtNudge` | War der Browser-Tab sichtbar, als Stufe 1 ausgelöst wurde? | Runde | Wahrheitswert | `true`, `false` | nur wenn Stufe 1 erreicht wurde | nicht anwendbar |
| `firstTabVisibleAfterNudge` | Erste Rückkehr zum Tab nach Stufe 1, gesucht nur bis zur Reaktion | Runde | Zeitstempel | ISO 8601, UTC | nur wenn der Tab bei Stufe 1 unsichtbar war UND eine Reaktion erfolgte | nicht anwendbar (Tab war sichtbar, es gab nichts zum Zurückkommen) |
| `latencyToTabReturnSeconds` | Reaktionslatenz: Sekunden von Stufe 1 bis zur Rückkehr zum Tab | Runde | Zahl (Sekunden) | ab 0 | nur wenn der Tab bei Stufe 1 unsichtbar war UND eine Reaktion erfolgte | nicht anwendbar (siehe tabVisibleAtNudge – bei `true` gab es nichts zum Zurückkommen) |
| `snoozeCount` | Wie oft in dieser Runde „Noch 5 Minuten“ gewählt wurde | Runde | Zahl | ab 0, keine Obergrenze | immer | nicht anwendbar |
| `activity` | Gewählte Pausenaktivität | Pause | Auswahl | `eyes`, `neck`, `move`, `keine` | nur wenn eine Pause stattfand | nicht anwendbar (Pause übersprungen) |
| `breakStartedAt` | Beginn der Pause | Pause | Zeitstempel | ISO 8601, UTC | nur wenn eine Pause stattfand | nicht anwendbar (Pause übersprungen) |
| `breakEndedAt` | Ende der Pause – erst wenn „Sitzung starten“ gedrückt wird, nicht wenn der Timer abläuft | Pause | Zeitstempel | ISO 8601, UTC | nur wenn die Pause beendet wurde | nicht anwendbar (Pause übersprungen oder Sitzung endete während der Pause) |
| `breakPlannedMin` | Geplante Pausenlänge (entspricht initialBreakMin) | Pause | Zahl (Minuten) | Standard 5 | nur wenn eine Pause stattfand | nicht anwendbar (Pause übersprungen) |
| `breakActualMin` | Tatsächliche Pausendauer, breakEndedAt minus breakStartedAt – kann die geplante Dauer deutlich überschreiten | Pause | Zahl (Minuten) | ganze Minuten | nur wenn Beginn und Ende vorliegen | nicht anwendbar |
| `timing` | Kurzfeedback: „War der Zeitpunkt der Pause passend?“ – getrennt nach reactionType auswerten | Kurzfeedback | Auswahl | `TOO_EARLY`, `OK`, `TOO_LATE` | nach jeder Runde, auch nach selbst gestarteter Pause | kein Kurzfeedback abgegeben (Runde nicht beendet) |
| `adjustmentMin` | GEWÜNSCHTE Änderung der Rundenlänge in Minuten | Kurzfeedback | Zahl (Minuten) | Vielfaches von 5, positiv oder negativ | nur bei „zu früh“ oder „zu spät“ | kein Kurzfeedback abgegeben |
| `effectiveAdjustmentMin` | WIRKSAME Änderung: newWorkMin minus workMin. Weicht von adjustmentMin ab, wenn die Untergrenze von 5 Minuten greift | Kurzfeedback | Zahl (Minuten) | Vielfaches von 5 | nur wenn ein Kurzfeedback vorliegt | kein Kurzfeedback abgegeben |
| `newWorkMin` | Rundenlänge der nächsten Runde | Kurzfeedback | Zahl (Minuten) | mindestens 5 | nur wenn ein Kurzfeedback vorliegt | kein Kurzfeedback abgegeben |
| `comment` | „Kurz in eigenen Worten?“ im Kurzfeedback | Kurzfeedback | Freitext | freier Text | immer sichtbar, freiwillig | nicht beantwortet |

## events.csv

Eine Zeile je Ereignis, der vollständige Rohlog. Für alles, was die beiden anderen Dateien nicht abdecken.

| Spalte | Fragetext / Inhalt | Seite / Block | Format | Wertebereich | Bedingung | Leere Zelle bedeutet |
|---|---|---|---|---|---|---|
| `code` | Teilnahme-Code | Sitzung | Text | `P01`–`P20`, `PILOT`, `ADMIN` | immer | nicht anwendbar |
| `sessionId` | Technische Kennung der Sitzung | Sitzung | Text | cuid | immer | nicht anwendbar |
| `type` | Ereignistyp | Ereignis | Auswahl | siehe Ereignisliste in SPEZIFIKATION.md, Abschnitt [11] | immer | nicht anwendbar |
| `cycle` | Rundennummer innerhalb der Sitzung | Runde | Zahl | ab 1 aufsteigend | immer | Ereignis gehört zu keiner Runde (z. B. Einwilligung, Vorbefragung) |
| `clientAt` | Zeitpunkt im Browser – **für die zeitliche Sortierung diese Spalte verwenden** | Ereignis | Zeitstempel | ISO 8601, UTC | immer | nicht anwendbar |
| `at` | Zeitpunkt des Eintreffens auf dem Server – kann durch Stapelversand deutlich später liegen | Ereignis | Zeitstempel | ISO 8601, UTC | immer | nicht anwendbar |
| `payload` | Zusatzangaben des Ereignisses als JSON | Ereignis | JSON | je nach Ereignistyp, siehe SPEZIFIKATION.md [11] | je nach Ereignistyp | dieser Ereignistyp führt keine Zusatzangaben |

## Hinweise für die Auswertung

Diese Punkte betreffen nicht einzelne Spalten, sondern den Umgang mit den Dateien insgesamt.

- **Sortierung:** Die Zeilen in `events.csv` stehen nicht in zeitlicher Reihenfolge, weil
  Ereignisse in Stapeln eintreffen. Immer nach `clientAt` sortieren – nie nach der
  Zeilenreihenfolge und nie nach `at`.
- **Ausschluss:** Die Zugänge `PILOT` und `ADMIN` vor jeder Auswertung herausfiltern.
- **Blindklicken:** Personen mit auffällig kurzer Bearbeitungszeit auf Seite 2 der
  Nachbefragung markieren, Richtwert unter 20 Sekunden für 13 Aussagen
  (`postPage2Seconds`). Im Ergebnisteil offenlegen, ob und wie viele Datensätze betroffen
  waren.
- **Kurzfeedback getrennt auswerten:** `timing` nach `reactionType` trennen. „Zu früh“ nach
  einem Systemhinweis bedeutet etwas anderes als „zu früh“ nach einer selbst gestarteten Pause.
- **Wunsch und Wirkung trennen:** `adjustmentMin` ist der Wunsch, `effectiveAdjustmentMin`
  die tatsächliche Änderung. Sie weichen voneinander ab, sobald die Untergrenze von 5 Minuten
  greift.
- **Stufe 0 und selbst gestartete Pausen:** Selbst gestartete Pausen, die in die letzten zwei
  Minuten vor Rundenende fallen, liegen im Zeitfenster von Stufe 0. Eine Häufung dort wäre ein
  Hinweis darauf, dass der Farbverlauf wahrgenommen wurde.
- **`ACTIVITY_TICK` gewichten:** Diese Ereignisse machen etwa zwei Drittel aller Zeilen in
  `events.csv` aus, erfassen aber nur Aktivität innerhalb des Anwendungsfensters, nicht die
  eigentliche Arbeitsaktivität. In der Auswertung als Nebeninformation behandeln.
