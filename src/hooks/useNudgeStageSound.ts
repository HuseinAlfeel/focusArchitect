"use client";

import { useEffect, useRef } from "react";
import { NUDGE_STAGE_SOUND, playNudgeSound } from "@/lib/nudgeSound";
import { enqueueEvent } from "@/lib/eventQueue";
import type { NudgeStage } from "@/hooks/useNudgeStage";

// Ein Ton je Stufe, direkt an useNudgeStage gekoppelt - kein eigener
// Zeitplan mehr, keine Wiederholung (Betreuung, 17.09.: sieben Toene in
// einer Sequenz waren mehr, als die Eskalation eigentlich braucht; die
// Eskalation soll ueber Deutlichkeit laufen, nicht ueber Wiederholung).
// Stufe 0 bleibt bewusst tonlos - der Sinn dieser Stufe ist ein kaum
// bewusst wahrnehmbarer visueller Uebergang, ein Ton wuerde daraus eine
// hoerbare Vorwarnung machen, das ist etwas anderes als beabsichtigt.
//
// Welcher Ton zu welcher Stufe gehoert und wie laut, steht in
// NUDGE_STAGE_SOUND in lib/nudgeSound.ts - dort, damit /admin/sound-check
// dieselbe Quelle anzeigen kann und beides nicht auseinanderlaufen kann.

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

    const { intensity, character } = NUDGE_STAGE_SOUND[nudgeStage];
    playNudgeSound(intensity, character);
    enqueueEvent(sessionId, "NUDGE_SOUND_PLAYED", {
      payload: { stage: nudgeStage, intensity, character },
    });
  }, [active, nudgeStage, sessionId]);
}
