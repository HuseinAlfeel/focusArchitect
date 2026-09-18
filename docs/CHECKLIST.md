# FocusArchitect: Komplette Bau-Checkliste

*Von null bis zur fertigen Studie. Husin Alfil, Bachelorarbeit HPI.*
*Zielserver: Hetzner (Deutschland). Stand: 03.08.2026*

**So benutzt du diese Liste:** Von oben nach unten abarbeiten. Jede Phase hat am Ende ein „Fertig, wenn". Erst wenn das erfüllt ist, weitergehen. Nicht vorgreifen, auch wenn es verlockend ist.

---

## PHASE A: Bevor du eine Zeile Code schreibst

*Aufwand: 1 Tag, hauptsächlich Warten auf Antworten*

- [ ] **A1. Meeting mit Holly gehabt.** Studienaufbau ist abgesegnet.
- [ ] **A2. Datenschutz und Ethik geklärt.** Weißt du, ob ein Antrag nötig ist? Falls ja: gestellt.
- [ ] **A3. Text für Einwilligung und Datenschutz.** Vorlage vom Fachgebiet erfragt oder selbst entworfen und von Holly gegengelesen.
- [ ] **A4. Fragebogen-Items final.** Inklusive Entscheidung: eigene Skalen oder NASA-TLX / UEQ-S dazu?
- [ ] **A5. KI-Logbuch angelegt.** Eine Textdatei. Ab jetzt jeden Tag eine Zeile.
- [ ] **A6. Zehn Teilnehmende terminiert.** Feste Termine im Kalender, nicht nur „hat zugesagt".
- [ ] **A7. Elfte Person für den Probelauf** angefragt.

> **Fertig, wenn:** Du weißt genau, was du misst und wann du es messen darfst.

---

## PHASE B: Server einrichten

*Aufwand: halber Tag. Einmalig, danach nie wieder anfassen.*

### B1. Domain besorgen

Du brauchst eine echte Domain, weil du HTTPS brauchst. Teilnehmende geben ein Passwort ein und du erhebst personenbezogene Daten. Über HTTP wäre das in einer Universitätsstudie nicht vertretbar.

- [ ] Domain kaufen (ca. 10 € im Jahr, z. B. bei Netcup oder INWX) oder vorhandene Subdomain nutzen
- [ ] A-Record auf die IPv4 deines Hetzner-Servers zeigen lassen
- [ ] AAAA-Record auf die IPv6 (Hetzner gibt dir eine)
- [ ] Warten, bis `ping deine-domain.de` die richtige IP zeigt (kann 30 Min dauern)

### B2. Grundabsicherung des Servers

```bash
# Als root einloggen
ssh root@DEINE_IP

# System aktualisieren
apt update && apt upgrade -y

# Eigenen Benutzer anlegen (nicht als root arbeiten)
adduser husin
usermod -aG sudo husin

# SSH-Key für den neuen Benutzer übernehmen
rsync --archive --chown=husin:husin ~/.ssh /home/husin

# Firewall
ufw allow OpenSSH
ufw allow 80
ufw allow 443
ufw enable
```

- [ ] Neuen Benutzer angelegt, SSH-Login damit getestet (**in einem zweiten Terminal testen, bevor du das erste schließt!**)
- [ ] Root-Login per Passwort deaktiviert: in `/etc/ssh/sshd_config` setzen `PermitRootLogin no` und `PasswordAuthentication no`, dann `systemctl restart ssh`
- [ ] Firewall aktiv (`ufw status` zeigt active)

### B3. Docker installieren

```bash
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker husin
# Abmelden und neu anmelden, damit die Gruppe greift
docker run hello-world
```

- [ ] `docker run hello-world` läuft ohne sudo durch

> **Fertig, wenn:** Du kommst als `husin` per SSH rein, Docker läuft, Firewall steht, Domain zeigt auf den Server.

---

## PHASE C: Projekt lokal aufsetzen

*Aufwand: halber Tag*

### C1. Next.js anlegen

```bash
npx create-next-app@latest focusarchitect
# TypeScript: Ja
# ESLint: Ja
# Tailwind CSS: Ja
# src/ directory: Ja
# App Router: Ja
# Turbopack: Ja
# Import alias: Nein (Standard @/* behalten)

cd focusarchitect
```

- [ ] Projekt angelegt, `npm run dev` zeigt die Startseite auf localhost:3000

### C2. Git von Anfang an

```bash
git init
git add -A
git commit -m "Projektstart"
```

- [ ] Repository auf GitHub angelegt (**privat!**), erster Push
- [ ] `.env` steht in `.gitignore` (prüfen! niemals Passwörter committen)

> Ab jetzt: nach jedem funktionierenden Schritt committen. Wenn du dir etwas kaputt machst, kommst du zurück.

### C3. Postgres lokal per Docker

Datei `docker-compose.dev.yml`:

```yaml
services:
  db:
    image: postgres:16
    restart: unless-stopped
    environment:
      POSTGRES_USER: focus
      POSTGRES_PASSWORD: devpassword
      POSTGRES_DB: focusdb
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
volumes:
  pgdata:
```

```bash
docker compose -f docker-compose.dev.yml up -d
```

- [ ] Container läuft (`docker ps`)

### C4. Prisma einrichten

```bash
npm install prisma --save-dev
npm install @prisma/client
npx prisma init --datasource-provider postgresql
```

In `.env`:
```
DATABASE_URL="postgresql://focus:devpassword@localhost:5432/focusdb"
SESSION_SECRET="hier-einen-langen-zufallsstring"
```

Zufallsstring erzeugen: `openssl rand -base64 32`

- [ ] `.env` gefüllt
- [ ] Schema aus der Spezifikation in `prisma/schema.prisma` übertragen
- [ ] `npx prisma migrate dev --name init` läuft durch
- [ ] `npx prisma studio` öffnet sich und zeigt die leeren Tabellen

### C5. Weitere Pakete

```bash
npm install bcryptjs jose
npm install -D @types/bcryptjs
```

> **Fertig, wenn:** Prisma Studio zeigt deine Tabellen, die App läuft lokal.

---

## PHASE D: Accounts anlegen

*Aufwand: 1 Stunde*

