"use client";

import { useEffect, useRef } from "react";
import { enqueueEvent } from "@/lib/eventQueue";

const TICK_MS = 60_000;

/**
 * Zaehlt Maus- und Tastaturaktivitaet *innerhalb des Tabs* pro Minute, keine
 * Inhalte. Wichtige Einschraenkung (SPEZIFIKATION.md 4): erfasst nur, was im
 * eigenen Fenster ankommt - `keydown` feuert nur bei Tastaturfokus, `mousemove`
 * nur wenn der Cursor ueber dem Fenster ist. Waehrend echter Arbeit in einer
 * anderen Anwendung bleibt das meistens bei 0. Misst also die Interaktion mit
 * der Anwendung, nicht die Arbeitsaktivitaet - siehe Limitationen.
 *
 * `wheel` zaehlt zusammen mit `mousemove` in `mouseMoves`, beides ist passive
 * Cursorbewegung statt einer gezielten Aktion wie Klick oder Tastendruck.
 *
 * Ist der Tab am Ende einer Minute nicht sichtbar, wird gar kein Tick
 * geschickt (spart Datenmuell) - die gezaehlten Werte fuer diese Minute
 * verfallen einfach, statt sie in die naechste zu uebernehmen.
 */
export function useActivityTicks(sessionId: string, cycle: number) {
  const countsRef = useRef({ mouseMoves: 0, clicks: 0, keyPresses: 0 });

  useEffect(() => {
    function onMouseMove() {
      countsRef.current.mouseMoves += 1;
    }
    function onWheel() {
      countsRef.current.mouseMoves += 1;
    }
    function onMouseDown() {
      countsRef.current.clicks += 1;
    }
    function onKeyDown() {
      countsRef.current.keyPresses += 1;
    }

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("wheel", onWheel);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("keydown", onKeyDown);

    const interval = window.setInterval(() => {
      const counts = countsRef.current;
      countsRef.current = { mouseMoves: 0, clicks: 0, keyPresses: 0 };

      if (document.visibilityState !== "visible") return;

      enqueueEvent(sessionId, "ACTIVITY_TICK", {
        cycle,
        payload: { ...counts, tabVisible: true },
      });
    }, TICK_MS);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("keydown", onKeyDown);
      window.clearInterval(interval);
    };
  }, [sessionId, cycle]);
}
