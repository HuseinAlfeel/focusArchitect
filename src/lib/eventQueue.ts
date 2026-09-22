"use client";

// Client-seitige Ereignis-Absicherung (Regel 3, PHASE G in CHECKLIST.md).
// Bisher ging jedes Ereignis per einzelnem fetch() direkt raus - bei einer
// kurzen Netzwerklücke oder wenn der Tab genau in dem Moment geschlossen
// wird, war das Ereignis weg. Jetzt: Ereignisse landen erst in dieser Queue,
// werden in localStorage gespiegelt, alle 10s im Batch verschickt (plus
// sofort bei Phasenwechseln über flushNow) und beim Verlassen der Seite per
// sendBeacon nachgereicht. Ein Modul-Singleton reicht: pro Tab läuft immer
// nur eine Studiensitzung gleichzeitig.

import type { EventType } from "@/lib/events";

type QueuedEvent = {
  /**
   * Im Browser bei der Entstehung vergebene Kennung (22.09.). Diese
   * Warteschlange liefert "mindestens einmal", nicht "genau einmal": geht die
   * Antwort des Servers verloren, obwohl er den Stapel schon geschrieben hat,
   * bleibt er hier liegen und wird erneut gesendet. Im Probelauf stand
   * dadurch ein TAB_VISIBLE zweimal mit identischen Zeitstempeln im Export.
   * Der Server erkennt die Wiederholung an dieser Kennung und ueberspringt
   * sie. Sie wird genau einmal vergeben und ueberlebt localStorage, sonst
   * bekaeme derselbe Versuch beim naechsten Mal eine neue Kennung und die
   * Erkennung liefe ins Leere.
   */
  clientEventId: string;
  sessionId: string;
  type: EventType;
  clientAt: string;
  cycle?: number | null;
  payload?: Record<string, unknown>;
};

/**
 * `crypto.randomUUID` gibt es nur in sicheren Kontexten (HTTPS und
 * localhost) - beides trifft hier zu, Produktion laeuft auf Vercel per
 * HTTPS. Der Rueckfall ist trotzdem da, weil ein Ereignis ohne Kennung
 * sonst gar nicht erst entstehen koennte und die Absicherung aus Regel 3
 * an genau der Stelle brechen wuerde, an der sie gebraucht wird.
 */
