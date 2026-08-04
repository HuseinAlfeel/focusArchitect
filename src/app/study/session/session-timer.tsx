"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCountdown, formatRemaining } from "@/hooks/useCountdown";
import { useRoundTimer } from "@/hooks/useRoundTimer";
import { useTabVisibilityLogging } from "@/hooks/useTabVisibilityLogging";
import { useNudgeSoundSchedule } from "@/hooks/useNudgeSoundSchedule";

// Bewusst minimal (Regel 7: die Arbeitsphase darf nicht ablenken). Die
// visuellen Stufen (Farbwandel, Karte, Pulsieren, Fenster) fehlen hier noch
// bewusst - laut Absprache laeuft der Ton-Zeitplan parallel dazu, nicht
// anstelle davon.
export function SessionTimer({
  sessionId,
  cycle,
  initialEndsAt,
}: {
  sessionId: string;
  cycle: number;
  initialEndsAt: number;
}) {
  const { state, endsAt, setRound } = useRoundTimer(
    sessionId,
    cycle,
    "WORK",
    initialEndsAt
  );
  const { remainingMs, isDone } = useCountdown(endsAt);
  const [hasReacted, setHasReacted] = useState(false);

  useTabVisibilityLogging(sessionId, cycle);
  useNudgeSoundSchedule(endsAt, sessionId, state === "WORK" && !hasReacted);

  async function handleReact() {
    setHasReacted(true);
    const secondsAfterEnd = Math.round((Date.now() - endsAt) / 1000);

    await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        events: [
          {
            type: "BREAK_ACCEPTED",
            clientAt: new Date().toISOString(),
            cycle,
            payload: { secondsAfterEnd },
          },
        ],
      }),
    });

    setRound("BREAK", Date.now());
  }

  return (
    <main className="flex min-h-screen flex-1 flex-col items-center justify-center gap-4 px-4">
      {remainingMs !== null && state === "WORK" && !isDone && (
        <p className="text-sm text-neutral-400 dark:text-neutral-600">
          {formatRemaining(remainingMs)}
        </p>
      )}

      {remainingMs !== null && state === "WORK" && isDone && !hasReacted && (
        <div className="flex flex-col items-center gap-3">
          <p className="text-sm text-neutral-400 dark:text-neutral-600">
            Zeit für eine Pause.
          </p>
          <button
            type="button"
            onClick={handleReact}
            className="rounded border border-black/15 px-4 py-2 text-sm dark:border-white/20"
          >
            Pause beginnen
          </button>
        </div>
      )}

      {hasReacted && (
        <p className="text-sm text-neutral-400 dark:text-neutral-600">
          Pause beginnt … (echter Pausenbildschirm folgt in F7)
        </p>
      )}

      <EndSessionButton sessionId={sessionId} />
    </main>
  );
}

function EndSessionButton({ sessionId }: { sessionId: string }) {
  const router = useRouter();
  const [ending, setEnding] = useState(false);

  async function handleEnd() {
    const confirmed = window.confirm(
      "Sitzung wirklich beenden? Das lässt sich nicht rückgängig machen."
    );
    if (!confirmed) return;

    setEnding(true);

    await fetch(`/api/session/${sessionId}/end`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientAt: new Date().toISOString() }),
    });

    router.push("/study");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleEnd}
      disabled={ending}
      className="fixed bottom-3 right-3 text-xs text-neutral-400 opacity-40 hover:opacity-80 disabled:opacity-20 dark:text-neutral-600"
    >
      Sitzung beenden
    </button>
  );
}
