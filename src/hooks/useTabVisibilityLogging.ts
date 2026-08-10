"use client";

import { useEffect } from "react";
import { enqueueEvent } from "@/lib/eventQueue";

/**
 * Protokolliert TAB_HIDDEN / TAB_VISIBLE ueber die Page Visibility API.
 * Liefert ein kleines, aber wertvolles Signal: ob der Tab waehrend der
 * Arbeitsphase ueberhaupt im Vordergrund war (siehe SPEZIFIKATION.md 4).
 *
 * Geht ueber die Ereignis-Queue (src/lib/eventQueue.ts, Phase G): landet erst
 * in der Queue, wird im 10s-Takt gesendet und beim Verlassen der Seite per
 * sendBeacon nachgereicht, statt bei einer kurzen Netzwerkluecke verloren zu gehen.
 */
export function useTabVisibilityLogging(sessionId: string, cycle: number) {
  useEffect(() => {
    function handleVisibilityChange() {
      const type =
        document.visibilityState === "hidden" ? "TAB_HIDDEN" : "TAB_VISIBLE";
      enqueueEvent(sessionId, type, { cycle });
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [sessionId, cycle]);
}