- [ ] `prisma/seed.ts` schreiben: legt `P01` bis `P06`, `PILOT` und `ADMIN` an, Passwörter mit bcrypt gehasht
- [ ] Passwörter in einer separaten Datei notieren, die **nicht** im Git liegt (du musst sie den Teilnehmenden geben)
- [ ] `npx prisma db seed` ausgeführt
- [ ] In Prisma Studio prüfen: acht Einträge, Passwörter sind Hashes (beginnen mit `$2`)

> **Fertig, wenn:** Acht Accounts in der Datenbank, keine Klartext-Passwörter.

---

## PHASE E: Login

*Aufwand: 1 Tag*

- [ ] `POST /api/auth/login`: Code und Passwort prüfen, bei Erfolg signiertes Token als **httpOnly, secure, sameSite=lax** Cookie setzen
- [ ] `POST /api/auth/logout`: Cookie löschen
- [ ] `src/proxy.ts` (in Next.js 16 die Nachfolge-Konvention von `middleware.ts`, gleiche Funktion): alle Routen außer `/login` und `/api/auth/*` schützen
- [ ] Login-Seite: zwei Felder, ein Knopf, Fehlermeldung bei falschen Daten
- [ ] Helfer `getCurrentParticipant()` für Server Components
- [ ] Admin-Prüfung für die späteren Export-Routen

**Testen:**
- [ ] Falsches Passwort wird abgewiesen
- [ ] Nach Login landest du auf der Studienseite
- [ ] Direkter Aufruf einer geschützten Seite ohne Login leitet auf `/login`
- [ ] Logout funktioniert

> **Fertig, wenn:** Du kannst dich als P01 einloggen und wieder ausloggen.

---

## PHASE F: Der Studienablauf

*Aufwand: 4 bis 5 Tage. Der Kern.*

> **Datenverlust-Prüfung 18.09.** Die ganze App einmal gezielt darauf durchgesehen, wo Teilnehmerdaten
> verloren gehen oder falsch zugeordnet werden können - Details und Begründungen in ENTSCHEIDUNGEN.md.
> Zwei echte Funde behoben: eine zweite Einwilligung legte eine zweite, leere Sitzung an (alle Seiten nehmen
> per `orderBy: createdAt desc` die neueste, die erste wäre unsichtbar geworden), und die Ereignis-Queue
> konnte sich an einem dauerhaft abgelehnten Stapel verstopfen bzw. Ereignisse der falschen Sitzung
> zuordnen. Geprüft und in Ordnung: Seed (`upsert`, löscht nichts), kein `delete` im App-Code, keine
> destruktive Migration, Lifecycle-Routen setzen nur Zeitstempel, Nachbefragung prüft client- und
> serverseitig gegen dieselbe Liste, Export filtert nichts weg.

### F1. Einwilligung (halber Tag)

- [ ] Seite `/study/consent` mit dem abgestimmten Text
- [ ] Checkbox, Knopf erst dann aktiv
- [ ] `POST /api/session` legt Session an, `consentAt` wird gesetzt
- [ ] Ereignis `CONSENT_GIVEN` protokolliert
- [ ] Ohne Einwilligung kein Weiterkommen

> **Wichtig:** Vor diesem Punkt werden keine Studiendaten gespeichert. Nur Login und Sessionanlage.

### F2. Vorbefragung (halber Tag)

- [ ] Seite `/study/pre`, drei Schritte in einer Client-Komponente (Änderung 14.09., kein Datenbank-Schreiben
      vor dem Ende): Schritt 0 = reiner Info-Text "So funktioniert die App" (`onboarding-intro.ts`, für die
      unbegleitete/ortsunabhängige Durchführung - keine Validierung, nur "Los geht's"), Schritt 1 = Block A
      (Person/Tätigkeit), Schritt 2 = Block B (tatsächliches Pausenverhalten) + C (Einstellung) + D (nur noch
      Erschöpfung, "typische Konzentration" gestrichen). "Schritt X von 3" oben auf jeder Seite
- [ ] Schritt 1: Knopf „Weiter (1/2)". Schritt 2: „Zurück" (Antworten aus Schritt 1 bleiben erhalten) und
      „Profil speichern & Weiter" - erst hier wird tatsächlich gespeichert
- [ ] Skalen als anklickbare Buttons 1 bis 7, nicht als Slider (Slider verleiten zur Mitte)
- [x] Anschlussfragen bei B2/B3 nur sichtbar bei „Ja". B3 selbst ist zusätzlich an B2 gekoppelt (`showIf`,
      Änderung 17.09.): bei „Nein" auf „Machst du bewusst Pausen?" entfallen Anzahl-Frage und B3 komplett,
      B4 („Beschreibe kurz, wie du Pausen machst") bleibt in beiden Fällen sichtbar. Nicht gestellte Fragen
      werden nicht mitgespeichert (Spalte im Export leer). Regel liegt als `isPreSurveyItemVisible` in
      `pre-survey.ts` und gilt für Formular **und** `POST /api/survey`. Lagen die beiden auseinander, liess
      sich die Vorbefragung mit „Nein" gar nicht mehr absenden (genau das im Test aufgefallen)
- [ ] Validierung: alle Pflichtfelder des jeweiligen Schritts ausgefüllt
- [ ] `POST /api/survey` mit `phase: "PRE"` (beide Schritte zusammen als eine Antwort)
- [ ] Ereignis `SURVEY_PRE_SUBMITTED`

### F3. Sitzungsstart / Dashboard (2 Stunden)

- [ ] Dritter Onboarding-Schritt, jetzt direkt auf `/study` (Änderung 14.09.): sobald Profil steht und die
      Sitzung noch nicht läuft, zeigt die Startseite selbst dieses Dashboard - keine eigene Route mehr, die
      alte leere "Eingeloggt als..."-Seite ist komplett weg
- [ ] Kopfzeile „Hallo {Code}!", Freitextfeld für die geplante Tätigkeit
- [ ] Zwei Skalenfragen (Änderung 12.09.): „Wie ausgeruht fühlst du dich jetzt gerade?", „Wie konzentriert
      fühlst du dich jetzt gerade?" - ersetzen das alte V7 aus der Vorbefragung, landen als eigene
      Session-Felder (`restedAtStart`, `focusAtStart`) in `participants.csv`
- [ ] Dezenter Hinweistext zu den Startwerten 25/5 und zur späteren Anpassbarkeit
- [x] Hinweiskasten „Kurz vor dem Start, bitte einmal prüfen" mit drei Zeilen (Fenster sichtbar lassen, Ton
      an, eigene echte Aufgabe) und Pflichthäkchen „Passt alles, ich kann loslegen" (ergänzt 18.09., Text in
      `session-start.ts`). Ohne Häkchen bleibt der Startknopf gesperrt. Grund: bleibt das Fenster im
      Hintergrund, wirkt die visuelle Eskalation bei dieser Person nicht, und dann wird bei ihr etwas
      anderes gemessen als bei den übrigen neun. Die Erklärseite vor der Vorbefragung bleibt daneben
      bestehen, zwischen ihr und dem echten Start liegen aber zehn Minuten Fragebogen
