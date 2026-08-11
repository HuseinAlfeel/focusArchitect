"use client";

import { useEffect, useRef } from "react";
import { playNudgeSound, type NudgeSoundCharacter } from "@/lib/nudgeSound";
import { enqueueEvent } from "@/lib/eventQueue";

type ScheduleEntry = {
  id: string;
  offsetMs: number;
  repeats: number;
  gapMs: number;
  intensity: number;
  character: NudgeSoundCharacter;
};

// Mit Husin abgestimmter Zeitplan (2026-08-04):
//  -30s        sanfter Sinuston  1x               50%
//    0s        sanfter Sinuston  1x               75%
//  +1 Min      sanfter Sinuston  2x (0.5s Abstand) 75%
//  +2 Min      sanfter Sinuston  2x (0.5s Abstand) 100%
//  +3 Min      pulsierender Ton  1x                75%
//  +4 Min, ... pulsierender Ton  1x                100%  (jede weitere Minute)
const FIXED_ENTRIES: ScheduleEntry[] = [
  { id: "pre-30s", offsetMs: -30_000, repeats: 1, gapMs: 0, intensity: 0.5, character: "soft-sine" },
  { id: "at-0s", offsetMs: 0, repeats: 1, gapMs: 0, intensity: 0.75, character: "soft-sine" },
  { id: "plus-1min", offsetMs: 60_000, repeats: 2, gapMs: 500, intensity: 0.75, character: "soft-sine" },
  { id: "plus-2min", offsetMs: 120_000, repeats: 2, gapMs: 500, intensity: 1, character: "soft-sine" },
  { id: "plus-3min", offsetMs: 180_000, repeats: 1, gapMs: 0, intensity: 0.75, character: "pulsing-tone" },
];

const REPEAT_START_MS = 240_000; // +4 Min
const REPEAT_INTERVAL_MS = 60_000; // jede weitere Minute, unbegrenzt

function repeatEntry(minuteIndex: number): ScheduleEntry {
  return {
    id: `repeat-${minuteIndex}`,
    offsetMs: REPEAT_START_MS + minuteIndex * REPEAT_INTERVAL_MS,
    repeats: 1,
    gapMs: 0,
    intensity: 1,
    character: "pulsing-tone",
  };
}

function logSoundEvent(
  sessionId: string,
  offsetMs: number,
  intensity: number,
  character: NudgeSoundCharacter
) {
  enqueueEvent(sessionId, "NUDGE_SOUND_PLAYED", {
    payload: { offsetMs, intensity, character },
  });
}

/**
 * Spielt die Ton-Eskalation rund um das Ende der Arbeitsphase ab - laeuft
 * unabhaengig von und parallel zu den visuellen Stufen. Startet automatisch
 * 30s vor `endsAt`, laeuft unbegrenzt weiter (jede weitere Minute), bis
 * `active` auf false gesetzt wird (Nutzer hat reagiert).
 */
export function useNudgeSoundSchedule(
  endsAt: number,
  sessionId: string,
  active: boolean
) {
  const firedRef = useRef<Set<string>>(new Set());
  const timeoutsRef = useRef<number[]>([]);

  useEffect(() => {
    if (!active) return;

    firedRef.current = new Set();

    function fireEntry(entry: ScheduleEntry, offsetAtTrigger: number) {
      firedRef.current.add(entry.id);
      for (let i = 0; i < entry.repeats; i++) {
        const timeoutId = window.setTimeout(() => {
          playNudgeSound(entry.intensity, entry.character);
          logSoundEvent(sessionId, offsetAtTrigger, entry.intensity, entry.character);
        }, i * entry.gapMs);
        timeoutsRef.current.push(timeoutId);
      }
    }

    function tick() {
      const offsetMs = Date.now() - endsAt;

      for (const entry of FIXED_ENTRIES) {
        if (!firedRef.current.has(entry.id) && offsetMs >= entry.offsetMs) {
          fireEntry(entry, offsetMs);
        }
      }

      if (offsetMs >= REPEAT_START_MS) {
        const currentIndex = Math.floor(
          (offsetMs - REPEAT_START_MS) / REPEAT_INTERVAL_MS
        );
        // Nur den gerade faelligen Ton abspielen. Nach einer langen Pause
        // (Tab tagelang offen, Laptop im Standby...) waeren sonst ploetzlich
        // alle in der Zwischenzeit verpassten Minuten-Toene auf einmal faellig -
        // das ergab genau das Geraeusch-Chaos, das Husin am 10.08. gemeldet hat.
        for (let i = 0; i < currentIndex; i++) {
          firedRef.current.add(repeatEntry(i).id);
        }
        const entry = repeatEntry(currentIndex);
        if (!firedRef.current.has(entry.id)) {
          fireEntry(entry, offsetMs);
        }
      }
    }

    // Kein sofortiger Aufruf hier (gleicher Grund wie in useCountdown.ts):
    // der erste Intervall-Tick nach 500ms reicht fuer diesen Anwendungsfall
    // voellig aus und vermeidet einen synchronen setState-Aufruf im Effekt.
    const interval = window.setInterval(tick, 500);

    return () => {
      window.clearInterval(interval);
      timeoutsRef.current.forEach((id) => window.clearTimeout(id));
      timeoutsRef.current = [];
    };
  }, [active, endsAt, sessionId]);
}
