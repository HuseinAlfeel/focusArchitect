"use client";

import { useEffect, useRef } from "react";
import type { NudgeStage } from "@/hooks/useNudgeStage";

/**
 * Protokolliert NUDGE_STAGE_0 bis NUDGE_STAGE_3 genau einmal pro Zielzeitpunkt,
 * sobald die jeweilige Stufe erstmals erreicht wird - das ist die
 * Kernkennzahl der Arbeit ("bei welcher Stufe reagieren Menschen
 * tatsaechlich?"). Nach einem Snoozen/Ueberspringen (neuer endsAt) koennen
 * dieselben Stufennummern fuer den neuen Versuch erneut protokolliert werden.
 */
export function useNudgeStageLogging(
  sessionId: string,
  cycle: number,
  endsAt: number,
  stage: NudgeStage,
  enabled: boolean
) {
  const loggedRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    loggedRef.current = new Set();
  }, [endsAt]);

  useEffect(() => {
    if (!enabled || stage === null || loggedRef.current.has(stage)) return;
    loggedRef.current.add(stage);

    void fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        events: [
          {
            type: `NUDGE_STAGE_${stage}`,
            clientAt: new Date().toISOString(),
            cycle,
          },
        ],
      }),
      keepalive: true,
    });
  }, [enabled, stage, sessionId, cycle]);
}
