"use client";

// Synthetisiert die Töne für den abgestuften Pausenhinweis direkt per Web
// Audio API, statt externe Audiodateien zu laden (kein Lizenz-Thema, exakt
// steuerbare Lautstärke-Verhältnisse zwischen den Stufen, kein Nachladen).
//
// Zehn Kandidaten zum Vergleichen, in zwei Gruppen:
//
// ANGENEHM (für leise/frühe Stufen, z.B. -30s vor Timer-Ende):
//   soft-sine     - reiner Sinuston, langsam ein-/ausgeblendet
//   soft-bell     - Sinuston + leiser Oberton, weicher Chime
//   singing-bowl  - zwei minimal verstimmte Sinustöne, natürliches
//                   Schweben wie bei einer Klangschale (Achtsamkeits-App-
//                   Ästhetik, passt thematisch zur Pause)
//   soft-mallet   - kurzer, klar gestimmter weicher Anschlag (anders als
//                   der geräuschhafte Holzklopf-Versuch: hier mit klarer
//                   Tonhöhe, dadurch musikalischer statt perkussiv-hart)
//   water-drop    - kurzer fallender Ton, wie ein einzelner Tropfen
//
// STARK (für spätere/auffälligere Stufen, z.B. +120s):
//   double-chime      - zwei aufsteigende Töne, wie eine sanfte Türklingel
//   triple-ascending  - drei aufsteigende, jeweils etwas lautere Töne
//   rich-chord        - drei gleichzeitige harmonische Töne, voller Klang
//   pulsing-tone      - derselbe Ton dreimal kurz hintereinander, Aufmerk-
//                       samkeit über Rhythmus statt nur Lautstärke
//   rising-sweep      - Tonhöhe gleitet nach oben, endet hell und präsent

export type NudgeSoundCharacter =
  | "soft-sine"
  | "soft-bell"
  | "singing-bowl"
  | "soft-mallet"
  | "water-drop"
  | "double-chime"
  | "triple-ascending"
  | "rich-chord"
  | "pulsing-tone"
  | "rising-sweep";

let sharedContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!sharedContext) {
    sharedContext = new AudioContext();
  }
  if (sharedContext.state === "suspended") {
    void sharedContext.resume();
  }
  return sharedContext;
}

function playTone(
  ctx: AudioContext,
  startTime: number,
  options: {
    frequency: number;
    endFrequency?: number;
    type?: OscillatorType;
    duration: number;
    peakGain: number;
    attack?: number;
  }
) {
  const { frequency, endFrequency, type = "sine", duration, peakGain, attack = 0.012 } = options;

  const osc = ctx.createOscillator();
  osc.type = type;
  osc.frequency.setValueAtTime(frequency, startTime);
  if (endFrequency && endFrequency !== frequency) {
    osc.frequency.exponentialRampToValueAtTime(endFrequency, startTime + duration);
  }

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, startTime);
  gain.gain.exponentialRampToValueAtTime(Math.max(peakGain, 0.0002), startTime + attack);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(startTime);
  osc.stop(startTime + duration + 0.02);
}

const CHARACTERS: Record<
  NudgeSoundCharacter,
  (ctx: AudioContext, intensity: number) => void
