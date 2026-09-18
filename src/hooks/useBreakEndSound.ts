"use client";

import { useEffect, useRef } from "react";
import { playNudgeSound } from "@/lib/nudgeSound";

const COUNTDOWN_SECONDS = 9;

/**
 * Kündigt das Ende der Pause akustisch an: bei 9, 8, 7 ... 1 je ein
 * deutlich hörbarer Klopf-Ton ("soft-mallet"), bei 0 ein klares, lautes
 * Signal ("double-chime") - vorher gab es hier gar keinen Ton, das Ende der
 * Pause ging komplett unbemerkt vorbei. Der Klopf-Ton war zuerst deutlich
 * leiser als das Endsignal (Intensität 0.4 statt 0.9). Beim Testen kam er
 * zweimal (26.08. und 17.09.) gar nicht an, gehört habe ich nur das laute
 * Endsignal. Jetzt beide auf derselben Lautstärkeebene.
 *
 * Der 200ms-Takt reicht im Vordergrund locker, um jede einzelne Sekunde zu
 * treffen, aber ein gedrosselter Hintergrund-Tab (während der Pause bin ich
 * ja meistens gerade nicht im Tab) kann dieses enge Ein-Sekunden-Fenster
 * verpassen, mehrmals hintereinander. Das Endsignal traf
 * trotzdem zuverlässig, weil `remainingMs <= 0` bei jedem folgenden Tick
 * erneut zutrifft - der Klopf-Countdown dagegen bekommt pro Sekunde nur eine
 * einzige Chance. Der visibilitychange-Listener sorgt dafür, dass beim
 * Zurückkommen zum Tab sofort nachgeprüft wird, statt bis zum nächsten
 * 200ms-Tick zu warten (26.08., ich hatte nur den Ton am Ende gehört).
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
        playNudgeSound(0.9, "soft-mallet");
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
