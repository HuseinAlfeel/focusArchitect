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
   │  [7] Aktivitätsauswahl            │
   │        ↓                          │
   │  [8] Pause (5 Min)                │
   │        ↓                          │
   │  [9] Kurzfeedback + Anpassung     │
   └──────────────┬───────────────────┘
                  │  ca. 4 Runden / 120 Min
                  ↓
[10] Nachbefragung
      ↓
[11] Abschluss + Dank
```

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

Erhebt die Baseline, also deinen Vergleichsmaßstab. Vorschlag für die Items (endgültige Fassung mit Holly abstimmen):

| # | Frage | Format |
|---|---|---|
| V1 | Wie lange arbeitest du üblicherweise am Stück am Bildschirm, ohne Pause? | Auswahl: <30min / 30–60 / 60–120 / >120 |
| V2 | Wie oft machst du bei solcher Arbeit bewusst Pausen? | Skala 1–7 (nie … sehr oft) |
| V3 | Nutzt du bereits Hilfsmittel für Pausen (z. B. Timer, Pomodoro-App)? | Ja/Nein + Freitext |
| V4 | Wie konzentriert fühlst du dich typischerweise am Ende eines Arbeitsblocks? | Skala 1–7 |
| V5 | Wie erschöpft fühlst du dich typischerweise am Ende eines Arbeitsblocks? | Skala 1–7 |
| V6 | Wie zufrieden bist du mit deiner bisherigen Pausenroutine? | Skala 1–7 |
| V7 | Wie ausgeruht fühlst du dich **jetzt gerade**, vor dieser Sitzung? | Skala 1–7 |

V7 ist wichtig: Es fängt die Tagesform ab. Ohne diesen Wert weißt du nachher nicht, ob jemand einfach schon müde ankam.

### [4] Sitzungsstart

- Freitextfeld: „Woran wirst du in dieser Sitzung arbeiten?" (eine Zeile, wird gespeichert)
- Anzeige der Startwerte: 25 Minuten Arbeit, 5 Minuten Pause, mit Hinweis, dass man das später anpassen kann
- Knopf „Sitzung starten"

### [5] Arbeitsphase

**Der wichtigste Bildschirm, und der muss fast leer sein.** Das ist der Kern deiner Forschungsfrage: Wenn dieser Bildschirm ablenkt, hast du dein eigenes Prinzip verletzt.

Sichtbar: die verbleibende Zeit, sehr dezent, klein, geringer Kontrast. Sonst nichts. Kein Fortschrittsbalken der zappelt, keine Statistiken, keine Motivationssprüche.

Erlaubte Interaktion: „Sitzung beenden" (klein, am Rand).

### [6] Der abgestufte Pausenhinweis

Das ist deine Umsetzung der Auto-Analogie und **das Herzstück der Arbeit**. Vier Stufen:

| Stufe | Zeitpunkt | Gestaltung |
|---|---|---|
| **0** | 2 Min vor Ende | Hintergrundfarbe wandert sehr langsam um wenige Prozent ins Wärmere. Bewusst kaum bewusst wahrnehmbar. |
| **1** | bei 0:00 | Farbe vollendet, dazu eine kleine ruhige Karte unten rechts: „Zeit für eine Pause". Optional ein sehr leiser einzelner Ton. Kein Modal, Arbeit bleibt möglich. |
| **2** | +2 Min ohne Reaktion | Karte wird etwas größer, sanftes langsames Pulsieren. Immer noch am Rand. |
| **3** | +5 Min ohne Reaktion | Ruhiges zentriertes Fenster mit zwei Optionen: „Pause starten" oder „Noch 5 Minuten". Kein Rot, keine Ausrufezeichen, kein Ton. |

**Jede erreichte Stufe wird protokolliert, ebenso die Stufe, bei der reagiert wurde.** Das ist eines deiner wertvollsten Ergebnisse: Bei welcher Stufe reagieren Menschen tatsächlich? Reicht Stufe 1? Braucht es Stufe 3? Das ist ein echter Befund, den du in der Diskussion auswerten kannst.

Optionen für Nutzende bei jeder Stufe: Pause starten, verschieben (5 Min), oder überspringen.

> **Technischer Hinweis:** Die Farbübergänge über CSS-Transitions mit langer Dauer (30–60 Sekunden) lösen, nicht per JavaScript-Animation. Ruhiger und billiger.

### [7] Aktivitätsauswahl

Drei bis vier kurze Vorschläge plus die Option „keine Aktivität":

- **Augenentlastung (2 Min):** 20 Sekunden auf etwas in etwa 6 Metern Entfernung schauen, dreimal wiederholen
- **Nacken und Schultern (3 Min):** angeleitete Dehnung, Schritt für Schritt
- **Aufstehen und bewegen (5 Min):** kurzer Gang, Schultern kreisen
- **Keine Aktivität, einfach Pause**

Auswahl wird protokolliert. Die Option „keine" muss gleichwertig aussehen, nicht wie die schlechte Wahl, sonst verzerrst du deine Daten.

### [8] Pause

Ruhiger Bildschirm mit Restzeit. Falls eine Aktivität gewählt wurde: schrittweise Anleitung, ein Schritt pro Bildschirm, automatisch weiter.

Am Ende: sanfter Hinweis „Bereit weiterzuarbeiten?" mit Knopf. **Nicht automatisch zurückspringen**, das wäre selbst eine Störung.

### [9] Kurzfeedback und Anpassung

Nach jeder Pause, maximal 20 Sekunden Aufwand:

1. „War der Zeitpunkt der Pause passend?" → **zu früh / passend / zu spät**
2. Bei „zu früh" oder „zu spät": „Um wie viele Minuten?" → −10 / −5 / +5 / +10
3. Optional, ein Feld: „Kurz in eigenen Worten?" (darf leer bleiben)

Die Anpassung wirkt direkt auf die nächste Runde. Neuer Wert wird angezeigt: „Nächste Runde: 30 Minuten".

**Das liefert dir deine besten quantitativen Daten:** Wie oft wird angepasst, in welche Richtung, konvergiert es? Wenn alle sechs Personen von 25 auf 35 gehen, hast du einen Befund.

### [10] Nachbefragung

Spiegelt die Vorbefragung und ergänzt die Bewertung der Intervention:

| # | Frage | Format |
|---|---|---|
| N1 | Wie konzentriert warst du in dieser Sitzung? | Skala 1–7 |
| N2 | Wie erschöpft fühlst du dich jetzt? | Skala 1–7 |
| N3 | **Wie störend empfandest du die Pausenhinweise?** | Skala 1–7 |
| N4 | Wie angemessen war der Zeitpunkt der Hinweise? | Skala 1–7 |
| N5 | Wie angenehm war die Art der Hinweise (Farbe, Ton, Einblendung)? | Skala 1–7 |
| N6 | **Würdest du diese Anwendung weiter nutzen?** | Skala 1–7 |
| N7 | Im Vergleich zu deiner gewohnten Arbeitsweise war diese Sitzung … | besser / gleich / schlechter |
| N8 | Warum? | Freitext |
| N9 | Was hat dich am meisten gestört? | Freitext |
| N10 | Was hat am besten funktioniert? | Freitext |

N3 und N6 sind deine Kernvariablen für UF3. N1/N2 vergleichst du gegen V4/V5.

> **Ein Tipp, der deine Arbeit aufwertet:** Frag Holly, ob du zusätzlich ein etabliertes Instrument einsetzen sollst, etwa **NASA-TLX** für die empfundene Beanspruchung oder **UEQ-S** für die Nutzungserfahrung. Etablierte Skalen sind wissenschaftlich stärker als selbst gebaute Fragen, weil sie geprüft und vergleichbar sind. Beide sind kurz und frei verfügbar. Das ist ein guter Meeting-Punkt.

### [11] Abschluss

Dank, Hinweis auf deine Kontaktadresse für Rückfragen und Löschwünsche, fertig. Keine Auswertung für die Nutzenden anzeigen, das würde nachträglich ihre Antworten beeinflussen.

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
BREAK_ACCEPTED         BREAK_SNOOZED         BREAK_SKIPPED
ACTIVITY_SELECTED      ACTIVITY_SKIPPED      ACTIVITY_STEP_DONE
BREAK_STARTED          BREAK_ENDED
INTERVAL_ADJUSTED      CYCLE_FEEDBACK_SUBMITTED
TAB_HIDDEN             TAB_VISIBLE
SESSION_ENDED          SURVEY_POST_SUBMITTED
```

**`TAB_HIDDEN` und `TAB_VISIBLE`** über die Page Visibility API. Das ist ein kleiner, aber wertvoller Trick: Es zeigt dir, ob während der Arbeitsphase der Tab im Vordergrund war. Damit kannst du in der Diskussion die Limitation „ortsunabhängige Durchführung, keine Kontrolle" wenigstens teilweise entkräften, weil du zumindest ein objektives Signal hast.

**`BREAK_ACCEPTED` speichert im payload die Stufe**, bei der reagiert wurde: `{ "reactedAtStage": 2, "secondsAfterStage1": 143 }`. Das ist die Zahl, die deine Arbeit interessant macht.

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

GET   /api/admin/export?format=csv  nur für ADMIN
GET   /api/admin/sessions           Übersicht
```

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
