"use client";

import { useEffect, useState } from "react";
import { waterHint } from "@/content/break-hint";

/**
 * Beilaeufiger Hinweis ans Trinken, einmal je Pause (20.09.).
 *
 * Erscheint mit dem Beginn der freien Pausenzeit und verschwindet danach von
 * selbst. Fest oben am Bildschirmrand statt im Inhalt: so steht er auf allen
 * vier Pausenbildschirmen an derselben Stelle (drei Aktivitaeten und "keine
 * Aktivitaet") und verschiebt beim Verschwinden kein Layout.
 *
 * Warum er erst in der freien Pausenzeit kommt und nicht schon beim
 * Pausenstart: Die Aktivitaeten schicken die Teilnehmenden gerade vom
 * Bildschirm weg - bei der Augenentlastung in die Ferne schauen, beim
 * Bewegen aufstehen und umhergehen. Ein rein sichtbarer Hinweis waehrend der
 * ersten Sekunden waere also genau bei den Aktivitaeten unsichtbar, bei
 * denen er gezeigt wuerde. Zu Beginn der freien Zeit sitzen sie wieder
 * davor.
 *
 * Nicht gesprochen, nur sichtbar: waehrend der Aktivitaeten laeuft die
 * Sprachausgabe der Anleitung, eine zweite Stimme daneben waere Laerm.
 */
export function WaterHint() {
  const [phase, setPhase] = useState<"in" | "out" | "gone">("in");

  useEffect(() => {
    const ausblenden = window.setTimeout(
      () => setPhase("out"),
      waterHint.visibleMs
    );
    const entfernen = window.setTimeout(
      () => setPhase("gone"),
      waterHint.visibleMs + waterHint.fadeOutMs
    );
    return () => {
      window.clearTimeout(ausblenden);
      window.clearTimeout(entfernen);
    };
  }, []);

  if (phase === "gone") return null;

  return (
    <div
      // aria-hidden: Der Hinweis ist eine Randnotiz und verschwindet von
      // selbst. Als Live-Region wuerde er die Vorlesestimme der Anleitung
      // unterbrechen, das waere stoerender als nuetzlich.
      aria-hidden="true"
      className={`pointer-events-none fixed left-1/2 top-6 z-20 -translate-x-1/2 ${
        phase === "in" ? "animate-water-hint-in" : "animate-water-hint-out"
      }`}
    >
      <div className="flex items-center gap-2.5 rounded-full border border-black/5 bg-white/70 py-2 pl-3 pr-4 shadow-[0_1px_12px_rgba(0,0,0,0.05)] backdrop-blur-md dark:border-white/10">
        <svg
          viewBox="0 0 24 24"
          className="h-[18px] w-[18px] shrink-0"
          fill="none"
          stroke="var(--foreground-water)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 3.2c0 0-5.6 6.4-5.6 10.2a5.6 5.6 0 0 0 11.2 0C17.6 9.6 12 3.2 12 3.2z" />
        </svg>
        <span className="whitespace-nowrap text-[13px] font-medium text-neutral-600 dark:text-neutral-300">
          {waterHint.text}
        </span>
      </div>
    </div>
  );
}
