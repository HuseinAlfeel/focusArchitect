"use client";

// Client-seitige Ereignis-Absicherung (Regel 3, PHASE G in CHECKLIST.md).
// Bisher ging jedes Ereignis per einzelnem fetch() direkt raus - bei einer
// kurzen Netzwerkluecke oder wenn der Tab genau in dem Moment geschlossen
// wird, war das Ereignis weg. Jetzt: Ereignisse landen erst in dieser Queue,
// werden in localStorage gespiegelt, alle 10s im Batch verschickt (plus
// sofort bei Phasenwechseln ueber flushNow) und beim Verlassen der Seite per
// sendBeacon nachgereicht. Ein Modul-Singleton reicht: pro Tab läuft immer
// nur eine Studiensitzung gleichzeitig.

import type { EventType } from "@/lib/events";

type QueuedEvent = {
  sessionId: string;
  type: EventType;
  clientAt: string;
  cycle?: number | null;
  payload?: Record<string, unknown>;
};

const STORAGE_KEY = "focusarchitect:event-queue";
const FLUSH_INTERVAL_MS = 10_000;
// Requests mit keepalive:true (und sendBeacon) sind im Browser auf ca. 64KB
// begrenzt. Ohne Deckel wuerde ein einzelner riesiger Batch (z.B. nach einer
// langen Pause mit vielen aufgelaufenen Ereignissen) als Ganzes fehlschlagen
// und alles dahinter in der Queue mit sich blockieren.
const MAX_BATCH_SIZE = 50;

let queue: QueuedEvent[] = [];
let started = false;
let flushing = false;

function readStorage(): QueuedEvent[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as QueuedEvent[]) : [];
  } catch {
    return [];
  }
}

function writeStorage() {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
  } catch {
    // Speicher voll oder deaktiviert - Queue laeuft trotzdem im Speicher weiter
  }
}

function toWireEvents(events: QueuedEvent[]) {
  return events.map(({ type, clientAt, cycle, payload }) => ({
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
    // Schleife statt einmaligem Versuch: Wenn waehrend eines laufenden
    // Sendevorgangs noch ein weiteres Ereignis dazukommt (z.B. CYCLE_STARTED
    // gefolgt von WORK_STARTED, beides mit flushNow), soll dieselbe flush()-
    // Ausfuehrung es gleich mitnehmen, statt bis zum naechsten 10s-Takt zu
    // warten - sonst kann der Server kurzzeitig einen aelteren Rundenstand
    // sehen als der Browser, was useRoundTimer beim naechsten Reload zum
    // Zurueckfallen auf den (dann veralteten) Serverstand verleiten kann.
    while (queue.length > 0) {
      const batch = queue.slice(0, MAX_BATCH_SIZE);
      const sessionId = batch[0].sessionId;

      let ok: boolean;
      try {
        const response = await fetch("/api/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId, events: toWireEvents(batch) }),
          keepalive: true,
        });
        ok = response.ok;
      } catch {
        ok = false;
      }

      if (!ok) break; // naechster Versuch beim naechsten Tick

      queue = queue.slice(batch.length);
      writeStorage();
    }
  } finally {
    flushing = false;
  }
}

function flushWithBeacon() {
  if (queue.length === 0 || typeof navigator.sendBeacon !== "function") return;

  const sessionId = queue[0].sessionId;

  // sendBeacon ist synchron/fire-and-forget, deshalb hier eine einfache
  // Schleife statt async - genauso in Batches von MAX_BATCH_SIZE, aus dem
  // gleichen Grund wie in flush().
  while (queue.length > 0) {
    const batch = queue.slice(0, MAX_BATCH_SIZE);
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
 * gebliebene Ereignisse aus localStorage zurueck und versucht sie sofort
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
 * Fuer Ereignisse, die eine neue Runde definieren (CYCLE_STARTED,
 * WORK_STARTED, ...): der Aufrufer wartet auf das Ergebnis, bevor er den
 * naechsten Zustand setzt. Grund: schliesst man den Tab komplett (nicht nur
 * Reload) sehr kurz nach einem Rundenwechsel, geht die im Browser gemerkte
 * Rundennummer verloren (sessionStorage ueberlebt das nicht) - ohne diese
 * Bestaetigung kann der Server dann noch die alte Runde kennen, und die App
 * faellt beim naechsten Aufruf faelschlich auf den alten Stand zurueck.
 * Schlaegt der Versuch fehl (z.B. wirklich offline), wird trotzdem in die
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

  const event: QueuedEvent = {
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
    // faellt unten in die Queue
  }

  queue.push(event);
  writeStorage();
  return false;
}
