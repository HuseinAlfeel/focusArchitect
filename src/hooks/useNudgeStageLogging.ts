"use client";

import { useEffect, useRef } from "react";
import type { NudgeStage } from "@/hooks/useNudgeStage";
import { enqueueEvent } from "@/lib/eventQueue";

/**
 * Protokolliert NUDGE_STAGE_0 bis NUDGE_STAGE_3 genau einmal pro Zielzeitpunkt,
 * sobald die jeweilige Stufe erstmals erreicht wird - das ist die
 * Kernkennzahl der Arbeit ("bei welcher Stufe reagieren Menschen
 * tatsaechlich?"). Nach einem Snoozen/Ueberspringen (neuer endsAt) koennen
 * dieselben Stufennummern fuer den neuen Versuch erneut protokolliert werden.
 *
 * Jedes Ereignis bekommt zusaetzlich `tabVisibleAtNudge` im Payload - ob der
 * Tab in genau diesem Moment sichtbar war. Zusammen mit TAB_VISIBLE aus
 * useTabVisibilityLogging.ts ergibt das im Export die Reaktionslatenz: wie
 * lange, bis eine Person nach einem Hinweis ueberhaupt zurueckkommt (siehe
 * ENTSCHEIDUNGEN.md, ergaenzt Husin 25.08.).
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

    enqueueEvent(sessionId, `NUDGE_STAGE_${stage}`, {
      cycle,
      payload: { tabVisibleAtNudge: document.visibilityState === "visible" },
    });
  }, [enabled, stage, sessionId, cycle]);
}
