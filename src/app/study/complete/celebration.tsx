"use client";

import { useEffect, useRef } from "react";
import confetti from "canvas-confetti";

// Die Farben der vier Hinweisstufen (globals.css) plus Blau der Arbeitsphase
// und Gruen der Pause, damit die Feier nach dieser App aussieht und nicht
// nach einem beliebigen Konfetti-Effekt.
const COLORS = ["#f6e7cd", "#f0cd94", "#dd9b6c", "#c2703d", "#5a78a0", "#789664"];

const BURSTS = 5;
const INTERVAL_MS = 1000;

/**
 * Konfetti auf der Abschlussseite (19.09.): fuenf Explosionen, eine pro
 * Sekunde, abwechselnd von links und rechts plus jeweils eine kleinere aus
 * der Mitte.
 *
 * Bewusst erst hier und nirgends frueher. Diese Seite kommt nach dem
 * Absenden der Nachbefragung, zu diesem Zeitpunkt sind alle Antworten
 * gespeichert und die Sitzung finalisiert. Die Feier kann damit keine
 * einzige Messung mehr beeinflussen, sie ist reiner Abschluss fuer die
 * Person.
 *
 * Eigene Canvas statt des globalen confetti(): der globale Aufruf haengt
 * eine Canvas an den body, die beim Verlassen der Seite liegen bleiben
 * kann. Ohne Worker, weil der Effekt kurz ist und so auch in Browsern ohne
 * OffscreenCanvas sicher laeuft.
 */
export function Celebration() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const fire = confetti.create(canvas, { resize: true, useWorker: false });
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timers: number[] = [];

    function burst(i: number) {
      const fromLeft = i % 2 === 0;
      void fire({
        particleCount: 90,
        spread: 78,
        startVelocity: 46,
        decay: 0.9,
        scalar: 1.05,
        angle: fromLeft ? 62 : 118,
        origin: { x: fromLeft ? 0.18 : 0.82, y: 0.68 },
        colors: COLORS,
      });
      void fire({
        particleCount: 45,
        spread: 120,
        startVelocity: 34,
        scalar: 0.85,
        origin: { x: 0.5, y: 0.55 },
        colors: COLORS,
      });
    }

    if (reduced) {
      // Wer reduzierte Bewegung eingestellt hat, bekommt einen einzigen,
      // kleinen Gruss statt fuenf Explosionen.
      void fire({ particleCount: 60, spread: 90, origin: { x: 0.5, y: 0.6 }, colors: COLORS });
    } else {
      for (let i = 0; i < BURSTS; i++) {
        timers.push(window.setTimeout(() => burst(i), i * INTERVAL_MS));
      }
    }

    return () => {
      // Im Entwicklungsmodus laeuft der Effekt zweimal an (React StrictMode).
      // Ohne das Aufraeumen kaemen dort zehn statt fuenf Explosionen.
      timers.forEach((t) => window.clearTimeout(t));
      fire.reset();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-50 h-full w-full"
    />
  );
}
