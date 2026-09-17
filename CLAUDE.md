# FocusArchitect

Prototyp zur Bachelorarbeit von Husin Alfil am Hasso-Plattner-Institut (Fachgebiet Digital Health, Betreuung Holly Ambrozic McKee und Dr. Orhan Konak).

**Vollständige Spezifikation: `docs/SPEZIFIKATION.md`**
**Bau-Reihenfolge: `docs/CHECKLIST.md`**

Beide vor größeren Änderungen lesen.

---

## Worum es geht

Die Anwendung untersucht, wie Software zu gesunden Bildschirmpausen anregen kann, ohne die Arbeit zu stören. Zehn Teilnehmende nutzen sie an ihrer eigenen, echten Arbeit. Die Sitzung hat kein festes Ende (Änderung 25.08.) - sie beenden selbst über den vorhandenen Knopf, sobald sie fertig sind.

**Leitprinzip: Das ist ein Messinstrument, keine Produkt-App.**

Jede Funktion muss entweder Teil der untersuchten Intervention sein oder Daten liefern, die eine Forschungsfrage beantworten. Alles andere wird nicht gebaut. Keine Statistiken für Nutzende, keine Einstellungsseite, keine Gamification, keine Punkte, keine Level, keine Erfolgsserien.

Wenn eine vorgeschlagene Funktion nichts misst und nicht Teil der Intervention ist: nicht bauen, sondern nachfragen.

---

## Tech-Stack

- Next.js 16, App Router, TypeScript
- Tailwind CSS
- PostgreSQL mit Prisma
- Auth: eigene Credentials-Lösung mit signiertem httpOnly-Cookie (`jose`, `bcryptjs`). Kein NextAuth, es gibt nur acht feste Accounts ohne Registrierung.
- Deployment (Entscheidung 17.09.): **Vercel** für die App (Region Frankfurt) und **Neon** für Postgres (Region Frankfurt, damit die Daten wie in der Einwilligung zugesagt in Deutschland liegen). Migration und Seed laufen von Husins Laptop gegen die direkte Neon-Verbindung, nicht bei Vercel - `prisma/seed.ts` braucht `credentials.local.json` mit den echten Teilnehmer-Passwörtern. `npm run build` enthält deshalb `prisma generate`, weil `src/generated/prisma` nicht im Git liegt.
- Der ursprüngliche Weg (Docker Compose auf Hetzner mit Caddy) ist vollständig gebaut und getestet und bleibt im Repo (`Dockerfile`, `docker-compose.yml`, `Caddyfile`, CHECKLIST.md I1–I5) - als Option für später, aktuell nicht in Benutzung.

---

## Harte Regeln

1. **Timer immer über Zielzeitpunkt, niemals durch Hochzählen.**
   Browser drosseln `setInterval` in inaktiven Tabs. Speichere `endsAt = Date.now() + dauer` und berechne die Restzeit bei jedem Render neu. Sonst sind alle Zeitmessungen der Studie unbrauchbar.

2. **Keine Datenerhebung vor der Einwilligung.**
   Erst nach `consentAt` werden Studiendaten gespeichert.

3. **Ereignisse gehen nie verloren.**
   Client-Queue, gespiegelt in `localStorage`, Batch-Versand alle 10 Sekunden und bei jedem Phasenwechsel, `navigator.sendBeacon` beim Verlassen der Seite. Beim Laden nachsenden, was liegengeblieben ist.

4. **Jedes Ereignis bekommt zwei Zeitstempel:** `clientAt` (Browser) und `at` (Server).

5. **Passwörter niemals im Klartext.** bcrypt, immer.

6. **Keine Geheimnisse ins Git.** `.env` steht in `.gitignore`.

7. **Die Arbeitsphase ist bewusst fast leer.** Nur die Restzeit, klein und kontrastarm. Wenn dieser Bildschirm ablenkt, widerlegt die App ihre eigene These.

8. **Der Pausenhinweis eskaliert sanft, niemals aggressiv.** Kein Rot, keine Ausrufezeichen, keine schnellen Animationen. Vier Stufen, jede protokolliert.

9. **Immer heller Modus, nie automatisch dunkel.** `prefers-color-scheme: dark` würde die visuelle Gestaltung unkontrolliert je nach Systemeinstellung der Teilnehmenden verändern - bei einer Studie über genau diese Gestaltung eine Störvariable. In `globals.css` per `@custom-variant dark (&:where(.dark, .dark *))` deaktiviert, `color-scheme: light` gesetzt.

---

## Der abgestufte Hinweis (Kernfunktion)

| Stufe | Zeitpunkt | Gestaltung |
|---|---|---|
| 0 | T minus 2 Min | Hintergrund wandert über CSS-Transition (60s) nach Beige, Zifferfarbe des Timers zieht mit |
| 1 | 0:00 | Weiter Beige, kleine ruhige Karte unten rechts mit kurzer Einblendbewegung, ein leiser Ton |
| 2 | +2 Min | Hintergrund wandert weiter zu gedämpftem Bernstein, Karte größer, rückt näher zur Mitte, sanftes Pulsieren |
| 3 | +5 Min | Hintergrund wandert weiter zu gedämpftem Terrakotta, ruhiges zentriertes Fenster, drei Optionen (Pause starten / Noch 5 Minuten / Überspringen) |

Bei Reaktion protokollieren, **bei welcher Stufe** und nach wie vielen Sekunden. Das ist das wichtigste Ergebnis der Arbeit.

---

## Arbeitsweise

- Immer **einen** Schritt der Checkliste bearbeiten, nicht mehrere gleichzeitig.
- Nach jedem funktionierenden Schritt committen.
- Beim Testen von Timer und Hinweisstufen kurze Zeiten verwenden (1 Min statt 25), aber die Standardwerte im Code bei 25/5 belassen.
- Bei Unklarheiten über Studieninhalte (Fragebogen-Items, Einwilligungstext) nicht raten, sondern Platzhalter setzen und nachfragen. Diese Inhalte werden mit der Betreuung abgestimmt.

---

## Offen, noch nicht entschieden

- Genauer Wortlaut von Einwilligung und Datenschutzerklärung
- Endgültige Fragebogen-Items (eventuell zusätzlich NASA-TLX oder UEQ-S)
- Ob die Durchführung ortsunabhängig oder begleitet stattfindet

Für diese Punkte Platzhalter verwenden und die Struktur so bauen, dass Texte und Items später leicht austauschbar sind (eigene Datei, nicht im JSX verstreut).