- [ ] Großer, primärer Knopf „Fokus-Sitzung starten"
- [ ] `PATCH /api/session/:id/start`
- [ ] Bei Erfolg direkt zu `/study/session`, nicht zurück zum Dashboard (Änderung 14.09.: vorher ein
      zusätzlicher Klick über die Hub-Seite nötig)
- [ ] Ereignisse `SESSION_STARTED`, `CYCLE_STARTED`, `WORK_STARTED`
- [ ] Läuft die Sitzung schon (auch nach „Sitzung fortsetzen"), leitet `/study` genauso direkt zu
      `/study/session` weiter (Änderung 14.09.) - vorher zeigte auch das noch eine eigene Zwischenseite mit
      Textlink statt Knopf, gerade nach dem Reopen unangenehm aufgefallen

### F4. Timer-Logik (1 Tag, kritisch)

- [ ] Hook `useCountdown(endsAt: number)` schreiben
- [ ] **Zielzeitpunkt speichern, nicht Restzeit hochzählen** (sonst zerstört Browser-Drosselung deine Messung)
- [ ] Zielzeitpunkt in `sessionStorage` sichern, damit ein Reload die Runde nicht zerstört
- [ ] Rundenzustand: `WORK | NUDGE | ACTIVITY_CHOICE | BREAK | FEEDBACK`
- [ ] Wiederherstellen aus `sessionStorage` erst in einem `useEffect`, nicht im `useState`-Initializer
      (Änderung 14.09.) - sessionStorage gibt es nur im Browser, ein Lesen davon schon beim allerersten
      Render erzeugt einen Hydration-Mismatch, sobald der gespeicherte Stand vom Server-Fallback abweicht
      (z.B. Reload mitten in einer Pause). Erster Render zeigt kurz den Server-Fallback, danach übernimmt der
      Effect den echten Stand

**Testen:**
- [ ] Tab 5 Minuten in den Hintergrund legen, zurückkommen: Anzeige stimmt sofort
- [ ] Seite neu laden mitten in der Runde: Zustand bleibt erhalten

### F5. Arbeitsphase (2 Stunden)

- [ ] Seite `/study/session`, bewusst fast leer
- [ ] Restzeit als M:SS (`formatRemaining`), groß und in einem dezenten Rahmen, aber weiterhin kontrastarm
      (Änderung 12.09.: zurückhaltend heißt nicht unlesbar). Arbeitsphase kurzzeitig nur auf Minuten reduziert,
      auf meinen Wunsch noch am selben Tag wieder auf M:SS zurückgestellt, siehe ENTSCHEIDUNGEN.md
- [ ] Sehr sanfter, langsam atmender Farbfleck im Hintergrund (`.phase-glow`, kühl bei Arbeit, warm bei Pause),
      rein dekorativ, keine Kennzahl (Änderung 12.09., Betreuung: bisheriges Grau-auf-Weiss wirkte zu trocken)
- [ ] Kleine, kontrastarme Zeile „Fokus · Runde N" / „Pause · Runde N" über der Restzeit (Änderung 12.09.),
      damit erkennbar ist, welche Phase läuft, nutzt die schon gespeicherte Zyklusnummer
- [ ] Knopf „Sitzung beenden" oben rechts, klar erkennbar, aber nicht dominant (Änderung 12.09.: erst
      Textlink, dann Knopf unten links hinter dem Next.js-Dev-Icon). Rückfrage über ein eigenes
      Bestätigungsfenster statt des nativen Browser-Dialogs
- [x] Knopf „Pause jetzt starten" unten rechts, genauso zurückhaltend (ergänzt 14.09.), nur sichtbar vor dem
      Pausenhinweis. Beendet die Runde sofort, danach wie bei jeder Runde das Kurzfeedback (seit 17.09., davor
      übersprungen), erst dann weiter zur Aktivitätsauswahl. Ereignis `BREAK_SELF_INITIATED` mit
      `payload: { cycleNumber, secondsIntoWork }`, in `cycles.csv` über `reactionType: "SELF_INITIATED"` sichtbar
- [ ] Page Visibility API: `TAB_HIDDEN` und `TAB_VISIBLE` protokollieren
- [ ] Maus-/Tastaturaktivität im Tab aggregiert pro Minute als `ACTIVITY_TICK` (Änderung 26.08.), nur bei
      sichtbarem Tab, keine Inhalte. Einschränkung dokumentieren: misst Interaktion mit der App, nicht die
      echte Arbeitsaktivität außerhalb des Tabs (siehe SPEZIFIKATION.md 4)
- [x] Immer heller Modus, unabhängig von der Systemeinstellung (Regel 9, Befund der Betreuung 17.09.):
      `@custom-variant dark (&:where(.dark, .dark *))` in `globals.css` deaktiviert `prefers-color-scheme`-
      basiertes Dark Mode, `color-scheme: light` gesetzt. Verifiziert per Playwright mit erzwungener
      `colorScheme: "dark"`-Emulation - App bleibt hell

### F6. Der abgestufte Hinweis (1 Tag, das Herzstück)

- [x] **Stufe 0** bei T minus 2 Min: Hintergrund wandert über CSS-Transition (Dauer 60s) nach Beige `#f6e7cd`,
      Zifferfarbe des Timers zieht mit (Betreuung, 17.09.)
- [x] Farben und Übergangsdauern nachgeschärft (17.09., nach dem Live-Test, da war schlicht nichts zu sehen): erste
      Fassung lag nur 2/12/25 RGB-Punkte neben Weiß und brauchte auf jeder Stufe 60s, gemessen 10s nach
      Stufenwechsel noch `rgb(255,253,251)`. Jetzt kräftigere Stufen und 60s nur noch für Stufe 0, ab Stufe 1
      15s. **Nicht nur den gesetzten Zielwert prüfen, sondern die gerenderte Farbe messen**, genau daran ist
      die erste Prüfung vorbeigelaufen
