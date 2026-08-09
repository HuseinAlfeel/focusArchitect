"use client";

import { useEffect, useState } from "react";

export type RoundState = "WORK" | "NUDGE" | "ACTIVITY_CHOICE" | "BREAK" | "FEEDBACK";

type PersistedRound = {
  cycle: number;
  state: RoundState;
  endsAt: number;
  activityId: string | null;
  pendingWorkMin: number | null;
  // Der Server-Fallback-Zielzeitpunkt, mit dem diese Runde urspruenglich
  // initialisiert wurde. Dient nur dazu, spaeter zu erkennen, ob sich die
  // zugrunde liegenden Daten (z.B. initialWorkMin, direkt in Prisma Studio
  // bearbeitet) seitdem geaendert haben - siehe unten.
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
        // Aeltere gespeicherte Eintraege (vor dieser Aenderung) haben dieses
        // Feld nicht - NaN sorgt dafuer, dass der Abgleich unten dann sicher
        // fehlschlaegt, statt sich auf einen falschen Wert zu verlassen.
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
 * Haelt Rundenzustand (WORK/NUDGE/ACTIVITY_CHOICE/BREAK/FEEDBACK), Runden-
 * nummer, Zielzeitpunkt, gewaehlte Aktivitaet und die im Kurzfeedback
 * entschiedene naechste Arbeitszeit (pendingWorkMin) fest, gespiegelt in
 * sessionStorage. Ein Reload mitten in der Runde verliert damit nichts: beim
 * naechsten Laden wird aus sessionStorage wiederhergestellt, sofern der
 * gespeicherte Eintrag zur vom Server rekonstruierten Runde (serverCycle)
 * passt.
 *
 * Ausnahme, wichtig fuers Testen: Wurde die Runde noch NICHT ueber die App
 * selbst veraendert (Zustand ist noch exakt der allererste Fallback-Wert)
 * UND weicht der frisch vom Server berechnete Fallback jetzt davon ab, wird
 * der Cache verworfen. Das erkennt zuverlaessig den Fall "initialWorkMin
 * direkt in Prisma Studio bearbeitet, danach die Seite neu geladen" - ohne
 * das Reload-Verhalten mitten in einer echten, bereits fortgeschrittenen
 * Runde zu beeintraechtigen (dort weicht der aktuelle Zustand laengst vom
 * urspruenglichen Fallback ab, also greift diese Ausnahme dort nicht).
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
      const stillAtFreshStart =
        persisted.state === fallbackState &&
        persisted.endsAt === persisted.initialFallbackEndsAt;
      const dbChangedSinceThen =
        stillAtFreshStart && persisted.initialFallbackEndsAt !== fallbackEndsAt;

      if (!dbChangedSinceThen) {
        return persisted;
      }
    }

    return {
      cycle: serverCycle,
      state: fallbackState,
      endsAt: fallbackEndsAt,
      activityId: null,
      pendingWorkMin: null,
      initialFallbackEndsAt: fallbackEndsAt,
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
