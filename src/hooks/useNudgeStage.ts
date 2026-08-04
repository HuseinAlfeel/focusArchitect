"use client";

import { useEffect, useState } from "react";

export type NudgeStage = 0 | 1 | 2 | 3 | null;

const STAGE_0_LEAD_MS = 120_000; // T-2min: Hintergrund beginnt zu wandern
const STAGE_2_AT_MS = 120_000; // +2min nach Ende: Karte groesser, Pulsieren
const STAGE_3_AT_MS = 300_000; // +5min nach Ende: zentriertes Fenster

/**
 * Leitet die aktuelle Stufe des abgestuften Pausenhinweises rein aus der
 * Zeit ab (CLAUDE.md Regel 1: Zielzeitpunkt, nicht hochzaehlen).
 *   null  -> mehr als 2 Min bis zum Ende, kein Hinweis sichtbar
 *   0     -> 2 Min oder weniger bis zum Ende: Hintergrund wandert
 *   1     -> Timer abgelaufen, weniger als 2 Min her: kleine Karte
 *   2     -> 2-5 Min nach Ende: Karte groesser, pulsiert leicht
 *   3     -> 5+ Min nach Ende: zentriertes Fenster
 */
export function useNudgeStage(endsAt: number): NudgeStage {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 1000);

    function handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        setNow(Date.now());
      }
    }
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [endsAt]);

  if (now === null) return null;

  const offsetMs = now - endsAt;

  if (offsetMs >= STAGE_3_AT_MS) return 3;
  if (offsetMs >= STAGE_2_AT_MS) return 2;
  if (offsetMs >= 0) return 1;
  if (offsetMs >= -STAGE_0_LEAD_MS) return 0;
  return null;
}
