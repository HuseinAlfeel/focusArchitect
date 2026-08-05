"use client";

import { useEffect, useRef, useState } from "react";
import { useCountdown } from "@/hooks/useCountdown";

/**
 * Fuehrt automatisch durch eine Liste von Aktivitaets-Schritten: ein Schritt
 * pro Bildschirm, jeder mit eigener Dauer, automatischer Vorschritt zum
 * naechsten (Regel 1: Zielzeitpunkt je Schritt, nicht hochgezaehlt).
 * Protokolliert ACTIVITY_STEP_DONE, sobald ein Schritt abgeschlossen ist.
 */
export function useActivitySteps(
  sessionId: string,
  cycle: number,
  durationsSeconds: number[]
) {
  const [index, setIndex] = useState(0);
  const [stepEndsAt, setStepEndsAt] = useState(
    () => Date.now() + (durationsSeconds[0] ?? 0) * 1000
  );
  const loggedRef = useRef<Set<number>>(new Set());

  const { remainingMs, isDone } = useCountdown(stepEndsAt);

  useEffect(() => {
    if (!isDone || index >= durationsSeconds.length) return;
    if (loggedRef.current.has(index)) return;
    loggedRef.current.add(index);

    void fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        events: [
          {
            type: "ACTIVITY_STEP_DONE",
            clientAt: new Date().toISOString(),
            cycle,
            payload: { stepIndex: index },
          },
        ],
      }),
      keepalive: true,
    });

    // Deferred statt direkt im Effekt aufgerufen (gleicher Grund wie in
    // useCountdown.ts): vermeidet den synchronen setState-Aufruf im Effekt.
    const nextIndex = index + 1;
    const timeoutId = window.setTimeout(() => {
      setIndex(nextIndex);
      if (nextIndex < durationsSeconds.length) {
        setStepEndsAt(Date.now() + durationsSeconds[nextIndex] * 1000);
      }
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [isDone, index, durationsSeconds, sessionId, cycle]);

  return {
    currentStepIndex: index,
    remainingMs,
    allStepsDone: index >= durationsSeconds.length,
  };
}
