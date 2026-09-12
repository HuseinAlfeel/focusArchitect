"use client";

import { useEffect, useState } from "react";

/**
 * Zählt NIEMALS hoch. Restzeit wird bei jedem Tick frisch aus dem
 * Zielzeitpunkt (endsAt) berechnet - siehe CLAUDE.md Regel 1. Browser
 * drosseln setInterval in inaktiven Tabs, das würde eine hochzählende
 * Uhr verfälschen. Da hier immer `endsAt - now` gerechnet wird, ist die
 * Anzeige nach einem Tab-Wechsel sofort wieder korrekt, unabhängig davon,
 * wie lange das Intervall gedrosselt war.
 *
 * `now` startet bewusst als `null`, nicht als `Date.now()`: Ein Client-
 * Component-Rendering auf dem Server würde sonst mit einer anderen Zeit
 * rendern als die anschließende Hydration im Browser (Hydration-Mismatch).
 * Der echte Wert wird erst nach dem Mount per useEffect gesetzt.
 */
export function useCountdown(endsAt: number) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    // Kein sofortiger setState-Aufruf hier: Der erste Intervall-Tick (max.
    // 1s später) und der Sichtbarkeits-Handler unten halten die Anzeige
    // ausreichend aktuell, ohne dass der Effekt selbst synchron rendert.
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    function handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        setNow(Date.now());
      }
    }
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [endsAt]);

  if (now === null) {
    return { remainingMs: null, isDone: false, overtimeMs: null };
  }

  // overtimeMs wird genauso frisch aus dem Zielzeitpunkt berechnet wie
  // remainingMs (`now - endsAt`, nicht hochgezählt) - zeigt nur zusätzlich,
  // wie lange der Zielzeitpunkt schon überschritten ist, statt die Anzeige
  // nach Ablauf komplett verschwinden zu lassen.
  const remainingMs = Math.max(0, endsAt - now);
  const overtimeMs = Math.max(0, now - endsAt);
  return { remainingMs, isDone: remainingMs <= 0, overtimeMs };
}

export function formatRemaining(ms: number) {
  const totalSeconds = Math.ceil(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

/**
 * Nur für die Arbeitsphase (Betreuung, 12.09.): ein sekundengenauer
 * Countdown zieht Blicke an, das widerspricht der bewusst zurückhaltenden
 * Gestaltung (Regel 7). Aufgerundet, damit "1 Min" nicht schon bei 0:01
 * Restzeit zu "0 Min" wird - das sähe nach Stillstand aus, obwohl noch Zeit
 * läuft.
 */
export function formatRemainingMinutes(ms: number) {
  const minutes = Math.ceil(ms / 60_000);
  return `${minutes} Min`;
}