- [x] **Stufe 1** bei 0:00: weiter Beige, kleine ruhige Karte unten rechts mit kurzer Einblendbewegung (~400ms,
      `.animate-nudge-card-in`), ein einzelner leiser Ton
- [x] **Stufe 2** bei plus 2 Min: Hintergrund wandert weiter zu gedämpftem Bernstein, Karte etwas größer, rückt
      näher zur Mitte (weiche `transition`, kein Sprung), sehr langsames Pulsieren
- [x] **Stufe 3** bei plus 5 Min: Hintergrund wandert weiter zu gedämpftem Terrakotta, ruhiges zentriertes
      Fenster, drei Optionen. Kein Rot, kein Ausrufezeichen
- [ ] Jede erreichte Stufe protokollieren: `NUDGE_STAGE_0` bis `NUDGE_STAGE_3`, jeweils mit
      `payload: { tabVisibleAtNudge }` (Änderung 25.08., ergibt zusammen mit `TAB_VISIBLE` die Reaktionslatenz
      im Export)
- [ ] Bei Reaktion protokollieren, **bei welcher Stufe** und nach wie vielen Sekunden:
      `BREAK_ACCEPTED`/`BREAK_SKIPPED` mit `payload: { stage, secondsAfterEnd }`
- [ ] Optionen: Pause starten / Noch 5 Minuten / überspringen. Das Snoozen ("Noch 5 Minuten", Änderung 26.08.,
      Ereignis `BREAK_SNOOZED`) verschiebt nur die Eskalation, nicht die Rundenlänge, kein Rückfall in das am
      09.08. entfernte blinde Verlängern der laufenden Runde (das änderte die Rundenlänge ohne Minutenangabe,
      das übernimmt weiterhin ausschließlich das Kurzfeedback F8)
- [ ] "Überspringen" umgeht wirklich Aktivitätsauswahl und Pause (direkt weiter zur nächsten Arbeitsrunde nach
      dem Kurzfeedback), nicht nur ein anderer Ereignisname bei sonst gleichem Ablauf wie "Pause starten"
- [ ] Zusätzlich zur Ton-Eskalation: solange nicht reagiert wurde, zeigt die Hinweis-Karte/das Modal eine
      **Überzeit**-Anzeige (`+MM:SS`, seit wann der Zielzeitpunkt überschritten ist), damit die Anzeige nach
      Ablauf nicht einfach leer bleibt (steht seit 25.08. direkt in der Karte, vorher separat und vom Modal verdeckt)
- [x] Ton-Eskalation direkt an die vier Stufen gekoppelt (`useNudgeStageSound.ts`, Befund der Betreuung 17.09.,
      ersetzt den vorherigen eigenen Zeitplan in `useNudgeSoundSchedule.ts`): ein Ton je erreichter Stufe, Stufe 0
      tonlos, Stufe 1 leiser Sinuston, Stufe 2 etwas deutlicherer Glockenton, Stufe 3 klarer aufsteigender Ton,
      danach keine Wiederholung, protokolliert als `NUDGE_SOUND_PLAYED`. Verifiziert per Playwright
      (`page.clock`, alle vier Stufen und weit darüber hinaus durchlaufen): genau drei Ereignisse, keins bei
      Stufe 0, keins wiederholt nach Stufe 3
- [x] Feinabstimmung der drei Töne (`nudgeSound.ts`, Befund der Betreuung 17.09.): weicher Einsatz (~50ms
      Anstieg statt abrupt) und mittlerer Frequenzbereich (ca. 500–900 Hz statt teils darunter/schriller) für
      `soft-sine`/`soft-bell`/`rising-sweep`. Eskalation weiterhin über Klangfülle, nicht Lautstärke. Zum
      Anhören/Kalibrieren: `/admin/sound-check`
- [x] Karte blendet bei Stufe 1 einmalig per CSS-Keyframe ein (~400ms, `.animate-nudge-card-in` in
      `globals.css`) statt schlagartig dazustehen (Onset nach Hillstrom/Yantis, Befund der Betreuung 17.09.);
      das Wachsen zu Stufe 2 läuft über eine weiche `transition` statt eines Sprungs, dabei rückt die Karte auch
      sichtbar näher zur Mitte (`bottom-6/right-6` → `bottom-8/right-8`)
- [ ] Hinweis-Karte/-Modal nur bei `state === "WORK"` rendern, nicht nur bei `!hasReacted` (Bugfix 14.09.),
      sonst kann nach einem Reload mitten in Pause/Kurzfeedback/Aktivitätsauswahl der alte Hinweis der
      vorherigen Runde wieder aufscheinen, weil `hasReacted` (anders als der Rundenzustand) nicht in
      `sessionStorage` gesichert wird und bei jedem Neu-Mount auf `false` zurückfällt

> Das ist die Funktion, aus der dein wichtigstes Ergebnis kommt. Nimm dir hier Zeit und teste alle vier Stufen mit verkürzten Zeiten (z. B. 1 Min statt 25).

### F8. Kurzfeedback und Anpassung (halber Tag)

> **Reihenfolge korrigiert (09.08.):** Das Kurzfeedback kommt jetzt **direkt nach der Reaktion auf den
> Pausenhinweis**, noch vor Aktivitätsauswahl und Pause, nicht danach. Die Frage "war der Zeitpunkt passend"
> bewertet die gerade zu Ende gegangene Arbeitsphase, das lässt sich direkt danach am zuverlässigsten beantworten.
> Die hier entschiedene neue Arbeitszeit wird erst nach der Pause tatsächlich angewendet (F7 folgt danach).
>
> **Selbst gestartete Pause (ergänzt 14.09., korrigiert 17.09.):** Auch bei `BREAK_SELF_INITIATED` (siehe F5)
> kommt dieser Schritt jetzt genauso. Bis 17.09. entfiel er hier, weil es keinen Systemhinweis gab, den man
> bewerten könnte, aber eine freiwillig früh beendete Runde kann genauso "Zu früh" sein und soll genauso die
> nächste Rundenlänge beeinflussen können.

