"use client";

import { useEffect } from "react";

/**
 * Protokolliert TAB_HIDDEN / TAB_VISIBLE ueber die Page Visibility API.
 * Liefert ein kleines, aber wertvolles Signal: ob der Tab waehrend der
 * Arbeitsphase ueberhaupt im Vordergrund war (siehe SPEZIFIKATION.md 4).
 *
 * `keepalive: true` gibt dem Request eine Chance, auch dann noch anzukommen,
 * wenn die Seite genau in diesem Moment in den Hintergrund geht - die volle
 * Absicherung per sendBeacon fuer das komplette Verlassen der Seite ist
 * Phase G.
 */
export function useTabVisibilityLogging(sessionId: string, cycle: number) {
  useEffect(() => {
    function handleVisibilityChange() {
      const type =
        document.visibilityState === "hidden" ? "TAB_HIDDEN" : "TAB_VISIBLE";

      void fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          events: [{ type, clientAt: new Date().toISOString(), cycle }],
        }),
        keepalive: true,
      });
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [sessionId, cycle]);
}
