"use client";

import { useState } from "react";
import {
  NUDGE_STAGE_SOUND,
  playNudgeSound,
  type NudgeSoundCharacter,
} from "@/lib/nudgeSound";

const GENTLE_CANDIDATES: { id: NudgeSoundCharacter; label: string; hint: string }[] = [
  { id: "soft-sine", label: "Sanfter Sinuston", hint: "so minimal wie möglich" },
  { id: "soft-bell", label: "Weiche Glocke", hint: "Sinus mit leisem Oberton" },
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

const ALL_CANDIDATES = [...GENTLE_CANDIDATES, ...STRONG_CANDIDATES];

// Die drei Stufen in der Reihenfolge, in der Teilnehmende sie hoeren.
const STAGES = [
  { stage: 1 as const, when: "bei 0:00" },
  { stage: 2 as const, when: "+2:00" },
  { stage: 3 as const, when: "+5:00" },
];

// Welche Klangfarbe steckt in welcher Stufe? Aus NUDGE_STAGE_SOUND abgeleitet,
// nicht danebengeschrieben - so kann die Markierung unten nicht veralten.
const STAGE_BY_CHARACTER = new Map<NudgeSoundCharacter, number>(
  STAGES.map(({ stage }) => [NUDGE_STAGE_SOUND[stage].character, stage])
);

export function SoundCheckPanel() {
  const [selected, setSelected] = useState<NudgeSoundCharacter>("soft-bell");
  const [intensity, setIntensity] = useState(0.35);
  const [lastPlayed, setLastPlayed] = useState<string | null>(null);

  // Ein einziger Regler für alles: sowohl die Kandidaten-Knöpfe unten als
  // auch der explizite "Abspielen"-Knopf benutzen genau diesen Wert. Vorher
  // hatten die Kandidaten-Knöpfe eigene feste Lautstärken, unabhängig vom
  // Regler - das hat für Verwirrung gesorgt.
  function play(id: NudgeSoundCharacter, label: string) {
    setSelected(id);
    playNudgeSound(intensity, id);
    setLastPlayed(`${label} (${Math.round(intensity * 100)}%)`);
  }

  // Spielt eine Stufe genau so, wie Teilnehmende sie hoeren - bewusst ohne
  // den Regler oben, sonst prueft man etwas anderes als das Eingestellte.
  function playStage(stage: 1 | 2 | 3) {
    const { intensity: stageIntensity, character } = NUDGE_STAGE_SOUND[stage];
    setSelected(character);
    playNudgeSound(stageIntensity, character);
    setLastPlayed(`Stufe ${stage} (${Math.round(stageIntensity * 100)}%)`);
  }

  return (
    <div className="space-y-6">
      <p className="rounded border border-amber-600/40 bg-amber-500/10 px-3 py-2 text-sm">
        Stell deine Lautstärke auf mindestens 80%, bevor du testest. Die
        Töne sind absichtlich leise.
      </p>

      <div className="space-y-2 rounded border border-black/10 p-4 dark:border-white/15">
        <p className="text-xs uppercase tracking-wide opacity-50">
          Lautstärke, gilt für alle Knöpfe unten
        </p>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={intensity}
            onChange={(event) => setIntensity(Number(event.target.value))}
            className="flex-1"
          />
          <span className="w-10 text-right text-sm">
            {Math.round(intensity * 100)}%
          </span>
        </div>
        <button
          type="button"
          onClick={() =>
            play(selected, ALL_CANDIDATES.find((c) => c.id === selected)?.label ?? selected)
          }
          className="w-full rounded bg-neutral-800 px-3 py-2 text-sm text-white dark:bg-neutral-100 dark:text-neutral-900"
        >
          Ausgewählten Ton nochmal abspielen
        </button>
      </div>

      <div className="space-y-2 rounded border border-black/10 p-4 dark:border-white/15">
        <p className="text-xs uppercase tracking-wide opacity-50">
          Im Studienablauf eingestellt{" "}
          <span className="normal-case opacity-70">
            (feste Lautstärke, unabhängig vom Regler)
          </span>
        </p>
        {STAGES.map(({ stage, when }) => {
          const { intensity: stageIntensity, character } = NUDGE_STAGE_SOUND[stage];
          const label =
            ALL_CANDIDATES.find((c) => c.id === character)?.label ?? character;
          return (
            <button
              key={stage}
              type="button"
              onClick={() => playStage(stage)}
              className="w-full rounded border border-black/15 px-4 py-2.5 text-left text-sm hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/5"
            >
              <span className="font-medium">Stufe {stage}</span>
              <span className="ml-2 text-xs opacity-50">
                {when} · {label} · {Math.round(stageIntensity * 100)}%
              </span>
            </button>
          );
        })}
        <p className="text-xs opacity-50">
          Stufe 0 (T minus 2 Min) bleibt absichtlich tonlos.
        </p>
      </div>

      <CandidateGroup
        title="Angenehme Kandidaten"
        subtitle="für leise, frühe Stufen"
        items={GENTLE_CANDIDATES}
        selected={selected}
        onPlay={play}
      />

      <CandidateGroup
        title="Starke Varianten"
        subtitle="für spätere, auffälligere Stufen"
        items={STRONG_CANDIDATES}
        selected={selected}
        onPlay={play}
      />

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
  selected,
  onPlay,
}: {
  title: string;
  subtitle: string;
  items: { id: NudgeSoundCharacter; label: string; hint: string }[];
  selected: NudgeSoundCharacter;
  onPlay: (id: NudgeSoundCharacter, label: string) => void;
}) {
  return (
    <div className="space-y-2">
      <p className="text-xs uppercase tracking-wide opacity-50">
        {title} <span className="normal-case opacity-70">({subtitle})</span>
      </p>
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onPlay(item.id, item.label)}
          className={`w-full rounded border px-4 py-2.5 text-left text-sm hover:bg-black/5 dark:hover:bg-white/5 ${
            selected === item.id
              ? "border-neutral-800 dark:border-neutral-100"
              : "border-black/15 dark:border-white/20"
          }`}
        >
          <span className="font-medium">{item.label}</span>
          <span className="ml-2 text-xs opacity-50">{item.hint}</span>
          {STAGE_BY_CHARACTER.has(item.id) && (
            <span className="ml-2 text-xs opacity-70">
              · im Einsatz bei Stufe {STAGE_BY_CHARACTER.get(item.id)}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
