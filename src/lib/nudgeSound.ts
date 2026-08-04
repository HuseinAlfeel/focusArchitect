"use client";

// Synthetisiert die Toene fuer den abgestuften Pausenhinweis direkt per Web
// Audio API, statt externe Audiodateien zu laden (kein Lizenz-Thema, exakt
// steuerbare Lautstaerke-Verhaeltnisse zwischen den Stufen, kein Nachladen).
//
// "wood": kurzer gefilterter Rauschimpuls - perkussiv, erdig, wie ein sehr
//         leises Klopfen auf Holz.
// "bell": kurzer Sinuston mit leiser Oberton - weicher, heller Chime.

export type NudgeSoundCharacter = "wood" | "bell";

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

function playWood(ctx: AudioContext, intensity: number) {
  const now = ctx.currentTime;
  const duration = 0.09 + intensity * 0.05;
  const peakGain = 0.02 + intensity * 0.18;

  const bufferSize = Math.ceil(ctx.sampleRate * duration);
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const bandpass = ctx.createBiquadFilter();
  bandpass.type = "bandpass";
  bandpass.frequency.value = 340 + intensity * 160;
  bandpass.Q.value = 1.1;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(peakGain, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  noise.connect(bandpass);
  bandpass.connect(gain);
  gain.connect(ctx.destination);

  noise.start(now);
  noise.stop(now + duration);
}

function playBell(ctx: AudioContext, intensity: number) {
  const now = ctx.currentTime;
  const duration = 0.5 + intensity * 0.3;
  const peakGain = 0.015 + intensity * 0.12;

  const fundamental = ctx.createOscillator();
  fundamental.type = "sine";
  fundamental.frequency.value = 480;

  const overtone = ctx.createOscillator();
  overtone.type = "sine";
  overtone.frequency.value = 480 * 2.4;

  const fundamentalGain = ctx.createGain();
  fundamentalGain.gain.setValueAtTime(peakGain, now);
  fundamentalGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  const overtoneGain = ctx.createGain();
  overtoneGain.gain.setValueAtTime(peakGain * 0.25, now);
  overtoneGain.gain.exponentialRampToValueAtTime(0.0001, now + duration * 0.6);

  fundamental.connect(fundamentalGain);
  overtone.connect(overtoneGain);
  fundamentalGain.connect(ctx.destination);
  overtoneGain.connect(ctx.destination);

  fundamental.start(now);
  overtone.start(now);
  fundamental.stop(now + duration);
  overtone.stop(now + duration);
}

/**
 * Spielt einen Hinweiston. `intensity` liegt zwischen 0 (kaum hoerbar) und 1
 * (deutlich), skaliert Lautstaerke und Klangfuelle zusammen - so bleiben
 * mehrere Stufen eine stimmige, zueinander passende Familie statt separater
 * Dateien mit zufaelligem Lautstaerke-Verhaeltnis.
 */
export function playNudgeSound(
  intensity: number,
  character: NudgeSoundCharacter = "wood"
) {
  if (typeof window === "undefined") return;
  const ctx = getAudioContext();
  const clamped = Math.max(0, Math.min(1, intensity));

  if (character === "wood") {
    playWood(ctx, clamped);
  } else {
    playBell(ctx, clamped);
  }
}
