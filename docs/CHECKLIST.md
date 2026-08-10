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
- [ ] **A6. Sechs Teilnehmende terminiert.** Feste Termine im Kalender, nicht nur „hat zugesagt".
- [ ] **A7. Siebte Person für den Probelauf** angefragt.

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

### F1. Einwilligung (halber Tag)

- [ ] Seite `/study/consent` mit dem abgestimmten Text
- [ ] Checkbox, Knopf erst dann aktiv
- [ ] `POST /api/session` legt Session an, `consentAt` wird gesetzt
- [ ] Ereignis `CONSENT_GIVEN` protokolliert
- [ ] Ohne Einwilligung kein Weiterkommen

> **Wichtig:** Vor diesem Punkt werden keine Studiendaten gespeichert. Nur Login und Sessionanlage.

### F2. Vorbefragung (halber Tag)

- [ ] Seite `/study/pre` mit den Items V1 bis V7
- [ ] Skalen als anklickbare Buttons 1 bis 7, nicht als Slider (Slider verleiten zur Mitte)
- [ ] Validierung: alle Pflichtfelder ausgefüllt
- [ ] `POST /api/survey` mit `phase: "PRE"`
- [ ] Ereignis `SURVEY_PRE_SUBMITTED`

### F3. Sitzungsstart (2 Stunden)

- [ ] Seite `/study/start`: Freitextfeld für die geplante Tätigkeit
- [ ] Anzeige der Startwerte 25/5 mit Hinweis auf spätere Anpassbarkeit
- [ ] `PATCH /api/session/:id/start`
- [ ] Ereignisse `SESSION_STARTED`, `CYCLE_STARTED`, `WORK_STARTED`

### F4. Timer-Logik (1 Tag, kritisch)

- [ ] Hook `useCountdown(endsAt: number)` schreiben
- [ ] **Zielzeitpunkt speichern, nicht Restzeit hochzählen** (sonst zerstört Browser-Drosselung deine Messung)
- [ ] Zielzeitpunkt in `sessionStorage` sichern, damit ein Reload die Runde nicht zerstört
- [ ] Rundenzustand: `WORK | NUDGE | ACTIVITY_CHOICE | BREAK | FEEDBACK`

**Testen:**
- [ ] Tab 5 Minuten in den Hintergrund legen, zurückkommen: Anzeige stimmt sofort
- [ ] Seite neu laden mitten in der Runde: Zustand bleibt erhalten

### F5. Arbeitsphase (2 Stunden)

- [ ] Seite `/study/session`, bewusst fast leer
- [ ] Nur Restzeit, klein, geringer Kontrast
- [ ] Knopf „Sitzung beenden" klein am Rand
- [ ] Page Visibility API: `TAB_HIDDEN` und `TAB_VISIBLE` protokollieren

### F6. Der abgestufte Hinweis (1 Tag, das Herzstück)

- [ ] **Stufe 0** bei T minus 2 Min: Hintergrund wandert über CSS-Transition (Dauer 60s) minimal ins Wärmere
- [ ] **Stufe 1** bei 0:00: Farbe vollendet, kleine ruhige Karte unten rechts, optional ein einzelner leiser Ton
- [ ] **Stufe 2** bei plus 2 Min: Karte etwas größer, sehr langsames Pulsieren
- [ ] **Stufe 3** bei plus 5 Min: ruhiges zentriertes Fenster, zwei Optionen. Kein Rot, kein Ausrufezeichen
- [ ] Jede erreichte Stufe protokollieren: `NUDGE_STAGE_0` bis `NUDGE_STAGE_3`
- [ ] Bei Reaktion protokollieren, **bei welcher Stufe** und nach wie vielen Sekunden:
      `BREAK_ACCEPTED`/`BREAK_SKIPPED` mit `payload: { stage, secondsAfterEnd }`
- [ ] Optionen: Pause starten / überspringen — **kein** "5 Min verschieben" mehr (Husin, 09.08.: blindes
      Verlängern der laufenden Runde entfernt; Anpassungen laufen ausschließlich über das Kurzfeedback F8)
