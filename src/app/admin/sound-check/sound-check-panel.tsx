"use client";

import { useState } from "react";
import { playNudgeSound, type NudgeSoundCharacter } from "@/lib/nudgeSound";

const STAGES = [
  { label: "−30s vor Timer-Ende — kaum hörbar", intensity: 0.12 },
  { label: "+60s nach Timer-Ende — 2× so stark", intensity: 0.28 },
  { label: "+120s nach Timer-Ende — spürbar", intensity: 0.6 },
];

export function SoundCheckPanel() {
  const [character, setCharacter] = useState<NudgeSoundCharacter>("wood");
  const [sliderIntensity, setSliderIntensity] = useState(0.3);
  const [lastPlayed, setLastPlayed] = useState<string | null>(null);

  function play(label: string, intensity: number) {
    playNudgeSound(intensity, character);
    setLastPlayed(label);
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        {(["wood", "bell"] as const).map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setCharacter(option)}
            className={`rounded border px-3 py-1.5 text-sm ${
              character === option
                ? "border-neutral-800 bg-neutral-800 text-white dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900"
                : "border-black/15 dark:border-white/20"
            }`}
          >
            {option === "wood" ? "Holzklopfen" : "Glocke"}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        <p className="text-xs uppercase tracking-wide opacity-50">
          Vorgeschlagener Zeitplan
        </p>
        {STAGES.map((stage) => (
          <button
            key={stage.label}
            type="button"
            onClick={() => play(stage.label, stage.intensity)}
            className="w-full rounded border border-black/15 px-4 py-3 text-left text-sm hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/5"
          >
            {stage.label}
          </button>
        ))}
      </div>

      <div className="space-y-2 border-t border-black/10 pt-4 dark:border-white/15">
        <p className="text-xs uppercase tracking-wide opacity-50">
          Frei ausprobieren
        </p>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={sliderIntensity}
            onChange={(event) => setSliderIntensity(Number(event.target.value))}
            className="flex-1"
          />
          <span className="w-10 text-right text-xs opacity-60">
            {Math.round(sliderIntensity * 100)}%
          </span>
        </div>
        <button
          type="button"
          onClick={() => play(`frei: ${Math.round(sliderIntensity * 100)}%`, sliderIntensity)}
          className="w-full rounded bg-neutral-800 px-3 py-2 text-sm text-white dark:bg-neutral-100 dark:text-neutral-900"
        >
          Abspielen
        </button>
      </div>

      {lastPlayed && (
        <p className="text-xs opacity-50">
          Zuletzt abgespielt: {character === "wood" ? "Holzklopfen" : "Glocke"} — {lastPlayed}
        </p>
      )}
    </div>
  );
}
