"use client";

import { useEffect, useState } from "react";

export type RoundState = "WORK" | "NUDGE" | "ACTIVITY_CHOICE" | "BREAK" | "FEEDBACK";

type PersistedRound = {
  cycle: number;
  state: RoundState;
  endsAt: number;
  activityId: string | null;
  pendingWorkMin: number | null;
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
 * Haelt Rundenzustand (WORK/NUDGE/ACTIVITY_CHOICE/BREAK/FEEDBACK), Runden-
 * nummer, Zielzeitpunkt, gewaehlte Aktivitaet und die im Kurzfeedback
 * entschiedene naechste Arbeitszeit (pendingWorkMin) fest, gespiegelt in
 * sessionStorage. Ein Reload mitten in der Runde verliert damit nichts: beim
 * naechsten Laden wird aus sessionStorage wiederhergestellt, sofern der
 * gespeicherte Eintrag zur vom Server rekonstruierten Runde (serverCycle)
 * passt. Gehoert der gespeicherte Eintrag zu einer aelteren Runde, wird er
 * verworfen und durch den vom Server vorgegebenen Startwert ersetzt.
 *
 * Die Rundennummer selbst lebt danach im Hook-Zustand (nicht mehr nur als
 * externe Prop): `setRound(..., { cycle })` zaehlt sie weiter, wenn eine
 * neue Runde beginnt.
 */
export function useRoundTimer(
  sessionId: string,
  serverCycle: number,
  fallbackState: RoundState,
  fallbackEndsAt: number
) {
  const [round, setRoundState] = useState<PersistedRound>(() => {
    const persisted = readPersistedRound(sessionId);
    if (persisted && persisted.cycle === serverCycle) {
      return persisted;
    }
    return {
      cycle: serverCycle,
      state: fallbackState,
      endsAt: fallbackEndsAt,
      activityId: null,
      pendingWorkMin: null,
    };
  });

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
