"use client";

import { useEffect, useRef } from "react";
import { playNudgeSound } from "@/lib/nudgeSound";

const COUNTDOWN_SECONDS = 10;

/**
 * Kuendigt das Ende der Pause akustisch an: in den letzten 10 Sekunden ein
 * leiser Klopf-Ton pro Sekunde ("soft-mallet"), bei 0 ein klares, deutliches
 * Signal ("double-chime") - vorher gab es hier gar keinen Ton, das Ende der
 * Pause ging komplett unbemerkt vorbei.
 *
 * Der 200ms-Takt reicht im Vordergrund locker, um jede einzelne Sekunde zu
 * treffen - aber ein gedrosselter Hintergrund-Tab (Husin ist ja meistens
 * gerade NICHT im Tab, waehrend die Pause laeuft) kann dieses enge
 * Ein-Sekunden-Fenster verpassen, mehrmals hintereinander. Das Endsignal traf
 * trotzdem zuverlaessig, weil `remainingMs <= 0` bei jedem folgenden Tick
 * erneut zutrifft - der Klopf-Countdown dagegen bekommt pro Sekunde nur eine
 * einzige Chance. Der visibilitychange-Listener sorgt dafuer, dass beim
 * Zurueckkommen zum Tab sofort nachgeprueft wird, statt bis zum naechsten
 * 200ms-Tick zu warten (Husin, 26.08.: "nur den Sound am Ende gehoert").
 */
export function useBreakEndSound(breakEndsAt: number, active: boolean) {
  const firedRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    if (!active) return;
    firedRef.current = new Set();

    function check() {
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
    }

    const interval = window.setInterval(check, 200);

    function handleVisibilityChange() {
      if (document.visibilityState === "visible") check();
    }
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [active, breakEndsAt]);
}
