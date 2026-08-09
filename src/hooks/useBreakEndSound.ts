"use client";

import { useEffect, useRef } from "react";
import { playNudgeSound } from "@/lib/nudgeSound";

const COUNTDOWN_SECONDS = 10;

/**
 * Kuendigt das Ende der Pause akustisch an: in den letzten 10 Sekunden ein
 * leiser Klopf-Ton pro Sekunde ("soft-mallet"), bei 0 ein klares, deutliches
 * Signal ("double-chime") - vorher gab es hier gar keinen Ton, das Ende der
 * Pause ging komplett unbemerkt vorbei.
 */
export function useBreakEndSound(breakEndsAt: number, active: boolean) {
  const firedRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    if (!active) return;
    firedRef.current = new Set();

    const interval = window.setInterval(() => {
      const remainingMs = breakEndsAt - Date.now();

      if (remainingMs <= 0) {
        if (!firedRef.current.has(0)) {
          firedRef.current.add(0);
          playNudgeSound(0.9, "double-chime");
        }
        return;
      }

      const secondsLeft = Math.ceil(remainingMs / 1000);
      if (secondsLeft <= COUNTDOWN_SECONDS && !firedRef.current.has(secondsLeft)) {
        firedRef.current.add(secondsLeft);
        playNudgeSound(0.4, "soft-mallet");
      }
    }, 200);

    return () => window.clearInterval(interval);
  }, [active, breakEndsAt]);
}