- [ ] "Überspringen" umgeht wirklich Aktivitätsauswahl und Pause (direkt weiter zur nächsten Arbeitsrunde nach
      dem Kurzfeedback) — nicht nur ein anderer Ereignisname bei sonst gleichem Ablauf wie "Pause starten"
- [ ] Zusätzlich zur Ton-Eskalation: solange nicht reagiert wurde, zeigt der Bildschirm eine **Überzeit**-Anzeige
      (`+MM:SS`, seit wann der Zielzeitpunkt überschritten ist), damit die Anzeige nach Ablauf nicht einfach leer bleibt
- [ ] Eigene Ton-Eskalation (mit Husin abgestimmt, Zeitplan siehe `useNudgeSoundSchedule.ts`): −30s/0s/+1min/+2min
      sanfter Sinuston steigender Lautstärke, ab +3min pulsierender Ton jede weitere Minute — protokolliert als
      `NUDGE_SOUND_PLAYED`

> Das ist die Funktion, aus der dein wichtigstes Ergebnis kommt. Nimm dir hier Zeit und teste alle vier Stufen mit verkürzten Zeiten (z. B. 1 Min statt 25).

### F8. Kurzfeedback und Anpassung (halber Tag)

> **Reihenfolge korrigiert (Husin, 09.08.):** Das Kurzfeedback kommt jetzt **direkt nach der Reaktion auf den
> Pausenhinweis**, noch vor Aktivitätsauswahl und Pause — nicht danach. Die Frage "war der Zeitpunkt passend"
> bewertet die gerade zu Ende gegangene Arbeitsphase, das lässt sich direkt danach am zuverlässigsten beantworten.
> Die hier entschiedene neue Arbeitszeit wird erst nach der Pause tatsächlich angewendet (F7 folgt danach).

- [ ] Drei Knöpfe: zu früh / passend / zu spät
- [ ] Bei zu früh oder zu spät: minus 10 / minus 5 / plus 5 / plus 10
- [ ] Optionales Freitextfeld
- [ ] `POST /api/cycle-feedback`, Ereignisse `INTERVAL_ADJUSTED`, `CYCLE_FEEDBACK_SUBMITTED`
- [ ] Neuer Wert wirkt auf die nächste Runde und wird angezeigt ("Nächste Runde: X Minuten")

### F7. Aktivitätsauswahl und Pause (1 Tag)

- [ ] Vier gleichwertig aussehende Optionen: Augen, Nacken, Bewegung, keine Aktivität
- [ ] `ACTIVITY_SELECTED` oder `ACTIVITY_SKIPPED` protokollieren
- [ ] Pausenbildschirm mit Restzeit, ruhig gestaltet
- [ ] Bei gewählter Aktivität: Schritt-für-Schritt-Anleitung, ein Schritt je Bildschirm, `ACTIVITY_STEP_DONE`
- [ ] Letzte 10 Sekunden der Pause: leiser Klopf-Countdown, bei 0 ein klares Signal ("Pause vorbei") — vorher
      endete die Pause komplett unbemerkt, wenn man nicht auf den Bildschirm schaute (Husin, 09.08.)
- [ ] Am Ende **kein** automatischer Rücksprung, sondern Knopf „Sitzung starten" (die im F8-Kurzfeedback
      entschiedene Arbeitszeit für die nächste Runde wird hier angewendet)
- [ ] `BREAK_STARTED`, `BREAK_ENDED`
- [ ] Danach automatisch nächste Runde starten (`CYCLE_STARTED`, `WORK_STARTED`)

### F9. Nachbefragung und Abschluss (halber Tag)

- [ ] Seite `/study/post` mit N1 bis N10
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
      (dabei einen echten Bug gefunden und behoben, Husin 10.08.: Reload waehrend die Queue noch
      unterwegs war, konnte die Runde auf den letzten dem Server bekannten Stand zuruecksetzen)
- [ ] Browser mitten in der Sitzung schließen, wieder öffnen: nichts verloren

> **Fertig, wenn:** Du hast bewusst versucht, Daten zu verlieren, und es ist dir nicht gelungen.

---

## PHASE H: Export

*Aufwand: halber Tag. Vor der Studie bauen, nicht danach!*

