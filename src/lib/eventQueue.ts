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
  if (flushing || queue.length === 0) return;
  flushing = true;

  const batch = queue.slice();
  const sessionId = batch[0].sessionId;

  try {
    const response = await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, events: toWireEvents(batch) }),
      keepalive: true,
    });

    if (response.ok) {
      queue = queue.slice(batch.length);
      writeStorage();
    }
  } catch {
    // bleibt in der Queue, naechster Versuch beim naechsten Tick
  } finally {
    flushing = false;
  }
}

function flushWithBeacon() {
  if (queue.length === 0 || typeof navigator.sendBeacon !== "function") return;

  const sessionId = queue[0].sessionId;
  const blob = new Blob(
    [JSON.stringify({ sessionId, events: toWireEvents(queue) })],
    { type: "application/json" }
  );

  if (navigator.sendBeacon("/api/events", blob)) {
    queue = [];
    writeStorage();
  }
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