- [ ] Drei Knöpfe: zu früh / passend / zu spät
- [ ] Bei zu früh oder zu spät: Zähler in 5-Minuten-Schritten, frei nach oben oder unten
      (Änderung 11.08.: statt vier fester Knöpfe -10/-5/+5/+10, die Sprünge waren zu grob)
- [ ] Optionales Freitextfeld
- [ ] `POST /api/cycle-feedback`, Ereignisse `INTERVAL_ADJUSTED`, `CYCLE_FEEDBACK_SUBMITTED`
- [ ] Neuer Wert wirkt auf die nächste Runde und wird angezeigt ("Nächste Runde: X Minuten")

### F7. Aktivitätsauswahl und Pause (1 Tag)

- [ ] Vier gleichwertig aussehende Optionen: Augen, Nacken, Bewegung, keine Aktivität
- [ ] `ACTIVITY_SELECTED` oder `ACTIVITY_SKIPPED` protokollieren
- [ ] Pausenbildschirm mit Restzeit, ruhig gestaltet
- [ ] Bei gewählter Aktivität: Schritt-für-Schritt-Anleitung, ein Schritt je Bildschirm, `ACTIVITY_STEP_DONE`
- [ ] Während eines Schritts eigene Ansicht statt der großen Pausenuhr (Änderung 14.09.): Beschriftung
      „{Aktivität} · Schritt X von Y", Fortschritts-Ring, größere Anleitung, kleine Zeile mit der
      verbleibenden Gesamtpause. Leiser Übergangston bei jedem Schrittwechsel (`playNudgeSound(0.25,
      "water-drop")`). Nach dem letzten Schritt wieder die normale, große Pausenuhr
- [ ] Jeder Anleitungsschritt einmal per `speechSynthesis` vorgelesen (ergänzt 14.09., `useSpeech.ts`),
      deutsche Stimme falls verfügbar, `rate` 0.9, Schalter „Sprachausgabe an/aus" (Vorgabe an),
      `SPEECH_TOGGLED`-Ereignis, kein Fehler falls die API fehlt. Nur hier, nicht in Arbeitsphase/Pausenhinweis
- [x] Taktung aller Schritte überarbeitet (`activities.ts`, zweimal aufgefallen, 17.09.): vorher ein
      Satz und danach 30-85 Sekunden reine Stille pro Schritt, unbegleitet wirkte das wie ein Hänger statt
      einer unterstützten Übung. Jetzt nennt jede Ansage die eigene Dauer/Wiederholzahl, kein Schritt lässt
      mehr als ~15s Stille nach dem letzten Wort, jede Aktivität endet mit einem kurzen Abschlusssatz statt
      abrupt aufzuhören. Dadurch kürzer als ursprünglich geplant (Augen ~1 Min, Nacken/Bewegen je ~1,5 Min
      statt 2/3/5 Min) - Sprechzeiten real per `speechSynthesis` gemessen, nicht geschätzt. Per Playwright
      Schritt für Schritt durchlaufen (P01, Testdaten danach entfernt): korrekte Anzahl/Reihenfolge der
      Schritte, danach normale Pausenuhr
- [x] Bei 9, 8, 7 … 1 ein Klopf-Ton, bei 0 ein klares Signal ("Pause vorbei"), vorher endete die Pause
      komplett unbemerkt, wenn man nicht auf den Bildschirm schaute (09.08.). Der Klopf-Ton war anfangs
      deutlich leiser als das Endsignal, dadurch kaum zu hören (26.08. und erneut 17.09.), jetzt auf
      derselben Lautstärke, verifiziert per Playwright (unmockierte Echtzeit-Pause, `page.clock` würde bei
      zwei parallelen Intervallen Ticks verschlucken): genau neun Klopftöne plus Endsignal, im Sekundenabstand
- [ ] Am Ende **kein** automatischer Rücksprung, sondern Knopf „Sitzung starten" (die im F8-Kurzfeedback
      entschiedene Arbeitszeit für die nächste Runde wird hier angewendet)
- [ ] `BREAK_STARTED`, `BREAK_ENDED`
- [ ] Danach automatisch nächste Runde starten (`CYCLE_STARTED`, `WORK_STARTED`)

### F9. Nachbefragung und Abschluss (halber Tag)

- [ ] Seite `/study/post`, drei Seiten statt einer langen (Änderung 14.09.): (1) N1/N2/N16/N17, (2) N3-N15 mit
      einmaliger Instruktion + Legende und schlichter Trennlinie, (3) N19/N18/N20 als optionale Freitexte.
      Dezenter Fortschritt „Schritt X von 3" oben, keine zusätzlichen wertenden Zwischenüberschriften
- [ ] Je Seite `page_load_timestamp`/`page_submit_timestamp` mitgeführt (`answers.pageTimings`), im Export
      als `postPage1Seconds` bis `postPage3Seconds` - zur Erkennung von Blindklickern
- [ ] `POST /api/survey` mit `phase: "POST"`
- [ ] `PATCH /api/session/:id/end`, Ereignisse `SESSION_ENDED`, `SURVEY_POST_SUBMITTED`
- [ ] Abschlussseite: Dank, deine Kontaktadresse für Rückfragen und Löschwünsche
- [ ] **Keine** Auswertung für Teilnehmende anzeigen

> **Fertig, wenn:** Du kannst den kompletten Ablauf einmal von Login bis Abschluss durchspielen.

---

## PHASE G: Datenerfassung absichern

*Aufwand: 1 Tag. Der langweiligste Teil, der deine Studie rettet.*

- [x] Ereignis-Queue im Client: Ereignisse sammeln statt einzeln senden (`src/lib/eventQueue.ts`)
- [x] Alle 10 Sekunden und bei jedem Phasenwechsel senden (`POST /api/events` im Batch)
- [x] Queue zusätzlich in `localStorage` spiegeln
- [x] Beim Laden der Seite: unversendete Ereignisse aus `localStorage` nachsenden
- [x] Beim Verlassen der Seite: `navigator.sendBeacon`
- [x] Jedes Ereignis bekommt `clientAt` (Browserzeit) **und** `at` (Serverzeit)

