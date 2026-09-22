# FocusArchitect: Vollständige Spezifikation

*Prototyp zur Bachelorarbeit „Förderung mentaler Fokussierung und gesunder Bildschirmpausen durch Software-Interventionen" | Husin Alfil | Stand: 03.08.2026*

---

## 0. Leitprinzip

Diese Anwendung ist ein **Messinstrument**, keine Produkt-App. Jede Funktion muss eine von zwei Bedingungen erfüllen:

1. Sie ist Teil der Intervention, die du untersuchst (abgestufter Hinweis, anpassbares Intervall, Pausenaktivität)
2. Sie liefert Daten, die eine deiner Teilfragen beantworten

Alles andere wird nicht gebaut. Kein Dashboard mit hübschen Statistiken, keine Einstellungsseite, kein Profilbild. Jede Stunde, die du in eine Funktion steckst, die in der Auswertung nicht vorkommt, fehlt dir beim Schreiben.

**Was die App am Ende beweisen muss (UF3):** Wie bewerten Nutzende die empfundene Störwirkung und die Akzeptanz dieser Gestaltung im Vergleich zu ihrer gewohnten Arbeitsweise?

---

## 1. Tech-Stack

### Empfehlung

| Ebene | Wahl | Warum |
|---|---|---|
| Framework | **Next.js 16 (App Router)** | React, das du kennst. Frontend und Backend in einem Projekt, keine getrennte API. |
| Sprache | **TypeScript** | Verhindert genau die Fehler, die dich sonst am Studientag treffen. |
| Styling | **Tailwind CSS** | Schnell, und du brauchst subtile Farbübergänge für den abgestuften Hinweis. |
| Datenbank | **PostgreSQL** | Robust, kostenlos, überall hostbar. |
| ORM | **Prisma** | Schema als Code, Migrationen automatisch, Typsicherheit bis in die Komponenten. |
| Auth | **Eigene Credentials-Lösung mit Cookie** | Bei 7 Accounts ohne Registrierung ist NextAuth Overkill. Siehe Abschnitt 3. |
| Zeitsteuerung | **Eigener Hook + `Date.now()`** | Wichtig: NICHT `setInterval` allein zählen lassen, siehe Abschnitt 6.3. |
| Charts (optional) | **Recharts** | Nur für deine eigene Auswertung, nicht für Nutzende. |

### Hosting: dein Server statt Vercel

Vercel ist bequemer, aber für deine Arbeit spricht viel für **deinen eigenen gemieteten Server**:

- **Datenschutz.** Du erhebst personenbezogene Daten in einer Studie an einem deutschen Institut. Ein Server in Deutschland ist im Ethik- und Datenschutzgespräch die deutlich einfachere Antwort als „liegt bei einem US-Anbieter". Das kann dir Diskussionen ersparen.
- Du hast ihn ohnehin schon.
- Du kannst die Datenbank direkt sichern.

**Setup auf deinem Server:** Docker Compose mit zwei Containern (Next.js App + Postgres), davor Caddy oder Nginx für HTTPS. Caddy holt sich das Zertifikat automatisch, das spart dir eine Stunde.

Falls du doch Vercel nimmst: **EU-Region wählen** (Frankfurt) und für die Datenbank Neon oder Supabase mit EU-Region. Erwähne das dann im Datenschutzabschnitt deiner Arbeit.

---

## 2. Der Ablauf, Bildschirm für Bildschirm

```
[1] Login
      ↓
[2] Aufklärung + Einwilligung        ← muss VOR jeder Datenerhebung stehen
      ↓
[3] Vorbefragung (Baseline)
      ↓
[4] Sitzungsstart: Tätigkeit benennen, Startwerte bestätigen
      ↓
   ┌──────────────────────────────────┐
   │  [5] Arbeitsphase (25 Min)       │
   │        ↓                          │
   │  [6] Abgestufter Pausenhinweis   │
   │        ↓                          │
   │  [7] Kurzfeedback + Anpassung     │
   │        ↓                          │
   │  [8] Aktivitätsauswahl            │
   │        ↓                          │
   │  [9] Pause (5 Min)                │
   └──────────────┬───────────────────┘
                  │  offenes Ende, Teilnehmende beenden selbst
                  ↓
[10] Nachbefragung
      ↓
[11] Abschluss + Dank
```

> **Reihenfolge am 09.08. geändert:** Kurzfeedback (ehemals [9]) kommt jetzt direkt nach der Reaktion auf den
> Pausenhinweis, noch vor Aktivitätsauswahl und Pause, nicht danach. Begründung: Die Frage "war der Zeitpunkt
> passend" bewertet die gerade beendete Arbeitsphase; das lässt sich direkt im Anschluss zuverlässiger beantworten
> als erst nach einer mehrminütigen Pause. Die dort entschiedene neue Arbeitszeit wird erst beim Sitzungsstart
> nach der Pause angewendet.

> **Offenes Sitzungsende (25.08. geändert):** Keine feste Obergrenze mehr (vorher ca. 120 Min / 4 Runden).
> Teilnehmende arbeiten so lange, wie sie möchten, und beenden selbst über den vorhandenen Knopf. Mehr Zyklen
> bedeuten mehr Gelegenheiten zur Intervallanpassung, deiner aussagekräftigsten Datenquelle, und entspricht
> realer Nutzung. Folge für die Auswertung: unterschiedliche Sitzungslängen pro Person - die Zyklenanzahl muss
> pro Person mitberichtet werden, gehört als Punkt in die Limitationen. Gesamtdauer steht als `durationMin`
> in `participants.csv` (berechnet aus `endedAt - startedAt`, nicht redundant in der DB gespeichert).

> **Onboarding verdichtet (Änderung 14.09.):** [3] und [4] sind jetzt aufeinanderfolgende Bildschirme ohne
> Zwischenklick: ein kurzer Erklärschritt "So funktioniert die App" (ergänzt, da die Durchführung
> ortsunabhängig und unbegleitet ist), Vorbefragung Teil 1 (Block A), Vorbefragung Teil 2 (Block B+C+D) und
> ein kombinierter Dashboard-/Sitzungsstart-Bildschirm. Die vorher leere "Eingeloggt als..."-Zwischenseite ist
> komplett weg - nach Login und Einwilligung geht es ohne Klick direkt weiter. Der kombinierte letzte
> Bildschirm ist ab jetzt auch die normale Startseite (`/study`) für jeden weiteren Login, solange die
> Sitzung noch nicht gestartet ist. Details siehe [3] und [4].

### [1] Login

Kein Registrierungsformular. Du legst die Accounts vorher selbst an:

- `P01` bis `P06` für die Teilnehmenden
- `PILOT` für den Probelauf
- `ADMIN` für dich

Bildschirm: zwei Felder, ein Knopf. Nichts sonst.

> **Warum Codes statt Namen:** Du erhebst damit von vornherein pseudonymisiert. Im Datenschutzabschnitt deiner Arbeit ist das ein starkes Argument, und du musst keine Klarnamen speichern.

### [2] Aufklärung und Einwilligung

**Dieser Bildschirm ist Pflicht und muss vor jeder Datenerhebung stehen.** Inhalt (aus den Vorgaben zur Durchführung von Studien):

- Wer führt die Studie durch (du, im Rahmen deiner Bachelorarbeit am HPI)
- Warum und mit welchem Ziel
- Welche Daten erhoben werden (konkret auflisten!)
- Wo und wie lange sie gespeichert werden
- Dass die Teilnahme freiwillig ist und jederzeit abgebrochen werden kann
- Dass die Löschung der Daten jederzeit verlangt werden kann
- Deine Kontaktadresse

Unten: Checkbox „Ich habe die Informationen gelesen und nehme freiwillig teil" plus Knopf. Ohne Häkchen geht es nicht weiter. Zeitpunkt der Zustimmung wird gespeichert.

> Den genauen Wortlaut stimmst du mit Holly ab. Frag nach einer Vorlage des Fachgebiets, die gibt es fast sicher.

### [3] Vorbefragung

Erhebt die Baseline, also deinen Vergleichsmaßstab. Überarbeitet am 12.09. (Prioritaet 2 aus der
Betreuungsbesprechung), damit Einstellung und tatsächliches Verhalten nicht mehr vermischt sind - ersetzt die
alte D1-D5/V1-V7-Fassung vollständig. Vier Blöcke, ein einmaliges Profil-Setup (nicht bei jeder Sitzung neu).

