"use client";

import { useEffect, useRef } from "react";
import { playNudgeSound, type NudgeSoundCharacter } from "@/lib/nudgeSound";
import { enqueueEvent } from "@/lib/eventQueue";
import type { NudgeStage } from "@/hooks/useNudgeStage";

// Ein Ton je Stufe, direkt an useNudgeStage gekoppelt - kein eigener
// Zeitplan mehr, keine Wiederholung (Betreuung, 17.09.: sieben Toene in
// einer Sequenz waren mehr, als die Eskalation eigentlich braucht; die
// Eskalation soll ueber Deutlichkeit laufen, nicht ueber Wiederholung).
// Stufe 0 bleibt bewusst tonlos - der Sinn dieser Stufe ist ein kaum
// bewusst wahrnehmbarer visueller Uebergang, ein Ton wuerde daraus eine
// hoerbare Vorwarnung machen, das ist etwas anderes als beabsichtigt.
const STAGE_SOUND: Record<1 | 2 | 3, { intensity: number; character: NudgeSoundCharacter }> = {
  1: { intensity: 0.35, character: "soft-sine" },
  2: { intensity: 0.65, character: "soft-bell" },
  3: { intensity: 0.9, character: "rising-sweep" },
};

export function useNudgeStageSound(
  nudgeStage: NudgeStage,
  sessionId: string,
  active: boolean
) {
  const firedRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    if (!active) {
      firedRef.current = new Set();
      return;
    }
    if (nudgeStage === null || nudgeStage === 0) return;
    if (firedRef.current.has(nudgeStage)) return;
    firedRef.current.add(nudgeStage);

    const { intensity, character } = STAGE_SOUND[nudgeStage];
    playNudgeSound(intensity, character);
    enqueueEvent(sessionId, "NUDGE_SOUND_PLAYED", {
      payload: { stage: nudgeStage, intensity, character },
    });
  }, [active, nudgeStage, sessionId]);
}