function neueEreignisKennung(): string {
  try {
    if (typeof crypto?.randomUUID === "function") return crypto.randomUUID();
  } catch {
    // faellt unten durch
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}-${Math.random()
    .toString(36)
    .slice(2, 10)}`;
}

const STORAGE_KEY = "focusarchitect:event-queue";
const FLUSH_INTERVAL_MS = 10_000;
// Requests mit keepalive:true (und sendBeacon) sind im Browser auf ca. 64KB
// begrenzt. Ohne Deckel würde ein einzelner riesiger Batch (z.B. nach einer
// langen Pause mit vielen aufgelaufenen Ereignissen) als Ganzes fehlschlagen
// und alles dahinter in der Queue mit sich blockieren.
const MAX_BATCH_SIZE = 50;

let queue: QueuedEvent[] = [];
let started = false;
let flushing = false;

function readStorage(): QueuedEvent[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const gespeichert = raw ? (JSON.parse(raw) as QueuedEvent[]) : [];
    // Eintraege aus der Zeit vor den Kennungen bekommen hier eine - sonst
    // gingen sie beim Senden als ungueltig verloren. Sie koennen dadurch
    // theoretisch doppelt ankommen, aber genau das war vorher der
    // Normalzustand, es wird also nichts schlechter.
    return gespeichert.map((ereignis) =>
      ereignis.clientEventId
        ? ereignis
        : { ...ereignis, clientEventId: neueEreignisKennung() }
    );
  } catch {
    return [];
  }
}

function writeStorage() {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
  } catch {
    // Speicher voll oder deaktiviert - Queue läuft trotzdem im Speicher weiter
  }
}

function toWireEvents(events: QueuedEvent[]) {
  return events.map(({ clientEventId, type, clientAt, cycle, payload }) => ({
    clientEventId,
    type,
    clientAt,
    cycle,
    payload,
  }));
}

async function flush() {
  if (flushing) return;
  flushing = true;

  try {
    // Schleife statt einmaligem Versuch: Wenn während eines laufenden
    // Sendevorgangs noch ein weiteres Ereignis dazukommt (z.B. CYCLE_STARTED
    // gefolgt von WORK_STARTED, beides mit flushNow), soll dieselbe flush()-
    // Ausführung es gleich mitnehmen, statt bis zum nächsten 10s-Takt zu
    // warten - sonst kann der Server kurzzeitig einen älteren Rundenstand
    // sehen als der Browser, was useRoundTimer beim nächsten Reload zum
    // Zurückfallen auf den (dann veralteten) Serverstand verleiten kann.
    while (queue.length > 0) {
      const sessionId = queue[0].sessionId;
      // Nur Ereignisse derselben Sitzung in einen Stapel: der Server
      // schreibt alle Ereignisse eines Aufrufs unter die eine mitgeschickte
      // sessionId. Liegen noch Reste einer aelteren Sitzung in localStorage
      // (harter Browser-Absturz, sendBeacon nicht durchgekommen) und kommen
      // neue dazu, waeren die neuen sonst unter der alten Sitzung gelandet -
      // stille Falschzuordnung, schlimmer als ein Verlust, weil sie im
      // Export nicht auffaellt.
      let end = 0;
      while (
        end < queue.length &&
        end < MAX_BATCH_SIZE &&
        queue[end].sessionId === sessionId
      ) {
        end++;
      }
      const batch = queue.slice(0, end);

      let status: number | null = null;
      try {
        const response = await fetch("/api/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId, events: toWireEvents(batch) }),
          keepalive: true,
        });
        status = response.status;
      } catch {
        status = null; // Netzwerkfehler, spaeter erneut versuchen
      }

      if (status !== null && status >= 200 && status < 300) {
        queue = queue.slice(batch.length);
        writeStorage();
        continue;
      }

      // 400 (ungueltig) und 404 (Sitzung gibt es nicht) nimmt der Server nie
      // an - ewiges Wiederholen wuerde alles blockieren, was dahinter in der
      // Schlange steht, und damit den Rest der Sitzung kosten. Diesen einen
      // Stapel verwerfen und weitermachen rettet mehr Daten, als ihn zu
      // behalten. Alles andere (Netzwerkfehler, 401 mit abgelaufenem Cookie,
      // 5xx) kann beim naechsten Versuch klappen und bleibt liegen.
      if (status === 400 || status === 404) {
        queue = queue.slice(batch.length);
        writeStorage();
        continue;
      }

      break; // nächster Versuch beim nächsten Tick
    }
  } finally {
    flushing = false;
  }
}

function flushWithBeacon() {
  if (queue.length === 0 || typeof navigator.sendBeacon !== "function") return;

  // sendBeacon ist synchron/fire-and-forget, deshalb hier eine einfache
  // Schleife statt async - genauso in Batches von MAX_BATCH_SIZE, aus dem
  // gleichen Grund wie in flush(), und genauso nur eine Sitzung je Stapel
  // (die sessionId wurde hier vorher einmal am Anfang gelesen und dann auf
  // alle Stapel angewendet).
  while (queue.length > 0) {
    const sessionId = queue[0].sessionId;
    let end = 0;
    while (
      end < queue.length &&
      end < MAX_BATCH_SIZE &&
      queue[end].sessionId === sessionId
    ) {
      end++;
    }
    const batch = queue.slice(0, end);
    const blob = new Blob(
      [JSON.stringify({ sessionId, events: toWireEvents(batch) })],
      { type: "application/json" }
    );

    if (!navigator.sendBeacon("/api/events", blob)) break;
    queue = queue.slice(batch.length);
  }

  writeStorage();
}

/**
 * Einmal beim Laden der Seite aufrufen (siehe SessionTimer). Holt liegen
 * gebliebene Ereignisse aus localStorage zurück und versucht sie sofort
 * zu senden, startet danach den 10s-Takt und die Verlassen-die-Seite-Absicherung.
 */
export function startEventQueue() {
  if (started || typeof window === "undefined") return;
  started = true;

  queue = readStorage();
  if (queue.length > 0) void flush();

  window.setInterval(() => void flush(), FLUSH_INTERVAL_MS);
  window.addEventListener("pagehide", flushWithBeacon);
  window.addEventListener("online", () => void flush());
}

export function enqueueEvent(
  sessionId: string,
  type: EventType,
  options?: {
    cycle?: number | null;
    payload?: Record<string, unknown>;
    flushNow?: boolean;
  }
) {
  startEventQueue();

  queue.push({
    clientEventId: neueEreignisKennung(),
    sessionId,
    type,
    clientAt: new Date().toISOString(),
    cycle: options?.cycle,
    payload: options?.payload,
  });
  writeStorage();

  if (options?.flushNow) {
    void flush();
  }
}

/**
 * Für Ereignisse, die eine neue Runde definieren (CYCLE_STARTED,
 * WORK_STARTED, ...): der Aufrufer wartet auf das Ergebnis, bevor er den
 * nächsten Zustand setzt. Grund: schließt man den Tab komplett (nicht nur
 * Reload) sehr kurz nach einem Rundenwechsel, geht die im Browser gemerkte
 * Rundennummer verloren (sessionStorage überlebt das nicht) - ohne diese
 * Bestätigung kann der Server dann noch die alte Runde kennen, und die App
 * fällt beim nächsten Aufruf fälschlich auf den alten Stand zurück.
 * Schlägt der Versuch fehl (z.B. wirklich offline), wird trotzdem in die
 * normale Queue eingereiht statt das Ereignis zu verlieren - der Aufrufer
 * geht dann einfach mit dem Risiko einer kurzen Inkonsistenz weiter, anstatt
 * die Bedienung zu blockieren.
 */
export async function sendEventNow(
  sessionId: string,
  type: EventType,
  options?: { cycle?: number | null; payload?: Record<string, unknown> }
): Promise<boolean> {
  startEventQueue();

  // Dieselbe Kennung fuer den Direktversuch UND den Rueckfall in die
  // Warteschlange weiter unten. Genau hier entstanden Doppelungen: der
  // Server schreibt das Ereignis, die Antwort geht verloren, der Aufrufer
  // landet im catch und reiht dasselbe Ereignis noch einmal ein.
  const event: QueuedEvent = {
    clientEventId: neueEreignisKennung(),
    sessionId,
    type,
    clientAt: new Date().toISOString(),
    cycle: options?.cycle,
    payload: options?.payload,
  };

  try {
    const response = await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, events: toWireEvents([event]) }),
      keepalive: true,
    });
    if (response.ok) return true;
  } catch {
    // fällt unten in die Queue
  }

  queue.push(event);
  writeStorage();
  return false;
}