**Zwei Bildschirme statt einem (Änderung 14.09.):** Block A ist der erste Bildschirm ("Willkommen! Ein paar
Angaben zu deinem Arbeitsalltag."), Block B+C+D zusammen der zweite ("Noch dein Pausenverhalten."). Antworten
aus Schritt 1 bleiben beim Zurückgehen erhalten (reiner Client-Zustand, noch kein Datenbank-Schreiben). Erst
am Ende von Schritt 2 ("Profil speichern & Weiter") wird alles zusammen als eine `SurveyResponse` gespeichert
- am Datenmodell ändert das nichts, nur an der Aufteilung im Formular.

**Davor ein Erklärschritt "So funktioniert die App" (ergänzt 14.09.):** Die Durchführung ist
ortsunabhängig und unbegleitet - Teilnehmende bekommen nur Link und Zugangsdaten, niemand erklärt vor Ort,
wie die App bedient wird. Die Einwilligung sagt WARUM (Studienzweck), aber nicht WIE. Deshalb jetzt ein
kurzer, rein informativer Schritt 0 vor Block A (`onboarding-intro.ts`, bewusst getrennt vom mit der
Betreuung abgestimmten Einwilligungstext): Rundenprinzip, Pausenhinweis, dass man auch selbst eine Pause
starten kann, und dass man jederzeit über "Sitzung beenden" aufhören kann. Ergänzt am 17.09. (Befund der
Betreuung): der Hinweis, das Fenster mit der App sichtbar zu lassen - z. B. auf einem Viertel bis einem
Drittel des Bildschirms daneben oder auf einem zweiten Bildschirm -, weil man den sich wandelnden
Hintergrund sonst gar nicht im Augenwinkel mitbekommt. Kein Pflichtfeld, nur ein
"Los geht's"-Knopf. Zusammen mit den beiden Fragebogen-Schritten jetzt "Schritt X von 3" oben auf jeder
Seite.

**Block A - Person und Tätigkeit**

| # | Frage | Format |
|---|---|---|
| A1 | Altersgruppe | Auswahl: 18–24 / 25–34 / 35–44 / 45–54 / 55 und älter |
| A2 | Geschlecht | Auswahl: weiblich / männlich / divers / keine Angabe |
| A3 | Welche Tätigkeit übst du aus? (Berufsbezeichnung oder Studiengang) | Freitext |
| A4 | Arbeitest du überwiegend im Homeoffice? | Auswahl: ja / teilweise / nein |
| A5 | Wie viele Stunden arbeitest du an einem typischen Arbeitstag? | Zahl |
| A6 | Wie viele davon sitzend am Bildschirm? | Zahl |

**Block B - Tatsächliches Pausenverhalten**

| # | Frage | Format |
|---|---|---|
| B1 | Wie lange arbeitest du üblicherweise am Stück am Bildschirm, ohne Pause? | Auswahl: <30min / 30–60 / 60–120 / >120 |
| B2 | Machst du bei solcher Arbeit bewusst Pausen? | Ja/Nein, bei Ja: „Wie viele bewusste Pausen machst du an einem typischen Arbeitstag?" (Zahl) |
| B3 | Nutzt du Hilfsmittel für Pausen (z. B. Timer, Pomodoro-App)? | **Nur bei B2 = Ja.** Ja/Nein, bei Ja: „Welche, und wie regelmäßig nutzt du sie?" (Freitext) |
| B4 | Beschreibe kurz, wie du Pausen machst. | Freitext, immer sichtbar |

**Block C - Einstellung**

| # | Frage | Format |
|---|---|---|
| C1 | Wie wichtig sind dir Pausen bei der Bildschirmarbeit? | Skala 1–7 (gar nicht wichtig … sehr wichtig) |

**Block D - Typisches Befinden**

| # | Frage | Format |
|---|---|---|
| D1 | Wie erschöpft fühlst du dich typischerweise am Ende eines Arbeitstages? | Skala 1–7 |

Block D ist eine Baseline-Einschätzung des typischen Befindens, kein Sitzungsvergleich mehr - der
verlässlichere Vergleichswert für die Nachbefragung wird jetzt direkt vor der Sitzung erhoben, siehe [4]. Die
frühere Frage nach der typischen Konzentration (D2) ist seit 14.09. ersatzlos gestrichen (Vorgabe) -
Erschöpfung allein reicht als Baseline-Trait, `focusAtStart` aus [4] deckt Konzentration bereits situativ ab.

Bei B2 und B3 erscheint die jeweilige Anschlussfrage nur bei „Ja".

**B3 hängt zusätzlich an B2 (Änderung 17.09., Hinweis):** Wer bei „Machst du bewusst Pausen?" mit Nein
antwortet, wurde vorher trotzdem gefragt, ob er *Hilfsmittel für Pausen* nutzt - das ergibt keinen Sinn und
wirkte wie eine verdrehte Logik. Jetzt erscheinen bei Nein weder die Anzahl-Frage noch B3. B4 („Beschreibe
kurz, wie du Pausen machst") bleibt bewusst in beiden Fällen sichtbar: auch „ich mache keine" ist eine
verwertbare Antwort. Eine nicht gestellte Frage wird nicht mitgespeichert - die Spalte bleibt im Export leer,
und weil B2 in derselben Zeile steht, ist eindeutig erkennbar warum. Die Regel steht als
`isPreSurveyItemVisible` in `pre-survey.ts` und wird von Formular **und** `POST /api/survey` benutzt: die
Server-Prüfung darf eine nie gestellte Frage nicht als fehlende Antwort abweisen.

### [4] Sitzungsstart

Dritter und letzter Onboarding-Bildschirm (Änderung 14.09.), zugleich das Dashboard: sobald Profil (Block
A-D) einmal steht, landet man hier bei jedem Login, solange die Sitzung noch nicht gestartet ist - kein Klick
durch eine Zwischenseite mehr.

- Kopfzeile „Hallo {Teilnehmercode}!", darunter „Bevor es losgeht: Wie sieht es jetzt gerade aus?"
- Freitextfeld: „Woran wirst du in dieser Sitzung arbeiten?" (eine Zeile, wird gespeichert)
- „Wie ausgeruht fühlst du dich jetzt gerade?" - Skala 1–7
- „Wie konzentriert fühlst du dich jetzt gerade?" - Skala 1–7
- Kurzer Hinweiskasten „Kurz vor dem Start, bitte einmal prüfen" mit drei Zeilen und einem
  Bestätigungshäkchen (ergänzt 18.09., siehe unten)
- Dezenter Hinweistext: Startwerte (25/5 Minuten) plus kurze Erklärung, dass sich das über das Kurzfeedback
  anpasst
- Ein großer, primärer Knopf „Fokus-Sitzung starten" - löst `PATCH /api/session/:id/start` aus und
  springt bei Erfolg **sofort** zur Timer-Ansicht [5], ohne Zwischenstation über das Dashboard

Die beiden Skalenwerte (ergänzt 12.09., Prioritaet 2) ersetzen das alte V7 aus der Vorbefragung. Eine Messung
unmittelbar vor der Sitzung ist ein verlässlicherer Vergleichswert als eine Einschätzung des typischen
Zustands, und beide Werte lassen sich direkt gegen N1/N2 aus der Nachbefragung stellen. Gespeichert als
eigene Felder auf `Session` (`restedAtStart`, `focusAtStart`), landen aber trotzdem in `participants.csv`.

**Hinweiskasten mit Bestätigungshäkchen (ergänzt 18.09.):** Drei Zeilen direkt über dem Startknopf, Text in
`session-start.ts`: Fenster sichtbar lassen (ein Viertel bis ein Drittel des Bildschirms daneben oder zweiter
Bildschirm), Ton an, eigene echte Aufgabe. Darunter ein Pflichthäkchen „Passt alles, ich kann loslegen",
ohne das der Startknopf gesperrt bleibt.

Die Erklärseite „So funktioniert die App" vor der Vorbefragung [3] bleibt daneben bestehen, sie erklärt den
Ablauf. Zwischen dem Lesen dort und dem echten Sitzungsstart liegen aber rund zehn Minuten Fragebogen, und
wer das Fenster danach zurechtrücken soll, hat es bis dahin vergessen. Deshalb hier noch einmal kurz die
Bedingungen, die wirklich erfüllt sein müssen.

Das ist keine Formalie: bleibt das Fenster im Hintergrund, wirkt die visuelle Eskalation [6] bei dieser
Person gar nicht, und dann wird bei ihr etwas anderes gemessen als bei den übrigen neun. Weil der Startknopf
ohne Häkchen gesperrt ist, gilt für jede gestartete Sitzung, dass die Bedingungen zur Kenntnis genommen
wurden. Das lässt sich so in Kapitel 6.4 schreiben, ohne dass es dafür ein eigenes Feld in der Datenbank
braucht.

### [5] Arbeitsphase

**Der wichtigste Bildschirm, und der muss fast leer sein.** Das ist der Kern deiner Forschungsfrage: Wenn dieser Bildschirm ablenkt, hast du dein eigenes Prinzip verletzt.

Sichtbar: die verbleibende Zeit als M:SS, groß und in einem dezenten Rahmen, aber weiterhin kontrastarm (Änderung 12.09., Betreuung: zurückhaltend heißt nicht unlesbar - die Lösung ist große Schrift bei wenig Kontrast, nicht kleine Schrift). Die Sekundenanzeige war für ein paar Stunden am 12.09. testweise auf Minuten reduziert, noch am selben Tag auf meinen Wunsch wieder auf M:SS zurückgestellt (Details siehe ENTSCHEIDUNGEN.md). Zusätzlich ein sehr sanfter, langsam atmender Farbfleck im Hintergrund (kühl für die Arbeitsphase, warm für die Pause) - rein dekorativ, keine Kennzahl, keine schnelle Bewegung. Darüber klein und kontrastarm: „Fokus · Runde N" bzw. „Pause · Runde N", damit erkennbar ist, welche Phase gerade läuft (dieselbe schon gespeicherte Zyklusnummer, keine eigene Zählung). Sonst nichts. Kein Fortschrittsbalken der zappelt, keine Statistiken, keine Motivationssprüche.

Erlaubte Interaktion: „Sitzung beenden": eine klar erkennbare Schaltfläche oben rechts (Änderung 12.09.: vorher ein kaum sichtbarer Textlink, dann ein kleiner Knopf unten links, der aber hinter dem Next.js-Entwicklungs-Icon steckte), erkennbar ohne dominant zu sein. Rückfrage vor dem Beenden über ein eigenes Bestätigungsfenster im Stil des Pausenhinweises, nicht mehr über den nativen Browser-Dialog. Dazu, ebenso zurückhaltend, unten rechts: „Pause jetzt starten" (ergänzt 14.09.) - lässt die Person die Pause aus eigenem Antrieb beginnen, ohne auf den Pausenhinweis zu warten. Siehe `BREAK_SELF_INITIATED` weiter unten.

### [6] Der abgestufte Pausenhinweis

Das ist deine Umsetzung der Auto-Analogie und **das Herzstück der Arbeit**. Gemeint ist die abgestufte
Geschwindigkeitsrückmeldung im Auto (nicht die Tankanzeige) - die Rückmeldung wird bei zunehmender
Überschreitung stufenweise deutlicher, nicht schlagartig alarmierend. Vier Stufen:

| Stufe | Zeitpunkt | Gestaltung |
|---|---|---|
| **0** | 2 Min vor Ende | Hintergrund wandert langsam von Weiß nach Beige, dabei zieht die Zifferfarbe des Timers mit (Betreuung, 17.09.: der Wechsel fällt so genau dort auf, wo man ohnehin gelegentlich hinschaut - die Restzeit). Bewusst kaum bewusst wahrnehmbar. |
| **1** | bei 0:00 | Hintergrund bleibt Beige, dazu eine kleine ruhige Karte unten rechts mit kurzer Einblendbewegung (~400ms, Onset nach Hillstrom/Yantis): „Zeit für eine Pause". Ein einzelner ruhiger Ton. Kein Modal, Arbeit bleibt möglich. |
| **2** | +2 Min ohne Reaktion | Hintergrund wandert weiter zu gedämpftem Bernstein. Karte wächst, rückt spürbar näher zur Bildschirmmitte, sanftes langsames Pulsieren. Immer noch am Rand. |
| **3** | +5 Min ohne Reaktion | Hintergrund wandert weiter zu gedämpftem Terrakotta. Ruhiges zentriertes Fenster mit drei Optionen: „Pause starten", „Noch 5 Minuten" oder „Überspringen". Kein Rot, keine Ausrufezeichen. |

**Hintergrundfarbe eskaliert seit 17.09. mit (Betreuung):** Bis dahin gab es nur einen einzigen Zielton ab Stufe 0, der über alle vier Stufen konstant blieb. Jetzt wandert er mit jeder erreichten Stufe eine Nuance weiter - Beige `#f6e7cd` (Stufe 0/1), gedämpftes Bernstein `#f0cd94` (Stufe 2), gedämpftes Terrakotta `#dd9b6c` (Stufe 3) - dasselbe Ampelschema wie die Auto-Analogie, aber gedämpft: „Auffallen statt erschrecken" bleibt das Prinzip, kein reines Rot.

> **Nachgeschärft am 17.09., nach dem Live-Test der Eskalation:** Die erste Fassung war mit `#fdf3e6`/`#f6ddb8`/`#efc9a8` und 60-Sekunden-Übergängen auf **allen** Stufen praktisch unsichtbar - Die Rückmeldung war „ich sehe NUR weiß". Nachgemessen am gerenderten Bildschirm: Stufe 1 landete nach 60 Sekunden bei `rgb(253,243,230)`, also 2/12/25 RGB-Punkte neben Weiß, und lag 10 Sekunden nach dem Stufenwechsel noch bei `rgb(255,253,251)`. Zwei Korrekturen: deutlich kräftigere Farbstufen (siehe oben) und der 60-Sekunden-Übergang gilt nur noch für **Stufe 0**, wo er laut Spezifikation absichtlich unmerklich sein soll. Ab Stufe 1 sind es 15 Sekunden - die Farbe ist dort ein Hinweis, der ankommen soll. Gemessen erreicht Stufe 1 jetzt `rgb(246,231,205)`, Stufe 2 `rgb(240,205,148)` und Stufe 3 `rgb(221,155,108)`, jeweils innerhalb von etwa 15 Sekunden. **Lehre daraus für künftige Gestaltungsänderungen:** Es reicht nicht zu prüfen, dass der richtige Zielwert gesetzt wird - es muss am gerenderten Bild geprüft werden, ob man die Änderung auch sieht.

**Jede erreichte Stufe wird protokolliert, ebenso die Stufe, bei der reagiert wurde.** Das ist eines deiner wertvollsten Ergebnisse: Bei welcher Stufe reagieren Menschen tatsächlich? Reicht Stufe 1? Braucht es Stufe 3? Das ist ein echter Befund, den du in der Diskussion auswerten kannst.

Optionen für Nutzende bei jeder Stufe: Pause starten, Noch 5 Minuten oder überspringen. Zwischen 09.08. und 25.08. gab es nur die ersten beiden Optionen (**kein** "5 Minuten verschieben"), ein blindes Verlängern der laufenden Arbeitsphase ohne anzugeben, um wie viel, war durch das direkt anschließende Kurzfeedback [7] ersetzt, das explizit nach Minuten fragt. Am 25.08. kam „Noch 5 Minuten" als dritte Option zurück, aber als eigenständiges Ereignis `BREAK_SNOOZED`: es ändert nicht die Rundenlänge (das bleibt weiterhin Aufgabe des Kurzfeedbacks), sondern verschiebt nur, wann der Hinweis erneut erscheint. Details siehe Abschnitt 4, „Ereignistypen für das Log". „Überspringen" umgeht dabei wirklich Aktivitätsauswahl [8] und Pause [9], nach dem Kurzfeedback geht es direkt in die nächste Arbeitsrunde, nicht nur mit anderem Ereignisnamen durch denselben Ablauf wie „Pause starten".

Solange nicht reagiert wurde, zeigt der Bildschirm zusätzlich zur Restzeit-Anzeige auch eine **Überzeit** an (`+MM:SS`, wie lange der Zielzeitpunkt schon überschritten ist), sonst verschwindet die Zeitanzeige nach Ablauf ersatzlos, was sich anfühlt, als würde nichts mehr passieren.

> **Technischer Hinweis:** Die Farbübergänge über CSS-Transitions mit langer Dauer (60 Sekunden) lösen, nicht per JavaScript-Animation. Ruhiger und billiger. Die Karte blendet beim ersten Erscheinen (Stufe 1) einmalig per CSS-Keyframe ein (~400ms), das Wachsen zu Stufe 2 läuft über eine weiche `transition` statt eines Sprungs. Ebenfalls per Web Audio API synthetisiert statt aus Audiodateien geladen, direkt an die vier Stufen gekoppelt statt nach eigenem Zeitplan: **ein Ton je erreichter Stufe**, Stufe 0 bleibt tonlos (der Übergang soll kaum bewusst wahrnehmbar bleiben, ein Ton dort wäre eine hörbare Vorwarnung), Stufe 1 ein ruhiger Sinuston (70%), Stufe 2 ein deutlicherer Glockenton (80%), Stufe 3 ein voller Akkord (90%), danach keine Wiederholung mehr, die Eskalation läuft über Deutlichkeit, nicht über Wiederholung. Die drei Töne und ihre Lautstärken stehen als `NUDGE_STAGE_SOUND` an einer einzigen Stelle (`src/lib/nudgeSound.ts`), festgelegt am 20.09. - davor war Stufe 3 ein aufsteigender Ton, der gemessen nur 0,8 dB über Stufe 2 lag und damit als Steigerung nicht wahrnehmbar war. Protokolliert als `NUDGE_SOUND_PLAYED` (Befund der Betreuung, 17.09.). Alle drei Töne mit weichem Einsatz (~50ms Anstieg, nichts beginnt schlagartig) und im mittleren Frequenzbereich (Grundtöne ca. 440–700 Hz) statt schrill hoch - Feinabstimmung ebenfalls Befund der Betreuung, 17.09., zum Anhören/Kalibrieren gibt es `/admin/sound-check`.

### [7] Kurzfeedback und Anpassung

> **Wichtig (Änderung 09.08.):** Dieser Schritt kommt jetzt direkt nach der Reaktion auf den Pausenhinweis, **noch vor** Aktivitätsauswahl und Pause. Die Frage bewertet die gerade beendete Arbeitsphase, das lässt sich direkt danach zuverlässiger beantworten als erst nach einer mehrminütigen Pause. Die neue Arbeitszeit wird erst beim „Sitzung starten"-Knopf nach der Pause tatsächlich angewendet.

Maximal 20 Sekunden Aufwand:

1. „War der Zeitpunkt der Pause passend?" → **zu früh (ich hätte gern länger gearbeitet) / passend / zu spät (ich hätte gern früher Pause gemacht)** (Klammerzusätze ergänzt 22.09.: „zu früh" allein ließ zwei Lesarten zu - „die Pause kam zu früh", also länger arbeiten, gegen „ich möchte früher Pause machen", also kürzer. Im Probelauf kam „zu früh" zweimal zusammen mit einer Verkürzung vor. Die drei Antworten stehen seitdem untereinander statt nebeneinander, nebeneinander wären sie in der schmalen Karte umgebrochen.)
2. Bei „zu früh" oder „zu spät": „Um wie viele Minuten?" → Zähler in 5-Minuten-Schritten,
   frei nach oben oder unten (Änderung 11.08.: statt vier fester Knöpfe −10/−5/+5/+10)
3. Optional, ein Feld: „Kurz in eigenen Worten?" (darf leer bleiben)

Neuer Wert wird angezeigt: „Nächste Runde: 30 Minuten".

**Das liefert dir deine besten quantitativen Daten:** Wie oft wird angepasst, in welche Richtung, konvergiert es? Wenn alle Teilnehmenden von 25 auf 35 gehen, hast du einen Befund.

**Selbst gestartete Pause (ergänzt 14.09., korrigiert 17.09.):** Auch bei einer selbst gestarteten Pause (Knopf „Pause jetzt starten" während der Arbeitsphase, `BREAK_SELF_INITIATED`) kommt direkt danach dasselbe Kurzfeedback wie sonst. Bis 17.09. entfiel es hier komplett, mit der Begründung, es gäbe keinen Systemhinweis, dessen Zeitpunkt man bewerten könnte - ich wollte die Frage trotzdem gestellt haben: eine freiwillig früh beendete Runde kann genauso auf „Zu früh" hindeuten wie eine, bei der man auf den Hinweis reagiert hat, und soll genauso die nächste Rundenlänge beeinflussen können. **Für die Auswertung:** Die Angaben zum Zeitpunkt werden getrennt nach Art der Reaktion betrachtet - „zu früh" nach einem Systemhinweis hat eine andere Bedeutung als „zu früh" nach einer eigenen Entscheidung. Eine selbst gestartete Pause ist zugleich ein Hinweis darauf, dass die aktuelle Rundenlänge nicht passt; die daraufhin gewählte Anpassung der nächsten Rundenlänge ist in diesem Fall besonders aussagekräftig. In `cycles.csv` steht dafür `reactionType`.

### [8] Aktivitätsauswahl

Drei bis vier kurze Vorschläge plus die Option „keine Aktivität":

- **Augenentlastung (gut 1 Min):** 20 Sekunden auf etwas in etwa 6 Metern Entfernung schauen, dreimal wiederholen
- **Nacken und Schultern (gut 1,5 Min):** angeleitete Dehnung, Schritt für Schritt
- **Aufstehen und bewegen (gut 1,5 Min):** kurzer Gang, Schultern kreisen
- **Keine Aktivität, einfach Pause**

Auswahl wird protokolliert. Die Option „keine" muss gleichwertig aussehen, nicht wie die schlechte Wahl, sonst verzerrst du deine Daten.

### [9] Pause

Ruhiger Bildschirm mit Restzeit. Falls eine Aktivität gewählt wurde: schrittweise Anleitung, ein Schritt pro Bildschirm, automatisch weiter.

**Eigene Schrittansicht während einer Aktivität** (ergänzt 14.09.): Solange ein Schritt läuft, ersetzt eine
eigene Ansicht die große Pausenuhr - vorher blieb die große Restzeit der Gesamtpause im Vordergrund und die
eigentliche Anleitung war nur ein kleiner Nebensatz darunter, obwohl gerade die Anleitung die Aufmerksamkeit
verdient. Jetzt: Beschriftung "{Aktivität} · Schritt X von Y", ein Ring, der den aktuellen Schritt sichtbar
abzählt, die Anleitung selbst größer, und die Gesamtpausenzeit nur noch als kleine Zeile darunter. Bei jedem
Schrittwechsel ein leiser Übergangston (`water-drop`, dieselbe Tonbibliothek wie beim Pausenhinweis). Nach
dem letzten Schritt erscheint wieder die normale, große Pausenuhr für die restliche Pausenzeit.

**Sprachausgabe für die Anleitung** (ergänzt 14.09.): Bei „Augenentlastung" schaut man bewusst vom Bildschirm weg - ein reiner Anleitungstext lässt sich in dem Moment nicht lesen, bei „Nacken und Schultern" abgeschwächt genauso. Jeder Schritt wird deshalb einmal per `speechSynthesis` (Web Speech API, keine externe Bibliothek/kein Dienst) vorgelesen: deutsche Stimme falls verfügbar, sonst Standardstimme, Sprechgeschwindigkeit leicht reduziert (`rate` 0.9). Schalter „Sprachausgabe: an/aus" direkt bei der Anleitung, Voreinstellung an, protokolliert als `SPEECH_TOGGLED` mit `{ enabled }`. Ist `speechSynthesis` nicht verfügbar, erscheint kein Fehler, nur der Text wie zuvor. Ausschließlich hier - nicht in der Arbeitsphase, nicht beim Pausenhinweis.

**Taktung der Schritte überarbeitet (17.09., zweimal aufgefallen):** Ursprünglich dauerten einzelne Schritte 30-90 Sekunden bei einem einzigen kurzen Satz am Anfang - bei „Aufstehen und bewegen" etwa ein Satz, dann rund 85 Sekunden reine Stille. Unbegleitet wirkt das nicht wie eine unterstützte Übung, sondern wie ein Hänger. Jetzt gilt für jeden Schritt in `activities.ts`: die Ansage nennt immer die eigene Dauer oder Wiederholzahl (man weiß also, wie lange die Stille dauert, statt zu raten), und kein Schritt lässt mehr als rund 15 Sekunden Stille nach dem letzten gesprochenen Wort - lieber mehr, kürzere Schritte als wenige, lange. Jede Aktivität endet außerdem mit einem kurzen, spürbar abschließenden Satz statt einfach mitten im Ablauf aufzuhören. Dadurch sind alle drei Aktivitäten insgesamt kürzer als ursprünglich grob geplant (siehe [8]) - bewusst, ein gut getaktetes 1,5-Minuten-Programm ist besser als ein schlecht getaktetes 5-Minuten-Programm. Die tatsächlichen Sprechzeiten wurden per echter `speechSynthesis`-Wiedergabe gemessen, nicht nur geschätzt.

**Anleitungstexte überarbeitet (20.09.):** Die Schlusssätze schickten an den Bildschirm bzw. an den Platz zurück („Kurz blinzeln, dann zurück zum Bildschirm", „Setz dich wieder hin") - obwohl nach einer rund 1,5-minütigen Aktivität noch mehrere Minuten Pause übrig sind. Eine Anwendung, die zu Bildschirmpausen anregen soll, beendete damit die Pause selbst, gute drei Minuten zu früh. Alle drei Schlusssätze übergeben jetzt an die restliche Pause statt sie abzuschließen. Zusätzlich sind die Ansagen sprachlich überarbeitet: die Dauer steht weiterhin in jedem Schritt (Regel von oben), aber an wechselnder Stelle im Satz statt immer im selben Muster, und jeder Schritt sagt, wie die Bewegung gemeint ist („nicht ziehen, nur das Gewicht wirken lassen") - der Unterschied zwischen einer Anweisung und einer Anleitung. Bei „Aufstehen und bewegen" sind die mittleren Schritte ersetzt: sie bestanden aus denselben Schulterkreisen wie „Nacken und Schultern", jetzt Strecken, Drehen aus der Hüfte und Zehenspitzen. Alle Sekundenwerte sind unverändert - geändert wurde, was gesagt wird, nicht wie lange es dauert. Randbedingung für den jeweils letzten Schritt: seine Sprachausgabe wird abgebrochen, sobald seine Sekunden ablaufen, die Schlusssätze müssen also deutlich kürzer als 9 Sekunden bleiben.

**Trinkhinweis** (ergänzt 20.09.): Zu Beginn der freien Pausenzeit erscheint einmal je Pause eine kleine Pille am oberen Bildschirmrand - ein Wassertropfen-Symbol und der Satz „Trink einen Schluck Wasser." Sie blendet nach 12 Sekunden von selbst wieder aus (Wortlaut und Dauer in `src/content/break-hint.ts`). Bewusst **nicht** beim Pausenstart, sondern erst wenn die freie Zeit läuft: bei „keine Aktivität" ist das sofort, sonst nach dem letzten Aktivitätsschritt. Grund: die Aktivitäten schicken die Teilnehmenden gerade vom Bildschirm weg (in die Ferne schauen, aufstehen und umhergehen) - ein rein sichtbarer Hinweis in den ersten Sekunden wäre also ausgerechnet dort unsichtbar. Nicht gesprochen, weil währenddessen die Anleitung vorgelesen wird. Fest positioniert, damit er beim Verschwinden kein Layout verschiebt, und auf allen vier Pausenbildschirmen (drei Aktivitäten plus „keine Aktivität") an derselben Stelle. Er ist Pausengestaltung, kein Teil der gemessenen Intervention, und wird deshalb nicht protokolliert.

**Die Pausenzeit hat Vorrang vor der Aktivität** (Änderung 26.08.): dauert die gewählte Aktivität länger als die Pause (z. B. beim Testen mit kurzen Pausenzeiten, oder wenn das Kurzfeedback die Pause selbst nicht betrifft, aber die Aktivität-Presets fix sind), blockiert das nicht den Weiterknopf, die Aktivitätsanzeige wird einfach ausgeblendet, sobald die Pausenzeit abgelaufen ist, die Aktivität endet quasi mit der Pause. Vorher musste die Aktivität immer erst zu Ende laufen, auch wenn die Pause selbst schon lange vorbei war.

Bei 9, 8, 7 … 1 je ein Klopf-Ton, bei 0 ein klares akustisches Signal, sonst endet die Pause komplett unbemerkt, wenn man nicht gerade auf den Bildschirm schaut (Änderung 09.08.). Der Countdown prüft zusätzlich bei jedem `visibilitychange` sofort nach (Änderung 26.08.), statt nur auf den nächsten 200ms-Tick zu warten, sonst kann ein gedrosselter Hintergrund-Tab das enge Ein-Sekunden-Fenster einzelner Klopftöne verpassen, während das robustere Endsignal trotzdem ankommt. Die Klopftöne waren anfangs deutlich leiser als das Endsignal, dadurch kaum wahrnehmbar (zweimal, 26.08. und 17.09., kam nur das Endsignal an) - seit 17.09. auf derselben Lautstärke wie das Endsignal.

Am Ende: Knopf „Sitzung starten", **nicht automatisch zurückspringen**, das wäre selbst eine Störung. Die im Kurzfeedback [7] entschiedene Arbeitszeit wird jetzt angewendet, die nächste Runde beginnt.

### [10] Nachbefragung

**Finale Fassung vom 24.08., mit Holly abgestimmt** (ersetzt die vorherige N1-N10-Version vollständig). Vier Blöcke: Zustand nach der Sitzung, wahrgenommene Überzeugungskraft (etablierte Skala), wahrgenommene Aufdringlichkeit (etablierte Skala), Vergleich plus Freitext.

**Auf drei Seiten aufgeteilt (Änderung 14.09.):** Reduziert die kognitive Last, ohne den Wortlaut oder die Reihenfolge der validierten Skalen anzutasten. Dezenter Fortschritt oben ("Schritt X von 3"), keine zusätzlichen wertenden Zwischenüberschriften (kein Priming).

- **Seite 1** ("Sitzung beendet! Wie geht es dir jetzt?"): N1, N2, N16 (Vergleich), direkt darunter N17 ("Warum?"). Knopf „Weiter".
- **Seite 2** ("Bewertung des Systems"): einmal die Instruktion „Wie sehr stimmst du den folgenden Aussagen zu?" mit vollständiger Legende, N3-N11, eine schlichte graue Trennlinie ohne Text, N12-N15. Knöpfe „Zurück" / „Weiter".
- **Seite 3** ("Noch ein kurzes Feedback zum Schluss (Optional)"): N19, N18, N20 als drei einzelne Freitextfelder, in dieser Reihenfolge. Knöpfe „Zurück" / „Befragung abschließen".

Antworten bleiben beim Vor-/Zurückblättern erhalten (Client-Zustand), gespeichert wird weiterhin erst am Ende als eine `SurveyResponse`. Zusätzlich pro Seite `page_load_timestamp`/`page_submit_timestamp` (`answers.pageTimings`), für die Auswertung als `postPage1Seconds`/`postPage2Seconds`/`postPage3Seconds` in `participants.csv` - damit lassen sich Blindklicker (auffällig kurze Lesezeit) erkennen.

| # | Frage | Format |
|---|---|---|
| N1 | Wie konzentriert warst du in dieser Sitzung? | Skala 1–7 (gar nicht … sehr) |
| N2 | Wie erschöpft fühlst du dich jetzt? | Skala 1–7 (gar nicht … sehr) |
| N3 | Durch die Nutzung dieses Assistenzsystem werde ich meine Einstellung verändern. | Skala 1–7 Zustimmung* |
| N4 | Ich glaube, dass Erinnerungen von diesem Assistenzsystems richtig sind. | Skala 1–7 Zustimmung* |
| N5 | Dieses Assistenzsystem hat das Potential andere Nutzer*innen zu beeinflussen. | Skala 1–7 Zustimmung* |
| N6 | Dieses Assistenzsystem bewirkt, dass ich einige Veränderungen an meinem Verhalten vornehme. | Skala 1–7 Zustimmung* |
| N7 | Dieses Assistenzsystem hat das Potential das Verhalten anderer Nutzer*innen zu verändern. | Skala 1–7 Zustimmung* |
| N8 | Dieses Assistenzsystem wird Veränderungen in meinem Verhalten herbei führen. | Skala 1–7 Zustimmung* |
| N9 | Dieses Assistenzsystem hat das Potential andere Nutzer*innen zu inspirieren. | Skala 1–7 Zustimmung* |
| N10 | Erinnerungen von diesem Assistenzsystem sind akkurat. | Skala 1–7 Zustimmung* |
| N11 | Dieses Assistenzsystem ist vertrauenswürdig. | Skala 1–7 Zustimmung* |
| N12 | Die Qualität meiner Arbeit hat sich in Anwesenheit des Assistenzsystems verschlechtert. | Skala 1–7 Zustimmung* |
| N13 | Das Assistenzsystem stört meinen Arbeitsfluss. | Skala 1–7 Zustimmung* |
| N14 | Ich fühle mich genervt von dem Assistenzsystem. | Skala 1–7 Zustimmung* |
| N15 | Das Assistenzsystem lenkt mich ab. | Skala 1–7 Zustimmung* |
| N16 | Im Vergleich zu deiner gewohnten Arbeitsweise war diese Sitzung … | besser / gleich / schlechter |
| N17 | Warum? | Freitext, optional |
| N18 | Was hat dich am meisten gestört? | Freitext, optional |
| N19 | Was hat am besten funktioniert? | Freitext, optional |
| N20 | Wie hat dir die Bedienoberfläche gefallen? Was würdest du daran ändern? | Freitext, optional |

\* Zustimmungsskala 1–7: 1 = Stimme überhaupt nicht zu · 2 = Stimme nicht zu · 3 = Stimme eher nicht zu · 4 = Neutral · 5 = Stimme eher zu · 6 = Stimme zu · 7 = Stimme voll und ganz zu

N3-N11 sind die Skala "wahrgenommene Überzeugungskraft" (Persuasiveness), N12-N15 die Skala "wahrgenommene Aufdringlichkeit" (Intrusiveness) - beide wortgleich übernommen, inklusive Tippfehler in N4 ("diesem Assistenzsystems" statt "diesem Assistenzsystem").

**Quellen der beiden Skalen (ergänzt 23.09.):** N3-N11 stammen aus der Perceived Persuasiveness Scale von Thomas, Masthoff und Oren (2019), erschienen in *Frontiers in Artificial Intelligence* unter dem Titel "Can I Influence You? Development of a Scale to Measure Perceived Persuasiveness and Two Studies Showing the Use of the Scale". Die Skala besteht aus drei Unterskalen mit je drei Aussagen: Effectiveness, Quality und Capability. Verwendet wird die deutsche Übersetzung aus Jung-Krenzer et al. (2024), in der der Bezugsgegenstand von "message" auf "Assistenzsystem" angepasst wurde. N12-N15 wurden von Jung-Krenzer et al. (2024) selbst entwickelt, da kein etabliertes Instrument vorlag. Beide Angaben stehen auch im Codebuch. N1/N2 vergleichst du gegen die Sitzungsstart-Werte focusAtStart/restedAtStart [4], nicht mehr gegen die alten V4/V5 der Vorbefragung. N20 kam am 12.09. dazu (Prioritaet 2 aus der Betreuungsbesprechung), steht seit der Drei-Seiten-Aufteilung vom 14.09. auf Seite 3 zusammen mit N18/N19. Pflichtfelder: N1-N16. N17-N20 dürfen leer bleiben.

### [11] Abschluss

Dank, Hinweis auf deine Kontaktadresse für Rückfragen und Löschwünsche, fertig. Keine Auswertung für die Nutzenden anzeigen, das würde nachträglich ihre Antworten beeinflussen.

**Konfetti zum Abschluss (ergänzt 19.09.):** Beim Öffnen der Seite fünf Explosionen, eine pro Sekunde, in den
Farben der vier Hinweisstufen plus Blau der Arbeitsphase und Grün der Pause (`canvas-confetti`,
`src/app/study/complete/celebration.tsx`). Eine bewusste Ausnahme vom Leitprinzip, dass nur gebaut wird, was
zur Intervention gehört oder etwas misst. Vertretbar, weil diese Seite erst nach dem Absenden der
Nachbefragung kommt: alle Antworten sind dann gespeichert und die Sitzung ist finalisiert, die Feier kann
keine Messung mehr beeinflussen. Immer fünfmal dieselbe Explosion, auch bei eingestellter reduzierter Bewegung.

**„Danke" in fünf Sprachen rund um die Karte (ergänzt 19.09.):** Mit jeder der fünf Explosionen fliegt ein
Wort ein: Danke!, Thank you!, شكراً!, Merci !, ¡Gracias!. Es federt kurz nach und schwebt danach ruhig
weiter, jedes Wort in seinem eigenen Takt. Dazu steigt die Karte beim Öffnen weich auf und ihre Zeilen
erscheinen nacheinander. Bis 1024 px Breite liegen die Wörter nur über und unter der Karte, darüber
verteilen sie sich frei um sie herum. Das Arabische in Cairo, weil die App-Schrift Geist keine arabischen
Zeichen hat. Reine CSS-Animation, kein JavaScript. Für Screenreader ausgeblendet, der eigentliche Dank steht
in der Karte.

---

## 3. Login ohne Registrierung

Bei sieben Accounts brauchst du kein Auth-Framework.

**Vorgehen:**

1. Ein Seed-Skript legt die Accounts an. Passwörter mit `bcrypt` gehasht, niemals im Klartext.
2. Login-Route prüft Code und Passwort, setzt bei Erfolg ein **httpOnly-Cookie** mit einem signierten Token (`jose` oder `iron-session`).
3. Eine Middleware schützt alle Studienrouten.

```
POST /api/auth/login   { code, password }  →  Cookie setzen
POST /api/auth/logout
```

**Wichtig:** `httpOnly` und `secure` setzen, damit das Cookie nicht per JavaScript auslesbar ist. Passwörter darfst du einfach halten (die Teilnehmenden bekommen sie von dir), aber gehasht speichern ist Pflicht.

---

## 4. Datenmodell

Das Herzstück. Zwei Prinzipien: **strukturierte Tabellen** für Befragungen, **ein Ereignis-Log** für alles, was während der Sitzung passiert.

```prisma
model Participant {
  id           String    @id @default(cuid())
  code         String    @unique          // "P01", "PILOT", "ADMIN"
  passwordHash String
  role         Role      @default(PARTICIPANT)
  createdAt    DateTime  @default(now())
  sessions     Session[]
}

enum Role { PARTICIPANT ADMIN }

model Session {
  id             String    @id @default(cuid())
  participant    Participant @relation(fields: [participantId], references: [id])
  participantId  String
  consentAt      DateTime?                // null = keine Einwilligung, keine Daten
  taskDescription String?                 // "Was arbeitest du?"
  startedAt      DateTime?
  endedAt        DateTime?
  initialWorkMin Int       @default(25)
  initialBreakMin Int      @default(5)
  createdAt      DateTime  @default(now())

  events    Event[]
  surveys   SurveyResponse[]
  cycles    CycleFeedback[]
}

model Event {
  id        String   @id @default(cuid())
  session   Session  @relation(fields: [sessionId], references: [id])
  sessionId String
  at        DateTime @default(now())
  clientAt  DateTime                      // Zeit im Browser, siehe Abschnitt 6.3
  type      String                        // siehe Ereignisliste
  cycle     Int?                          // Rundennummer, falls zutreffend
  payload   Json?                         // alles Weitere

  @@index([sessionId, at])
}

model SurveyResponse {
  id          String   @id @default(cuid())
  session     Session  @relation(fields: [sessionId], references: [id])
  sessionId   String
  phase       Phase                       // PRE | POST
  answers     Json                        // { "V1": "60-120", "V4": 5, ... }
  submittedAt DateTime @default(now())
}

enum Phase { PRE POST }

model CycleFeedback {
  id            String   @id @default(cuid())
  session       Session  @relation(fields: [sessionId], references: [id])
  sessionId     String
  cycle         Int
  timing        Timing                    // TOO_EARLY | OK | TOO_LATE
  adjustmentMin Int      @default(0)      // -10, -5, 0, +5, +10
  newWorkMin    Int                       // Wert für die nächste Runde
  activity      String?                   // "eyes" | "neck" | "move" | null
  comment       String?
  submittedAt   DateTime @default(now())
}

enum Timing { TOO_EARLY OK TOO_LATE }
```

### Ereignistypen für das Log

```
SESSION_CREATED        CONSENT_GIVEN         SURVEY_PRE_SUBMITTED
SESSION_STARTED        CYCLE_STARTED         WORK_STARTED
NUDGE_STAGE_0          NUDGE_STAGE_1         NUDGE_STAGE_2         NUDGE_STAGE_3
NUDGE_SOUND_PLAYED
BREAK_ACCEPTED         BREAK_SKIPPED         BREAK_SNOOZED         BREAK_SELF_INITIATED
ACTIVITY_SELECTED      ACTIVITY_SKIPPED      ACTIVITY_STEP_DONE
ACTIVITY_TICK          SPEECH_TOGGLED
BREAK_STARTED          BREAK_ENDED
INTERVAL_ADJUSTED      CYCLE_FEEDBACK_SUBMITTED
TAB_HIDDEN             TAB_VISIBLE
SESSION_ENDED          SESSION_REOPENED      SESSION_FINALIZED
SURVEY_POST_SUBMITTED
```

**`TAB_HIDDEN` und `TAB_VISIBLE`** über die Page Visibility API. Das ist ein kleiner, aber wertvoller Trick: Es zeigt dir, ob während der Arbeitsphase der Tab im Vordergrund war. Damit kannst du in der Diskussion die Limitation „ortsunabhängige Durchführung, keine Kontrolle" wenigstens teilweise entkräften, weil du zumindest ein objektives Signal hast.

**`BREAK_ACCEPTED`/`BREAK_SKIPPED` speichern im payload die Stufe**, bei der reagiert wurde: `{ "stage": 2, "secondsAfterEnd": 143 }`. Das ist die Zahl, die deine Arbeit interessant macht. `SESSION_REOPENED`/`SESSION_FINALIZED` gehören zum Unfall-Schutz: eine versehentlich beendete Sitzung lässt sich fortsetzen. `SESSION_FINALIZED` wird seit 12.09.2026 **ausschließlich automatisch** beim Absenden der Nachbefragung gesetzt (siehe `post-survey-form.tsx`) - der manuelle "Final abgeben"-Knopf auf der Hub-Seite ist entfernt, weil er eine Sitzung endgültig sperren konnte, ohne dass die Nachbefragung je beantwortet wurde (echter Datenverlust, siehe ENTSCHEIDUNGEN.md).

**`BREAK_SNOOZED`** (Änderung 25.08., wieder eingeführt - zwischen 09.08. und 25.08. gab es das nicht): dritte Option neben "Pause starten"/"Überspringen", verschiebt **nur die Eskalation** um feste 5 Minuten, danach beginnt sie wieder bei Stufe 1. Wichtig, warum das kein Rückfall in die am 09.08. verworfene Variante ist: die alte Funktion hat blind die **Rundenlänge** verändert (wie viele Minuten die nächste Runde dauert) ohne Minutenangabe - das war das Problem. `BREAK_SNOOZED` ändert die Rundenlänge gar nicht, sondern nur, wann der Hinweis erneut erscheint, als eigener Ereignistyp getrennt von `BREAK_ACCEPTED`/`BREAK_SKIPPED` - die Kernkennzahl (bei welcher Stufe wird *wirklich* reagiert) bleibt unberührt. Payload wie bei den anderen beiden: `{ "stage": 2, "secondsAfterEnd": 225 }`. Anzahl der Snoozes pro Runde steht im Export als `snoozeCount` in `cycles.csv`. Fest auf 5 Minuten, nicht wählbar (Konsistenz über alle Teilnehmenden, kein zusätzlicher Regler mitten im bewusst schlichten Hinweis) und ohne Obergrenze fürs wiederholte Snoozen (Nutzerautonomie, De Russis & Monge Roffarello 2017 - gehört so in Kapitel 4 der Arbeit).

**`BREAK_SELF_INITIATED`** (ergänzt 14.09., Kurzfeedback danach seit 17.09.): eigene, unauffällige Schaltfläche "Pause jetzt starten" während der Arbeitsphase, unabhängig vom Pausenhinweis - die Runde endet sofort, ohne dass je ein `NUDGE_STAGE_*` erreicht wurde. Payload: `{ "cycleNumber": 2, "secondsIntoWork": 340 }`, `secondsIntoWork` ist die verstrichene Zeit seit `WORK_STARTED` dieser Runde. Danach kommt, wie bei jeder anderen Runde auch, das Kurzfeedback [7] - erst dann weiter zur Aktivitätsauswahl [8]. In `cycles.csv` sichtbar über `reactionType: "SELF_INITIATED"` (neuer Wert, bestehende Werte unverändert) und die eigene Spalte `reactionSecondsIntoWork`.

**`NUDGE_STAGE_0` bis `_3` speichern im payload `tabVisibleAtNudge`** (Änderung 25.08.): war der Tab in genau dem Moment sichtbar, in dem diese Stufe ausgelöst wurde? Zusammen mit `TAB_VISIBLE` ergibt das die **Reaktionslatenz** - ein objektives Maß dafür, ob ein zurückhaltender Hinweis überhaupt wahrgenommen wird, unabhängig von der Selbstauskunft in der Nachbefragung. Im Export (`cycles.csv`) dafür vier Spalten: `nudgeStage1At` (Zeitstempel von Stufe 1), `tabVisibleAtNudge` (war der Tab in diesem Moment sichtbar?), `firstTabVisibleAfterNudge` (das nächste `TAB_VISIBLE` danach) und `latencyToTabReturnSeconds` (Differenz der beiden in Sekunden - leer, wenn der Tab durchgehend sichtbar war und es also nichts zum Zurückkommen gab).

**Berechnung korrigiert (20.09., beim Probelauf aufgefallen):** Der Code setzte die oben beschriebene Bedingung nie um. Er nahm schlicht das erste `TAB_VISIBLE` nach dem Hinweis, ohne zu prüfen, ob der Tab überhaupt unsichtbar war, und ohne Obergrenze für die Suche. Weil auch die Pause zur selben Runde gehört, konnte ein Tabwechsel mitten in der Pause als „Reaktionslatenz" erscheinen: im Probelauf in Runde 4 ein Wert von 2697 Sekunden, obwohl der Tab beim Hinweis sichtbar war und nach 42 Sekunden reagiert wurde. Jetzt gelten zwei Bedingungen: `tabVisibleAtNudge` muss `false` sein, und das Suchfenster endet bei `reactionAt`. Ohne Reaktion bleibt das Feld leer, weil das Fenster dann keine Obergrenze hätte. Die neue Spalte `tabVisibleAtNudge` macht lesbar, warum ein Feld leer ist - sonst sieht ein begründet fehlender Wert wie ein verlorener aus.

**`ACTIVITY_TICK`** (Änderung 25.08.): zählt Maus- und Tastaturaktivität *innerhalb des Tabs*, aggregiert pro Minute, keine Inhalte - `{ "mouseMoves": 3, "clicks": 1, "keyPresses": 2, "tabVisible": true }`. Ist der Tab am Ende einer Minute nicht sichtbar, wird gar kein Tick geschickt. **Wichtige Einschränkung, die so in Kapitel 5 und in die Limitationen gehört:** der Browser erfasst ausschließlich Eingaben im eigenen Fenster. Arbeiten Teilnehmende (wie vorgesehen) in einer anderen Anwendung, sieht die App dort nichts - `keydown` feuert nur bei Tastaturfokus im Tab, `mousemove` nur wenn der Cursor über dem Fenster ist. Diese Werte messen also die Interaktion mit der Anwendung, nicht die tatsächliche Arbeitsaktivität. Während der eigentlichen Arbeitsphase (Regel 7: bewusst fast leerer Bildschirm) werden die meisten Ticks deshalb nahe 0 sein - das ist erwartbar, kein Fehler. Grundlage, falls die App später auf eine Desktop-Umsetzung erweitert wird.

---

## 5. API-Routen

Alle unter `/api`, alle prüfen das Session-Cookie.

```
POST  /api/auth/login
POST  /api/auth/logout

POST  /api/session                  neue Sitzung anlegen
POST  /api/session/consent          Einwilligung protokollieren
PATCH /api/session/:id/start        Tätigkeit + Startzeit
PATCH /api/session/:id/end          Sitzung beenden

POST  /api/survey                   { phase, answers }
POST  /api/cycle-feedback           { cycle, timing, adjustmentMin, activity, comment }
POST  /api/events                   Ereignisse, im Batch (siehe unten)

GET   /api/admin/export?file=participants|cycles|events   nur für ADMIN
```

Kein eigener `/api/admin/sessions`-Endpunkt (Änderung 23.08.): die Übersicht auf `/admin`
holt die Sessions direkt per Prisma in der Server Component, wie die anderen Seiten der App
auch. Ein separater API-Endpunkt dafür würde nirgends gebraucht.

**Ereignisse im Batch senden.** Nicht bei jedem Ereignis sofort ein Request. Sammle sie in einer Queue im Client und schicke sie alle 10 Sekunden sowie bei jedem Phasenwechsel. Bei Netzproblemen bleiben sie in der Queue. Beim Verlassen der Seite `navigator.sendBeacon` benutzen, damit nichts verloren geht.

---

## 6. Die drei Fallen, die dir die Studie ruinieren können

### 6.1 Datenverlust am Studientag

Wenn bei Teilnehmerin 4 die Verbindung abbricht und ihre Daten weg sind, kannst du sie nicht ersetzen.

**Absicherung:** Die Ereignis-Queue zusätzlich in `localStorage` spiegeln. Beim Laden der Seite prüfen, ob unversendete Ereignisse liegen, und nachsenden. Kostet dich eine Stunde und rettet im Zweifel deine ganze Studie.

### 6.2 Kein Backup

**Vor jedem Studientag** einen Dump der Datenbank ziehen und woanders ablegen:

```bash
docker exec -t postgres pg_dump -U focus focusdb > backup_$(date +%F_%H%M).sql
```

Nach jedem Teilnehmer wiederholen. Zwei Minuten Aufwand.

### 6.3 Timer, die im Hintergrund einschlafen

Browser drosseln `setInterval` in inaktiven Tabs massiv. Wenn du die Zeit durch Hochzählen misst, läuft dein 25-Minuten-Timer real 40 Minuten, sobald jemand den Tab wechselt. **Das würde deine gesamte Zeitmessung wertlos machen.**

**Lösung:** Speichere immer den **Zielzeitpunkt**, nicht die Restzeit.

```ts
const endsAt = Date.now() + workMin * 60_000;
// Im Render-Intervall nur noch:
const remaining = Math.max(0, endsAt - Date.now());
```

So ist die Anzeige nach einem Tab-Wechsel sofort wieder korrekt.

---

## 7. Datenexport für die Auswertung

Baue eine Admin-Seite mit einem Knopf, der drei CSV-Dateien erzeugt:

| Datei | Eine Zeile je | Wofür in der Arbeit |
|---|---|---|
| `participants.csv` | Teilnehmende, Vor- und Nachwerte nebeneinander | Vergleich V4/V5 gegen N1/N2 |
| `cycles.csv` | Runde | Anpassungsverhalten, gewählte Aktivitäten |
| `events.csv` | Ereignis | Reaktionsstufen, Zeiten, Tab-Wechsel |

**Codebuch (ergänzt 22.09.):** `docs/CODEBUCH.md` erklärt jede Spalte aller drei Dateien - Fragetext, Seite/Block, Format, Wertebereich, Bedingung und die Bedeutung einer leeren Zelle. Die Datei wird **erzeugt, nicht von Hand geschrieben** (`npm run codebuch`, Generator in `scripts/codebuch-erzeugen.ts`): Fragetexte und Bedingungen kommen aus `src/content/`, die Spaltenreihenfolge aus `src/lib/exportColumns.ts` - derselben Quelle, aus der auch der Export gebaut wird. Damit kann das Codebuch nicht von der Anwendung abweichen. Der Generator bricht ab, wenn eine Exportspalte ohne Beschreibung auftaucht. Nach jeder Änderung an Fragetexten oder Spalten neu erzeugen.

**Leere Zellen haben drei verschiedene Bedeutungen** und werden im Codebuch je Spalte einzeln benannt: *nicht gezeigt* (Bedingung nicht erfüllt, die Frage gab es für diese Person nicht), *nicht beantwortet* (Frage war sichtbar und freiwillig) und *nicht anwendbar* (Kennzahl für diese Zeile nicht definiert, etwa die Reaktionslatenz bei sichtbarem Tab).

**Spaltenreihenfolge (festgelegt 20.09.):** Die Fragebogenspalten stehen im Export immer aufsteigend nach Kennung - `A1`-`A6`, `B1`-`B4`, `C1`, `D1`, `N1`-`N20` -, unabhängig von der Reihenfolge im Fragebogen selbst. Anlass: die Nachbefragung stellt „Was hat am besten funktioniert?" (`N19`) bewusst vor „Was hat dich am meisten gestört?" (`N18`), und der Export übernahm diese Reihenfolge, endete also mit `N17;N19;N18;N20`. Wer Spalten nach Position statt nach Überschrift zuordnet, vertauscht genau diese beiden Freitextfragen. Anschlussfragen von Ja/Nein-Items stehen unmittelbar hinter ihrer Ausgangsfrage (`B2`, `B2_followUp`). Die Reihenfolge im Fragebogen selbst bleibt unverändert, sie ist eine bewusste Gestaltungsentscheidung.

**Tatsächliche Pausendauer (ergänzt 20.09.):** Die Pause endet nicht, wenn der Pausen-Timer abläuft, sondern erst, wenn die teilnehmende Person „Sitzung starten" drückt - im Probelauf wurden aus geplanten 5 Minuten einmal 23 und einmal 44 Minuten. Diese Werte lagen bisher nur als Rohereignisse in `events.csv`. `cycles.csv` hat dafür jetzt `breakStartedAt`, `breakEndedAt`, `breakPlannedMin` und `breakActualMin`. Bei übersprungener Pause bleiben alle vier leer, ebenso wenn die Sitzung während einer laufenden Pause endet - dann fehlt `BREAK_ENDED`.

**Untergrenze der Rundenlänge und `effectiveAdjustmentMin` (ergänzt 20.09.):** Die Rundenlänge kann im Kurzfeedback in 5-Minuten-Schritten frei verändert werden, aber nicht unter **5 Minuten** fallen (`MIN_WORK_MIN` in `/api/cycle-feedback`, gleiche Grenze im Formular). Wer bei 5 Minuten noch einmal „5 Minuten weniger" wählt, erzeugt `adjustmentMin = -5`, während die Rundenlänge bei 5 bleibt - im Probelauf in Runde 2 genau so passiert. `adjustmentMin` ist deshalb der **gewünschte** Wert, die neue Spalte `effectiveAdjustmentMin` (`newWorkMin` minus der Rundenlänge dieser Runde) der **wirksame**. Für die Auswertung sind beide interessant, aber sie dürfen nicht verwechselt werden.

**Unvollständige Runden (`cycleCompleted`, ergänzt 22.09.):** Die letzte Runde einer Sitzung ist fast immer unvollständig - im Probelauf wurde in Runde 5 die Pause angenommen und zwei Sekunden später die Sitzung beendet, in `cycles.csv` stand trotzdem `BREAK_ACCEPTED`, ohne Hinweis darauf, dass die Runde nie zu Ende lief. Die Spalte `cycleCompleted` steht auf `true`, sobald die **nächste** Runde begonnen hat (`CYCLE_STARTED`). Der erste Entwurf fragte stattdessen nach `BREAK_ENDED` - das hätte jede übersprungene Pause als unvollständig markiert, obwohl die Runde regulär zu Ende lief, und beim vorgesehenen Filter auf `cycleCompleted = true` ausgerechnet alle übersprungenen Pausen aus der Auswertung geworfen, also die Pausenannahmequote zu hoch ausfallen lassen. „Die nächste Runde läuft" erfasst beide Wege - Pause genommen wie Pause übersprungen - und ist genau für die abgebrochene letzte Runde `false`. Wo abgebrochen wurde, sagt `SESSION_ENDED`.

**`SESSION_ENDED` mit Rundennummer und Phase (ergänzt 22.09.):** Das Ereignis trägt jetzt die Rundennummer in der Spalte `cycle` und im Payload die Phase, in der beendet wurde: `{ "phase": "work" | "nudge" | "feedback" | "activity" | "break" }`. Damit ist erkennbar, wo eine Sitzung abbricht - eine Runde, die mitten in der Arbeitsphase endet, ist etwas anderes als eine, die nach der Pause endet. `nudge` zählt erst ab Stufe 1, also ab dem sichtbaren Hinweis; Stufe 0 ist der kaum wahrnehmbare Farbübergang vor dem Rundenende, dort läuft die Runde noch normal und zählt als `work`. Das Ereignis entsteht serverseitig, Rundennummer und Phase werden deshalb vom Browser mitgeschickt; fehlen sie oder sind sie unbrauchbar, wird die Sitzung trotzdem beendet - das Beenden darf an einer Zusatzangabe nicht scheitern.

**Widersprüchliche Kurzfeedback-Angaben sind möglich:** Die Richtung der Minutenanpassung ist nicht an die Antwort auf „War der Zeitpunkt der Pause passend?" gekoppelt. „Zu früh" lässt sich mit einer Verkürzung kombinieren und „Zu spät" mit einer Verlängerung. Im Probelauf kam „Zu früh" zweimal zusammen mit einer Verkürzung vor. Das kann Testverhalten sein, aber auch ein Hinweis darauf, dass die Frage zwei Lesarten zulässt („die Pause kam zu früh" gegen „ich möchte früher Pause machen"). Die Auswertung muss `timing` und das Vorzeichen von `effectiveAdjustmentMin` getrennt betrachten und darf nicht annehmen, dass sie zusammenpassen. Die Anzeige „Nächste Runde: X Minuten" im Formular zeigt die Folge der Eingabe unmittelbar an, sie bleibt die einzige Rückmeldung. **Teilweise behoben am 22.09.:** Die Antworten heißen jetzt „zu früh (ich hätte gern länger gearbeitet)" und „zu spät (ich hätte gern früher Pause gemacht)", die gemeinte Richtung ist damit eindeutig benannt. Die Oberfläche lässt die widersprüchliche Kombination weiterhin zu - bewusst, weil eine erzwungene Kopplung ein Missverständnis unsichtbar machen würde, statt es zu zeigen.

Damit kannst du direkt in Excel oder Python auswerten und brauchst am Ende keine Datenbankabfragen mehr zu schreiben.

**Baue den Export früh**, nicht erst nach der Studie. Wenn du beim Probelauf merkst, dass ein Feld fehlt, kannst du es noch ergänzen. Danach nicht mehr.

---

## 8. Bauplan in 10 Tagen

| Tag | Aufgabe |
|---|---|
| 1 | Next.js aufsetzen, Prisma, Postgres lokal per Docker, Schema anlegen, Seed-Skript für die Accounts |
| 2 | Login, Cookie, Middleware, geschützte Routen |
| 3 | Einwilligungsbildschirm, Vorbefragung, Speichern |
| 4 | Timer-Logik (mit Zielzeitpunkt!), Arbeitsphase, Rundensteuerung |
| 5 | **Abgestufter Hinweis, alle vier Stufen** (der wichtigste Tag, plane ihn großzügig) |
| 6 | Aktivitätsauswahl, Pausenbildschirm, Anleitungen |
| 7 | Kurzfeedback, Intervallanpassung, Nachbefragung |
| 8 | Ereignis-Log vollständig, Queue, localStorage-Absicherung, sendBeacon |
| 9 | Admin-Seite, CSV-Export, Deployment auf deinen Server, HTTPS |
| 10 | **Probelauf mit der siebten Person**, Fehler beheben, Backup-Routine testen |

Wenn du in Verzug gerätst, streiche in dieser Reihenfolge: Anleitungen für Aktivitäten (durch reinen Text ersetzen), Admin-Oberfläche (direkt per SQL exportieren), Ton bei Stufe 1.

**Niemals streichen:** Einwilligung, Ereignis-Log, Datenexport, Probelauf.

---

## 9. Zwei Dinge, die du nicht vergessen darfst

**KI-Deklaration.** Du baust das mit Claude Code. Die KI-Leitlinie des HPI nennt Code-Generierung ausdrücklich als Fall, der zu deklarieren ist. Führe ab dem ersten Tag dein Logbuch: Datum, wofür, welches Werkzeug. Und sprich mit Holly ab, welche Option der Eigenständigkeitserklärung sie dafür erwartet.

**Erst abstimmen, dann bauen.** Diese Spezifikation ist mein Vorschlag auf Basis unserer Gespräche. Bevor du Tag 1 beginnst, sollte Holly den Studienaufbau gesehen haben, besonders die Frage nach Datenschutz und Ethik. Wenn sie ein anderes Vorgehen will, änderst du zwei Absätze statt zehn Tage Arbeit.