- [ ] Seite `/admin`, nur für Rolle ADMIN
- [ ] Übersicht: alle Sessions, Status, Anzahl Ereignisse
- [ ] `GET /api/admin/export` erzeugt drei CSV-Dateien:
      - `participants.csv`: eine Zeile je Person, Vor- und Nachwerte nebeneinander
      - `cycles.csv`: eine Zeile je Runde
      - `events.csv`: eine Zeile je Ereignis
- [ ] Semikolon als Trennzeichen und UTF-8 mit BOM, sonst zerlegt Excel deine Umlaute
- [ ] Export einmal mit Testdaten heruntergeladen und in Excel geöffnet

> **Fertig, wenn:** Du hast eine CSV vor dir, mit der du wirklich rechnen könntest.

---

## PHASE I: Deployment auf Hetzner

*Aufwand: 1 Tag*

### I1. Dockerfile

In `next.config.js` ergänzen: `output: 'standalone'`

- [ ] Mehrstufiges Dockerfile schreiben (deps, builder, runner)
- [ ] Lokal testen: `docker build -t focusarchitect .` läuft durch

### I2. docker-compose für den Server

Drei Dienste: `app`, `db`, `caddy`

```yaml
services:
  db:
    image: postgres:16
    restart: unless-stopped
    environment:
      POSTGRES_USER: focus
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: focusdb
    volumes:
      - pgdata:/var/lib/postgresql/data

  app:
    build: .
    restart: unless-stopped
    environment:
      DATABASE_URL: postgresql://focus:${DB_PASSWORD}@db:5432/focusdb
      SESSION_SECRET: ${SESSION_SECRET}
      NODE_ENV: production
    depends_on:
      - db

  caddy:
    image: caddy:2
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile
      - caddy_data:/data

volumes:
  pgdata:
  caddy_data:
```

`Caddyfile`:
```
deine-domain.de {
    reverse_proxy app:3000
}
```

Caddy holt das HTTPS-Zertifikat automatisch. Du musst nichts konfigurieren.

- [ ] Code auf den Server holen (`git clone` mit Deploy-Key, oder per `scp`)
- [ ] `.env` auf dem Server anlegen mit **anderen** Passwörtern als lokal
- [ ] `docker compose up -d --build`
- [ ] `npx prisma migrate deploy` im App-Container ausführen
- [ ] Seed auf dem Server ausführen (Accounts anlegen)

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

- [ ] Siebte Person (nicht aus den sechs!) macht den kompletten Ablauf durch
- [ ] Du bist erreichbar, aber greifst nicht ein
- [ ] Danach ausführlich fragen: Was war unklar? Was hat gestört? War etwas kaputt?
- [ ] Daten exportiert und geprüft: Ist alles drin, was du brauchst?
- [ ] **Fehlende Felder jetzt ergänzen.** Nach der Studie geht das nicht mehr.
- [ ] Gefundene Fehler beheben
- [ ] Testdaten aus der Datenbank löschen (oder als PILOT markiert lassen und bei der Auswertung ausschließen)
- [ ] Frisches Backup ziehen

> **Fertig, wenn:** Eine fremde Person kam ohne deine Hilfe durch den gesamten Ablauf.

---

## PHASE K: Die Studie

*Aufwand: verteilt über ca. 2 Wochen*

Für **jede** der sechs Personen:

- [ ] Vorher: Zugangsdaten geschickt, Termin bestätigt, Dauer angekündigt
- [ ] Kurze Einweisung (5 Min, Nachricht oder Anruf): Was passiert, dass sie an ihrer echten Arbeit arbeiten sollen, dass sie jederzeit abbrechen können
- [ ] Während der Sitzung erreichbar bleiben
- [ ] Danach kurz nachfragen, ob technisch alles lief
- [ ] **Sofort danach Backup ziehen**
- [ ] Kurze Notiz für dich: Auffälligkeiten, Bemerkungen, technische Probleme

Nach allen sechs:

- [ ] Vollständigen Export ziehen
- [ ] Prüfen: sechs Sessions, alle mit PRE und POST, plausible Ereigniszahlen
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