**Testen:**
- [x] Netzwerk in den DevTools auf offline stellen, weiterklicken, wieder online: Daten kommen an
      (dabei einen echten Bug gefunden und behoben, 10.08.: Reload während die Queue noch
      unterwegs war, konnte die Runde auf den letzten dem Server bekannten Stand zurücksetzen)
- [ ] Browser mitten in der Sitzung schließen, wieder öffnen: nichts verloren

> **Fertig, wenn:** Du hast bewusst versucht, Daten zu verlieren, und es ist dir nicht gelungen.

---

## PHASE H: Export

*Aufwand: halber Tag. Vor der Studie bauen, nicht danach!*

- [x] Seite `/admin`, nur für Rolle ADMIN (`src/app/admin/page.tsx`)
- [x] Übersicht: alle Sessions, Status, Anzahl Ereignisse
- [x] `GET /api/admin/export?file=...` erzeugt drei CSV-Dateien:
      - `participants.csv`: eine Zeile je Person, Vor- und Nachwerte nebeneinander
      - `cycles.csv`: eine Zeile je Runde
      - `events.csv`: eine Zeile je Ereignis
- [x] Semikolon als Trennzeichen und UTF-8 mit BOM, sonst zerlegt Excel deine Umlaute
- [x] Export einmal mit Testdaten heruntergeladen und geprüft (BOM-Bytes, Semikolon-Trennung,
      Umlaute, Escaping bei Kommentaren mit Semikolon - per curl, siehe Commit)

> **Fertig, wenn:** Du hast eine CSV vor dir, mit der du wirklich rechnen könntest.

---

## PHASE I: Deployment

