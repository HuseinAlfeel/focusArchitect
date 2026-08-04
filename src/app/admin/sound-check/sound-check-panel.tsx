"use client";

import { useState } from "react";
import { playNudgeSound, type NudgeSoundCharacter } from "@/lib/nudgeSound";

const GENTLE_CANDIDATES: { id: NudgeSoundCharacter; label: string; hint: string }[] = [
  { id: "soft-sine", label: "Sanfter Sinuston", hint: "so minimal wie möglich" },
  { id: "soft-bell", label: "Weiche Glocke", hint: "dein Favorit von eben" },
  { id: "singing-bowl", label: "Klangschale", hint: "leichtes Schweben" },
  { id: "soft-mallet", label: "Weicher Mallet", hint: "kurz, klar gestimmt" },
  { id: "water-drop", label: "Wassertropfen", hint: "fallender Ton" },
];

const STRONG_CANDIDATES: { id: NudgeSoundCharacter; label: string; hint: string }[] = [
  { id: "double-chime", label: "Doppel-Chime", hint: "wie eine sanfte Türklingel" },
  { id: "triple-ascending", label: "Aufsteigende Kaskade", hint: "drei Töne, steigend" },
  { id: "rich-chord", label: "Voller Akkord", hint: "drei Töne gleichzeitig" },
  { id: "pulsing-tone", label: "Pulsierender Ton", hint: "dreimal kurz hintereinander" },
  { id: "rising-sweep", label: "Aufsteigender Sweep", hint: "Tonhöhe gleitet nach oben" },
];

const GENTLE_DEFAULT_INTENSITY = 0.25;
const STRONG_DEFAULT_INTENSITY = 0.65;

export function SoundCheckPanel() {
  const [selected, setSelected] = useState<NudgeSoundCharacter>("soft-bell");
  const [sliderIntensity, setSliderIntensity] = useState(0.3);
  const [lastPlayed, setLastPlayed] = useState<string | null>(null);

  function playCandidate(id: NudgeSoundCharacter, label: string, intensity: number) {
    setSelected(id);
    playNudgeSound(intensity, id);
    setLastPlayed(`${label} (${Math.round(intensity * 100)}%)`);
  }

  return (
    <div className="space-y-6">
      <CandidateGroup
        title="Angenehme Kandidaten"
        subtitle="für leise, frühe Stufen"
        items={GENTLE_CANDIDATES}
        defaultIntensity={GENTLE_DEFAULT_INTENSITY}
        selected={selected}
        onPlay={playCandidate}
      />

      <CandidateGroup
        title="Starke Varianten"
        subtitle="für spätere, auffälligere Stufen"
        items={STRONG_CANDIDATES}
        defaultIntensity={STRONG_DEFAULT_INTENSITY}
        selected={selected}
        onPlay={playCandidate}
      />

      <div className="space-y-2 border-t border-black/10 pt-4 dark:border-white/15">
        <p className="text-xs uppercase tracking-wide opacity-50">
          Ausgewählt: {[...GENTLE_CANDIDATES, ...STRONG_CANDIDATES].find((c) => c.id === selected)?.label} — Intensität frei einstellen
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
          onClick={() => {
            playNudgeSound(sliderIntensity, selected);
            setLastPlayed(`frei: ${Math.round(sliderIntensity * 100)}%`);
          }}
          className="w-full rounded bg-neutral-800 px-3 py-2 text-sm text-white dark:bg-neutral-100 dark:text-neutral-900"
        >
          Abspielen
        </button>
      </div>

      {lastPlayed && (
        <p className="text-xs opacity-50">Zuletzt abgespielt: {lastPlayed}</p>
      )}
    </div>
  );
}

function CandidateGroup({
  title,
  subtitle,
  items,
  defaultIntensity,
  selected,
  onPlay,
}: {
  title: string;
  subtitle: string;
  items: { id: NudgeSoundCharacter; label: string; hint: string }[];
  defaultIntensity: number;
  selected: NudgeSoundCharacter;
  onPlay: (id: NudgeSoundCharacter, label: string, intensity: number) => void;
}) {
  return (
    <div className="space-y-2">
      <p className="text-xs uppercase tracking-wide opacity-50">
        {title} <span className="normal-case opacity-70">— {subtitle}</span>
      </p>
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onPlay(item.id, item.label, defaultIntensity)}
          className={`w-full rounded border px-4 py-2.5 text-left text-sm hover:bg-black/5 dark:hover:bg-white/5 ${
            selected === item.id
              ? "border-neutral-800 dark:border-neutral-100"
              : "border-black/15 dark:border-white/20"
          }`}
        >
          <span className="font-medium">{item.label}</span>
          <span className="ml-2 text-xs opacity-50">{item.hint}</span>
        </button>
      ))}
    </div>
  );
}
