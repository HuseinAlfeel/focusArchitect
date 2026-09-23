"use client";

import { useEffect, useRef } from "react";
import { playNudgeSound } from "@/lib/nudgeSound";

const COUNTDOWN_SECONDS = 9;

/**
 * Kündigt das Ende der Pause akustisch an: bei 9, 8, 7 ... 1 je ein
 * hörbarer Klopf-Ton ("soft-mallet"), bei 0 ein klares Signal
 * ("double-chime") - vorher gab es hier gar keinen Ton, das Ende der Pause
 * ging komplett unbemerkt vorbei.
 *
 * Der Klopf-Ton war dreimal nicht zu hören (26.08., 17.09., 22.09.). Die
 * ersten beiden Male wurde die übergebene Intensität von 0.4 auf 0.9
 * angehoben und damit angenommen, er läge jetzt "auf derselben
 * Lautstärkeebene" wie das Endsignal. Das stimmte nur für die Zahl:
 * gemessen war das Endsignal trotzdem 9,9 dB lauter, weil es aus zwei Tönen
 * besteht und mit einem größeren Faktor rechnet. Dazu kam die Tonhöhe von
 * 330 Hz, die Laptop-Lautsprecher kaum noch abstrahlen. Beides am 23.09. in
 * nudgeSound.ts behoben, Pegel und Frequenz diesmal gemessen statt
 * geschätzt.
 *
 * Bleibt als Einschränkung: Liegt der Tab im Hintergrund, drosselt der
 * Browser diesen 200ms-Takt auf etwa einen Aufruf pro Minute, dann gehen
 * die neun Ein-Sekunden-Fenster verloren. Das Endsignal kommt trotzdem an,
 * weil `remainingMs <= 0` bei jedem späteren Tick erneut zutrifft und der
 * visibilitychange-Listener beim Zurückkommen sofort nachprüft.
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