**Entscheidung 17.09.: die Studie läuft auf Vercel + Neon, nicht auf Hetzner.** Begründung: ich will die
App jetzt live haben, und ein eigener Server kostet Zeit, die vor der Studie fehlt. Der komplette
Hetzner-Stack (I1–I5 unten) bleibt gebaut und getestet im Repo stehen - falls er später doch umziehen will,
ist nichts davon verloren. Wichtig für die Einwilligung ("Die Daten werden auf einem Server in Deutschland
gespeichert"): bei Neon **muss** die Region Frankfurt gewählt werden, dann liegen die Daten weiter in
Deutschland und der Satz bleibt korrekt.

### I0. Vercel + Neon (der Weg, der jetzt benutzt wird)

Die App ist ein normales Next.js-Projekt ohne `output: "standalone"` - Vercel braucht keine Sonderbehandlung.
Eine einzige Anpassung war nötig: `npm run build` heißt jetzt `prisma generate && next build`, weil der
Prisma-Client nach `src/generated/prisma` erzeugt wird und diese Ordner bewusst nicht im Git liegen (ohne das
bricht der Build bei Vercel mit "Cannot find module '@/generated/prisma'" ab). Lokal getestet, indem
`src/generated/prisma` gelöscht und neu gebaut wurde - genau die Situation, die Vercel vorfindet.

- [ ] **Datenbank anlegen:** auf neon.com ein Projekt erstellen, Postgres 16, **Region Frankfurt
      (eu-central-1)**. Neon zeigt danach zwei Verbindungsstrings an:
      - den **gepoolten** (Host enthält `-pooler`) → der gehört zu Vercel
      - den **direkten** (ohne `-pooler`) → den brauchst du lokal für Migration und Seed
      Grund für die Unterscheidung: Vercel-Funktionen starten und sterben laufend, jede würde eine eigene
      DB-Verbindung aufmachen und das Verbindungslimit sprengen. Der Pooler bündelt das. Migrationen wiederum
      mögen den Pooler nicht, die laufen über die direkte Verbindung.
- [ ] **Migration und Seed von deinem Laptop aus** (nicht bei Vercel, denn `prisma/seed.ts` braucht
      `credentials.local.json` mit den echten Teilnehmer-Passwörtern - die soll nie auf einen fremden Server):
      ```
      # NEUES Powershell-Fenster, mit dem DIREKTEN String:
      $env:DATABASE_URL="postgresql://...neon.tech/neondb?sslmode=require"

      # Sicherheitsschritt: zeigt an, mit welcher Datenbank gesprochen wird
      npx prisma migrate status

      npx prisma migrate deploy
      npx prisma db seed
      ```
      Die gesetzte Variable übersteuert die lokale `.env` (geprüft), aber genau deshalb vorher einmal
      `migrate status` laufen lassen: die Ausgabe nennt den Host in Klartext. Steht dort `localhost`, ist die
      Variable nicht angekommen, und Migration und Seed würden in die lokale Testdatenbank laufen statt nach
      Neon. Danach prüfen: `npx prisma studio` zeigt die zwölf Accounts.
- [ ] **Projekt bei Vercel verbinden:** vercel.com → "Add New Project" → das GitHub-Repo `focusArchitect`
      auswählen. Framework wird automatisch als Next.js erkannt, Build-Command nicht anfassen.
- [ ] **Region auf Frankfurt stellen:** Vercel → Projekt → Settings → Functions → Region `Frankfurt (fra1)`.
      Sonst laufen die Funktionen in den USA, auch wenn die Datenbank in Frankfurt steht.
- [ ] **Umgebungsvariablen bei Vercel setzen** (Settings → Environment Variables, für Production):
      - `DATABASE_URL` = der **gepoolte** Neon-String
      - `SESSION_SECRET` = langer Zufallsstring, **ein anderer als lokal** (`openssl rand -base64 32`)
      Kein `DB_PASSWORD` nötig, das gilt nur für den Docker-Weg.
- [ ] **Deployen** (passiert automatisch beim nächsten `git push`), dann die Live-URL öffnen und mit `PILOT`
      einmal komplett durchlaufen: Login → Einwilligung → Vorbefragung → Sitzung → Pause → Nachbefragung
- [ ] **Export von der Live-URL ziehen** und in Excel öffnen (siehe PHASE J) - erst damit ist bewiesen, dass
      die Daten auch wirklich rauskommen
- [ ] **Datensicherung einrichten** (siehe PHASE K): nach jeder Teilnehmer-Sitzung einen Dump ziehen.
      Mit dem direkten Neon-String, und weil Docker sowieso da ist, geht das ohne lokale
      Postgres-Installation:
      ```
      docker run --rm -v "${PWD}:/arbeit" postgres:16 pg_dump "DIREKTER_NEON_STRING" -f /arbeit/dump_2026-09-18.sql
      ```
      Neon macht zwar eigene Backups, aber ein eigener Dump auf deiner Platte ist das, was dich rettet, wenn
      am Account etwas schiefgeht. Teilnehmende kann man nicht nachbestellen.

**Was bei Vercel anders ist als auf einem eigenen Server, damit es später nicht überrascht:**
- Es gibt keinen Container, in den man sich einloggt. Alles, was sonst `docker compose exec app ...` wäre
  (Migration, Seed, Dump), läuft von deinem Laptop aus gegen den direkten Verbindungsstring.
- Schema-Änderungen werden **nicht** automatisch mitdeployt. Wenn sich `prisma/schema.prisma` ändert: erst
  `npx prisma migrate deploy` von lokal, dann pushen. Für die Studie ist das Schema eingefroren, also
  einmalig.
- Caddy, HTTPS, Zertifikate, Firewall, Systemupdates: fällt alles weg, macht Vercel.

### I1. Dockerfile (Hetzner-Weg, gebaut und getestet, aktuell nicht in Benutzung)

**Kein `output: 'standalone'` (Abweichung 14.09., bewusst)** - der ursprüngliche Plan hier. Grund: der
Seed-Befehl (`npx prisma db seed`) braucht das Prisma-CLI, `tsx` und die Quelldateien unter `src/` zur
Laufzeit im Container - mit `standalone` wird `node_modules` auf das Nötigste für den *Server* gekürzt, das
CLI wäre weg. Einfacher/robuster für den Anfang: das Runner-Image bekommt das volle `node_modules`, `src/`
und `tsconfig.json` mit, etwas größer, dafür funktioniert `docker compose exec app npx prisma ...` ohne
Zusatzaufwand.

- [x] Mehrstufiges Dockerfile schreiben (deps, builder, runner) - `node:22-bookworm-slim` statt Alpine
      (Alpine/musl bräuchte `binaryTargets` in `schema.prisma` für Prisma, unnötige Komplexität), `openssl`
      per `apt-get` ergänzt (Prisma-Engine braucht es, "slim" bringt es nicht mit)
- [x] Lokal getestet: `docker build -t focusarchitect .` läuft durch

### I2. docker-compose für den Server

Drei Dienste: `app`, `db`, `caddy` - fertig in `docker-compose.yml` im Projekt-Root (nicht mehr nur hier als
Beispiel). Gegenüber dem ursprünglichen Plan zwei Ergänzungen, beide beim lokalen Testen des ganzen Stacks
gefunden:

- `db` hat einen `healthcheck` (`pg_isready`), `app` wartet mit `depends_on: condition: service_healthy`
  darauf - ohne das startet `app` manchmal schneller als Postgres wirklich bereit ist und stürzt beim
  allerersten Start ab.
- `app` hängt `credentials.local.json` read-only ein (`volumes:`). Die Datei enthält echte
  Teilnehmer-Passwörter und darf nie ins Image (steht in `.dockerignore`) - für `prisma db seed` muss sie
  trotzdem zur Laufzeit da sein, deshalb nur eingehängt, nicht kopiert.

`Caddyfile` (ebenfalls fertig im Projekt-Root): `deine-domain.de` durch die echte Domain ersetzen, dann holt
Caddy das HTTPS-Zertifikat automatisch. Du musst sonst nichts konfigurieren.

`.env.example` zeigt, welche zwei Variablen `docker-compose.yml` braucht (`DB_PASSWORD`, `SESSION_SECRET`) -
auf dem Server als `.env` mit echten, **anderen** Werten als lokal anlegen (siehe I2-Schritte unten).

- [ ] Code auf den Server holen (`git clone` mit Deploy-Key, oder per `scp`)
- [ ] `.env` auf dem Server anlegen mit **anderen** Passwörtern als lokal (siehe `.env.example`)
- [ ] `credentials.local.json` auf den Server kopieren (z. B. `scp`), liegt neben `docker-compose.yml`
- [ ] `docker compose up -d --build`
- [ ] `docker compose exec app npx prisma migrate deploy`
- [ ] `docker compose exec app npx prisma db seed`

### I3. Prüfen

- [ ] `https://deine-domain.de` lädt mit gültigem Zertifikat (Schloss im Browser)
- [ ] Login funktioniert
- [ ] Kompletter Ablauf einmal auf dem Server durchgespielt
- [ ] Auf dem Handy geöffnet: bricht das Layout? (Falls Teilnehmende zwischendurch schauen)

### I4. Backup einrichten

```bash
# Skript /home/husin/backup.sh
docker compose exec -T db pg_dump -U focus focusdb > ~/backups/backup_$(date +%F_%H%M).sql
```

- [ ] Skript angelegt und einmal manuell getestet
- [ ] Backup auf deinen Laptop kopiert (`scp`), damit es nicht nur auf dem Server liegt
- [ ] Cronjob für tägliches Backup eingerichtet

> **Fertig, wenn:** Die App läuft öffentlich unter HTTPS und du hast ein Backup auf deinem Laptop.

---

## PHASE J: Probelauf

*Aufwand: 1 Tag*

> **Rundenlänge steht wieder auf 25/5** (erledigt 18.09.). Sie war am selben Tag kurz auf 5 Minuten gesetzt,
> um den Ablauf schnell durchspielen zu können. Falls du noch einmal mit kurzen Zeiten testen willst: nicht
> wieder den Standard im Schema ändern, sondern die Werte direkt auf der Testsitzung setzen
> (`update "Session" set "initialWorkMin"=5 where id='...'`). Dann kann der Studienwert gar nicht erst
> versehentlich stehen bleiben.
>
> **Nach jeder Schemaänderung lokal:** `npx prisma migrate dev`, dann **`npx prisma generate`** und den
> Dev-Server neu starten. `migrate dev` erzeugt den Client nicht zuverlässig mit, und der laufende Server hält
> den alten im Speicher. Genau daran lag es, dass eine geänderte Vorgabe zweimal scheinbar nicht wirkte.
> Bei Vercel passiert das automatisch, weil `npm run build` das `prisma generate` enthält.

- [x] **Rundenlänge wieder auf 25 Minuten gestellt**, in einer frisch angelegten Sitzung geprüft: 25/5 steht
      in der Datenbank
- [ ] Elfte Person (nicht aus den zehn!) macht den kompletten Ablauf durch
- [ ] Du bist erreichbar, aber greifst nicht ein
- [ ] Danach ausführlich fragen: Was war unklar? Was hat gestört? War etwas kaputt?
- [ ] Daten exportiert und geprüft: Ist alles drin, was du brauchst?
- [ ] **PILOT- und ADMIN-Zeilen ausschließen.** Der Export filtert nichts, beide stehen als normale Zeilen in
      `participants.csv`.
- [ ] Falls Excel alles in Spalte A zeigt: nicht die Datei ist kaputt, sondern das Listentrennzeichen von
      Windows steht auf Komma. In Excel über Daten, Aus Text/CSV importieren und Semikolon wählen.
- [ ] **Auf doppelt gesteuerte Sitzungen prüfen** (zwei Fenster gleichzeitig offen, oder Neuladen mitten in
      einer Pause). Diese Abfrage muss leer bleiben, jede Zeile ist eine Runde, die zweimal gesteuert wurde:
      ```sql
      select p.code, e.cycle, e.type, count(*)
      from "Event" e
      join "Session" s on s.id = e."sessionId"
      join "Participant" p on p.id = s."participantId"
      where e.type in ('WORK_STARTED','NUDGE_STAGE_1','BREAK_ACCEPTED','BREAK_SKIPPED',
                       'CYCLE_FEEDBACK_SUBMITTED','BREAK_STARTED')
      group by p.code, e.cycle, e.type
      having count(*) > 1
      order by p.code, e.cycle, e.type;
      ```
      Kommt etwas zurück, ist die Zeile im Export für diese Person nicht verwertbar: bei mehrdeutigen Runden
      nimmt der Export den ersten Treffer und verwirft den Rest stillschweigend, die Zeile sieht danach
      völlig normal aus. Solche Sitzungen gehören wiederholt oder in den Limitationen benannt, nicht
      stillschweigend mitgerechnet.
- [ ] **Fehlende Felder jetzt ergänzen.** Nach der Studie geht das nicht mehr.
- [ ] Gefundene Fehler beheben
- [ ] **Testdaten aus der Produktionsdatenbank löschen, bevor die echten Teilnehmenden anfangen.** Fertiges
      Skript: `scripts/studiendaten-zuruecksetzen.sql`. Vorher eine Sicherung ziehen.
      In PowerShell, im Projektordner. Nicht mit `>` oder `<` arbeiten, die kennt PowerShell nicht wie eine
      Unix-Shell. Stattdessen den Projektordner in den Container einbinden und `-f` benutzen:
      ```powershell
      docker run --rm -v "${PWD}:/arbeit" postgres:16 pg_dump "DIREKTER_NEON_STRING" -f /arbeit/sicherung.sql
      docker run --rm -v "${PWD}:/arbeit" postgres:16 psql "DIREKTER_NEON_STRING" -v ON_ERROR_STOP=1 -f /arbeit/scripts/studiendaten-zuruecksetzen.sql
      ```
      Das ist keine Kosmetik: eine Person hat genau eine Sitzung. Liegt für einen Code schon eine
      Testsitzung mit Einwilligung und Vorbefragung vor, bekommt die echte Person genau diese Sitzung wieder
      vorgesetzt. Sie sieht dann weder Einwilligung noch Vorbefragung, sondern landet direkt im laufenden
      Timer der Testsitzung, und ihre Daten hängen an der alten Sitzung.
- [ ] Frisches Backup ziehen

> **Fertig, wenn:** Eine fremde Person kam ohne deine Hilfe durch den gesamten Ablauf.

---

## PHASE K: Die Studie

*Aufwand: verteilt über ca. 2 Wochen*

Für **jede** der zehn Personen:

- [ ] Vorher: Zugangsdaten geschickt, Termin bestätigt, Dauer angekündigt
- [ ] Kurze Einweisung (5 Min, Nachricht oder Anruf): Was passiert, dass sie an ihrer echten Arbeit arbeiten sollen, dass sie jederzeit abbrechen können
- [ ] Während der Sitzung erreichbar bleiben
- [ ] Danach kurz nachfragen, ob technisch alles lief
- [ ] **Sofort danach Backup ziehen.** Auf dem Vercel/Neon-Weg von deinem Laptop aus, mit dem DIREKTEN
      Neon-String (Docker ist schon da, du brauchst kein lokales Postgres):
      ```
      docker run --rm -v "${PWD}:/arbeit" postgres:16 pg_dump "DIREKTER_NEON_STRING" -f /arbeit/dump_P03_2026-09-20.sql
      ```
      Dateiname mit Teilnehmer-Code und Datum, und die Datei an einen zweiten Ort kopieren (Cloud oder
      zweite Platte). Neon hat eigene Backups, aber die retten dich nicht, wenn am Account selbst etwas
      schiefgeht. **Nach der siebten Person kannst du niemanden nachbestellen.**
- [ ] Kurze Notiz für dich: Auffälligkeiten, Bemerkungen, technische Probleme

Nach allen zehn:

- [ ] Vollständigen Export ziehen
- [ ] Prüfen: zehn Sessions, alle mit PRE und POST, plausible Ereigniszahlen
- [ ] Rohdaten an zwei Orten sichern
- [ ] Server erst abschalten, wenn die Arbeit abgegeben ist

---

## Wenn die Zeit knapp wird

Streichen in dieser Reihenfolge:

1. Schritt-für-Schritt-Anleitungen der Aktivitäten → durch reinen Text ersetzen
2. Admin-Oberfläche → Daten direkt per `psql` exportieren
3. Ton bei Stufe 1 → nur visuell
4. Mobile Optimierung → Hinweis „bitte am Computer nutzen"

**Niemals streichen:** Einwilligung, Ereignis-Log, Datensicherung, Export, Probelauf.

---

## Tägliche Routine ab jetzt

- [ ] Morgens: KI-Logbuch-Eintrag vom Vortag ergänzen
- [ ] Nach jedem funktionierenden Schritt: `git commit`
- [ ] Abends: 20 Minuten an der schriftlichen Arbeit schreiben, egal wie wenig

> Der letzte Punkt ist der wichtigste der ganzen Liste. Holly hat es dir geschrieben, und sie hat recht: Wer erst am Ende schreibt, wird nicht fertig. Die App ist nur das Werkzeug. Bewertet wird der Text.
