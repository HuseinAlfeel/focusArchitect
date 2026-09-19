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
 * Konfetti auf der Abschlussseite (19.09.): fuenfmal dieselbe Explosion aus
 * der Mitte, eine pro Sekunde, unabhaengig von der Bewegungseinstellung.
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
    const timers: number[] = [];

    // Fuenfmal dieselbe Explosion aus der Mitte, damit jede einzeln als
    // eigener Knall erkennbar ist. Frueher gab es bei eingestellter
    // "reduzierter Bewegung" nur einen einzigen Gruss. Unter Windows reicht
    // dafuer schon, dass die Animationseffekte aus sind, und dann sah man
    // statt fuenf nur eine Explosion. Deshalb jetzt immer fuenf.
    function burst() {
      void fire({
        particleCount: 140,
        spread: 100,
        startVelocity: 48,
        decay: 0.91,
        scalar: 1.1,
        origin: { x: 0.5, y: 0.6 },
        colors: COLORS,
      });
    }

    for (let i = 0; i < BURSTS; i++) {
      timers.push(window.setTimeout(burst, i * INTERVAL_MS));
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
