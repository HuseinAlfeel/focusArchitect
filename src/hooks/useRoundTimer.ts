"use client";

import { useEffect, useState } from "react";

export type RoundState = "WORK" | "NUDGE" | "ACTIVITY_CHOICE" | "BREAK" | "FEEDBACK";

type PersistedRound = {
  cycle: number;
  state: RoundState;
  endsAt: number;
  activityId: string | null;
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
 * Haelt Rundenzustand (WORK/NUDGE/ACTIVITY_CHOICE/BREAK/FEEDBACK), Zielzeit-
 * punkt und gewaehlte Aktivitaet fest, gespiegelt in sessionStorage. Ein
 * Reload mitten in der Runde verliert damit nichts: beim naechsten Laden
 * wird aus sessionStorage wiederhergestellt, sofern der gespeicherte
 * Eintrag zur aktuellen Runde (cycle, vom Server vorgegeben) passt. Gehoert
 * der gespeicherte Eintrag zu einer aelteren Runde, wird er verworfen und
 * durch den vom Server vorgegebenen Startwert ersetzt.
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
    };
  });

  useEffect(() => {
    writePersistedRound(sessionId, round);
  }, [sessionId, round]);

  function setRound(
    state: RoundState,
    endsAt: number,
    activityId: string | null = round.activityId
  ) {
    setRoundState({ cycle: serverCycle, state, endsAt, activityId });
  }

  return {
    state: round.state,
    endsAt: round.endsAt,
    activityId: round.activityId,
    setRound,
  };
}