> = {
  "soft-sine": (ctx, intensity) => {
    const now = ctx.currentTime;
    playTone(ctx, now, {
      frequency: 560,
      duration: 0.5 + intensity * 0.4,
      peakGain: 0.012 + intensity * 0.08,
      attack: 0.15,
    });
  },

  "soft-bell": (ctx, intensity) => {
    const now = ctx.currentTime;
    const duration = 0.5 + intensity * 0.3;
    playTone(ctx, now, {
      frequency: 680,
      duration,
      peakGain: 0.015 + intensity * 0.12,
      attack: 0.05,
    });
    playTone(ctx, now, {
      frequency: 680 * 2.4,
      duration: duration * 0.6,
      peakGain: (0.015 + intensity * 0.12) * 0.25,
      attack: 0.05,
    });
  },

  "singing-bowl": (ctx, intensity) => {
    const now = ctx.currentTime;
    const duration = 1.2 + intensity * 0.8;
    const gain = 0.01 + intensity * 0.06;
    playTone(ctx, now, { frequency: 300, duration, peakGain: gain, attack: 0.25 });
    playTone(ctx, now, { frequency: 300 * 1.006, duration, peakGain: gain, attack: 0.25 });
  },

  "soft-mallet": (ctx, intensity) => {
    const now = ctx.currentTime;
    playTone(ctx, now, {
      frequency: 330,
      type: "triangle",
      duration: 0.35 + intensity * 0.15,
      peakGain: 0.015 + intensity * 0.1,
      attack: 0.005,
    });
  },

  "water-drop": (ctx, intensity) => {
    const now = ctx.currentTime;
    playTone(ctx, now, {
      frequency: 780,
      endFrequency: 380,
      duration: 0.15 + intensity * 0.05,
      peakGain: 0.015 + intensity * 0.09,
      attack: 0.003,
    });
  },

  "double-chime": (ctx, intensity) => {
    const now = ctx.currentTime;
    const gain = 0.03 + intensity * 0.15;
    playTone(ctx, now, { frequency: 440, duration: 0.35, peakGain: gain });
    playTone(ctx, now + 0.13, { frequency: 550, duration: 0.4, peakGain: gain });
  },

  "triple-ascending": (ctx, intensity) => {
    const now = ctx.currentTime;
    const base = 0.025 + intensity * 0.12;
    playTone(ctx, now, { frequency: 440, duration: 0.25, peakGain: base });
    playTone(ctx, now + 0.11, { frequency: 495, duration: 0.25, peakGain: base * 1.2 });
    playTone(ctx, now + 0.22, { frequency: 550, duration: 0.3, peakGain: base * 1.4 });
  },

  "rich-chord": (ctx, intensity) => {
    const now = ctx.currentTime;
    const duration = 0.6 + intensity * 0.3;
    const gain = 0.02 + intensity * 0.1;
    // Einsatz 50ms statt der 12ms Voreinstellung (20.09.): Drei gleichzeitige
    // Toene summieren sich auf gut das Dreifache der Einzelamplitude, und mit
    // dem harten Standardeinsatz beginnt das hoerbar schlagartig. Die
    // Spezifikation [6] verlangt fuer die Stufentoene ausdruecklich einen
    // weichen Einsatz (~50ms), CLAUDE.md Regel 8 "niemals aggressiv". Seit
    // dieser Akkord der Ton von Stufe 3 ist, gilt das auch fuer ihn.
    [440, 550, 660].forEach((frequency) => {
      playTone(ctx, now, { frequency, duration, peakGain: gain, attack: 0.05 });
    });
  },

  "pulsing-tone": (ctx, intensity) => {
    const now = ctx.currentTime;
    const gain = 0.02 + intensity * 0.13;
    [0, 0.18, 0.36].forEach((offset) => {
      playTone(ctx, now + offset, { frequency: 500, duration: 0.12, peakGain: gain });
    });
  },

  "rising-sweep": (ctx, intensity) => {
    const now = ctx.currentTime;
    playTone(ctx, now, {
      frequency: 550,
      endFrequency: 880,
      duration: 0.25 + intensity * 0.1,
      peakGain: 0.02 + intensity * 0.12,
      attack: 0.05,
    });
  },
};

/**
 * Spielt einen Hinweiston. `intensity` liegt zwischen 0 (kaum hörbar) und 1
 * (deutlich), skaliert Lautstärke und Klangfülle zusammen - so bleibt jede
 * Klangfarbe über mehrere Stufen hinweg eine stimmige Familie statt
 * zufällig unterschiedlich lauter Einzeldateien.
 */
export function playNudgeSound(
  intensity: number,
  character: NudgeSoundCharacter = "soft-bell"
) {
  if (typeof window === "undefined") return;
  const ctx = getAudioContext();
  const clamped = Math.max(0, Math.min(1, intensity));
  CHARACTERS[character](ctx, clamped);
}

/**
 * Welcher Ton bei welcher Stufe des abgestuften Hinweises spielt - die
 * einzige Stelle, an der das steht. `useNudgeStageSound` spielt danach,
 * `/admin/sound-check` zeigt danach an, welche drei Toene im Einsatz sind.
 * Vorher stand die Zuordnung privat im Hook, die Vergleichsseite wusste
 * nichts davon und konnte unbemerkt etwas anderes nahelegen als das, was
 * Teilnehmende tatsaechlich hoeren.
 *
 * Stufe 0 fehlt hier absichtlich und bleibt tonlos (Betreuung 17.09.): der
 * Sinn dieser Stufe ist ein kaum bewusst wahrnehmbarer visueller Uebergang,
 * ein Ton wuerde eine hoerbare Vorwarnung daraus machen.
 *
 * Festgelegt am 20.09. nach dem Anhoeren aller Kandidaten in
 * `/admin/sound-check`. Ab der ersten echten Sitzung nicht mehr
 * aendern - der Ton ist Teil der Intervention, eine Aenderung mitten in der
 * Erhebung macht die Sitzungen davor und danach unvergleichbar.
 */
export const NUDGE_STAGE_SOUND: Record<
  1 | 2 | 3,
  { intensity: number; character: NudgeSoundCharacter }
> = {
  1: { intensity: 0.7, character: "soft-sine" },
  2: { intensity: 0.8, character: "soft-bell" },
  3: { intensity: 0.9, character: "rich-chord" },
};
