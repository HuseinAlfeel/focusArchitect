"use client";

import { useEffect, useRef, useState } from "react";

export type RoundState = "WORK" | "NUDGE" | "ACTIVITY_CHOICE" | "BREAK" | "FEEDBACK";

type PersistedRound = {
  cycle: number;
  state: RoundState;
  endsAt: number;
  activityId: string | null;
  pendingWorkMin: number | null;
  // Der Server-Fallback-Zielzeitpunkt, mit dem diese Runde ursprünglich
  // initialisiert wurde. Dient nur dazu, später zu erkennen, ob sich die
  // zugrunde liegenden Daten (z.B. initialWorkMin, direkt in Prisma Studio
  // bearbeitet) seitdem geändert haben - siehe unten.
  initialFallbackEndsAt: number;
};

function storageKey(sessionId: string) {
  return `focus:round:${sessionId}`;
}

function readPersistedRound(sessionId: string): PersistedRound | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(storageKey(sessionId));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<PersistedRound>;
    if (
      typeof parsed.cycle === "number" &&
      typeof parsed.endsAt === "number" &&
      typeof parsed.state === "string"
    ) {
      return {
        cycle: parsed.cycle,
        state: parsed.state as RoundState,
        endsAt: parsed.endsAt,
        activityId:
          typeof parsed.activityId === "string" ? parsed.activityId : null,
        pendingWorkMin:
          typeof parsed.pendingWorkMin === "number" ? parsed.pendingWorkMin : null,
        // Ältere gespeicherte Einträge (vor dieser Änderung) haben dieses
        // Feld nicht - NaN sorgt dafür, dass der Abgleich unten dann sicher
        // fehlschlägt, statt sich auf einen falschen Wert zu verlassen.
        initialFallbackEndsAt:
          typeof parsed.initialFallbackEndsAt === "number"
            ? parsed.initialFallbackEndsAt
            : NaN,
      };
    }
    return null;
  } catch {
    return null;
  }
}

function writePersistedRound(sessionId: string, round: PersistedRound) {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(storageKey(sessionId), JSON.stringify(round));
}

/**
 * Hält Rundenzustand (WORK/NUDGE/ACTIVITY_CHOICE/BREAK/FEEDBACK), Runden-
 * nummer, Zielzeitpunkt, gewählte Aktivität und die im Kurzfeedback
 * entschiedene nächste Arbeitszeit (pendingWorkMin) fest, gespiegelt in
 * sessionStorage. Ein Reload mitten in der Runde verliert damit nichts: beim
 * nächsten Laden wird aus sessionStorage wiederhergestellt, sofern der
 * gespeicherte Eintrag zur vom Server rekonstruierten Runde (serverCycle)
 * passt.
 *
 * Ausnahme, wichtig fürs Testen: Wurde die Runde noch NICHT über die App
 * selbst verändert (Zustand ist noch exakt der allererste Fallback-Wert)
 * UND weicht der frisch vom Server berechnete Fallback jetzt davon ab, wird
 * der Cache verworfen. Das erkennt zuverlässig den Fall "initialWorkMin
 * direkt in Prisma Studio bearbeitet, danach die Seite neu geladen" - ohne
 * das Reload-Verhalten mitten in einer echten, bereits fortgeschrittenen
 * Runde zu beeinträchtigen (dort weicht der aktuelle Zustand längst vom
 * ursprünglichen Fallback ab, also greift diese Ausnahme dort nicht).
 *
 * Zweite Ausnahme: Ist die im Browser gespeicherte Runde WEITER als das, was
 * der Server gerade rekonstruiert (persisted.cycle > serverCycle), wird die
 * gespeicherte Runde trotzdem benutzt statt verworfen. Der Server erfährt
 * von einer neuen Runde erst, wenn CYCLE_STARTED/WORK_STARTED tatsächlich
 * angekommen sind - die Ereignis-Queue (Phase G) verschickt die aber bewusst
 * leicht verzögert, nicht synchron. Ohne diese Ausnahme würde ein Reload
 * genau in diesem kurzen Fenster den Browser auf den (dann veralteten)
 * Serverstand zurücksetzen, obwohl die neue Runde längst begonnen hatte.
 *
 * Hydration (14.09.): Der allererste Render MUSS auf Server und
 * Client identisch aussehen, sonst wirft React einen Hydration-Mismatch und
 * verwirft den Teilbaum. sessionStorage gibt es aber nur im Browser - der
 * Ausgangszustand hier ist deshalb IMMER der Server-Fallback (WORK), und der
 * eigentliche gespeicherte Stand (z.B. mitten in einer Pause, nach einem
 * Reload) wird erst in einem Effect nachgeladen, der erst nach dem Hydrieren
 * läuft. Kurz sichtbarer "Sprung" von WORK zum echten Stand ist der Preis
 * dafür, aber unauffällig (ein Frame) und ohne Konsolenfehler.
 */
export function useRoundTimer(
  sessionId: string,
  serverCycle: number,
  fallbackState: RoundState,
  fallbackEndsAt: number
) {
  const [round, setRoundState] = useState<PersistedRound>(() => ({
    cycle: serverCycle,
    state: fallbackState,
    endsAt: fallbackEndsAt,
    activityId: null,
    pendingWorkMin: null,
    initialFallbackEndsAt: fallbackEndsAt,
  }));

  const restoredRef = useRef(false);
  useEffect(() => {
    if (restoredRef.current) return;
    restoredRef.current = true;

    const persisted = readPersistedRound(sessionId);
    if (!persisted) return;

    let restored: PersistedRound | null = null;
    if (persisted.cycle > serverCycle) {
      restored = persisted;
    } else if (persisted.cycle === serverCycle) {
      const stillAtFreshStart =
        persisted.state === fallbackState &&
        persisted.endsAt === persisted.initialFallbackEndsAt;
      const dbChangedSinceThen =
        stillAtFreshStart && persisted.initialFallbackEndsAt !== fallbackEndsAt;

      if (!dbChangedSinceThen) {
        restored = persisted;
      }
    }

    if (restored) {
      // Bewusst erst hier, nicht im useState-Initializer: sessionStorage
      // gibt es nur im Browser, ein Restore vor der Hydration wäre genau
      // der Hydration-Mismatch, den dieser Effect vermeiden soll.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRoundState(restored);
    }
  }, [sessionId, serverCycle, fallbackState, fallbackEndsAt]);

  useEffect(() => {
    writePersistedRound(sessionId, round);
  }, [sessionId, round]);

  function setRound(
    state: RoundState,
    endsAt: number,
    options?: {
      activityId?: string | null;
      cycle?: number;
      pendingWorkMin?: number | null;
    }
  ) {
    setRoundState((prev) => ({
      cycle: options?.cycle ?? prev.cycle,
      state,
      endsAt,
      activityId:
        options?.activityId !== undefined ? options.activityId : prev.activityId,
      pendingWorkMin:
        options?.pendingWorkMin !== undefined
          ? options.pendingWorkMin
          : prev.pendingWorkMin,
      initialFallbackEndsAt: prev.initialFallbackEndsAt,
    }));
  }

  return {
    cycle: round.cycle,
    state: round.state,
    endsAt: round.endsAt,
    activityId: round.activityId,
    pendingWorkMin: round.pendingWorkMin,
    setRound,
  };
}
