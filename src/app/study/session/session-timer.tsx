"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCountdown, formatRemaining } from "@/hooks/useCountdown";
import { useRoundTimer } from "@/hooks/useRoundTimer";
import { useTabVisibilityLogging } from "@/hooks/useTabVisibilityLogging";
import { useNudgeSoundSchedule } from "@/hooks/useNudgeSoundSchedule";
import { useNudgeStage } from "@/hooks/useNudgeStage";
import { useNudgeStageLogging } from "@/hooks/useNudgeStageLogging";

const SNOOZE_MS = 5 * 60_000;

// Bewusst minimal (Regel 7: die Arbeitsphase darf nicht ablenken). Die vier
// Stufen laufen rein zeitbasiert (Regel 1: Zielzeitpunkt, nie hochzaehlen)
// und parallel zur Ton-Eskalation aus useNudgeSoundSchedule.
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
  const { remainingMs } = useCountdown(endsAt);
  const nudgeStage = useNudgeStage(endsAt);
  const [hasReacted, setHasReacted] = useState(false);

  useTabVisibilityLogging(sessionId, cycle);
  useNudgeSoundSchedule(endsAt, sessionId, state === "WORK" && !hasReacted);
  useNudgeStageLogging(sessionId, cycle, endsAt, nudgeStage, state === "WORK" && !hasReacted);

  const isNudging = state === "WORK" && !hasReacted && nudgeStage !== null;

  function logNudgeEvent(
    type: "BREAK_ACCEPTED" | "BREAK_SNOOZED" | "BREAK_SKIPPED",
    extraPayload?: Record<string, unknown>
  ) {
    const secondsAfterEnd = Math.round((Date.now() - endsAt) / 1000);
    void fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        events: [
          {
            type,
            clientAt: new Date().toISOString(),
            cycle,
            payload: { stage: nudgeStage, secondsAfterEnd, ...extraPayload },
          },
        ],
      }),
    });
  }

  function handleAccept() {
    logNudgeEvent("BREAK_ACCEPTED");
    setHasReacted(true);
    setRound("BREAK", Date.now());
  }

  function handleSnooze() {
    logNudgeEvent("BREAK_SNOOZED", { extendedByMs: SNOOZE_MS });
    setRound("WORK", endsAt + SNOOZE_MS);
  }

  function handleSkip() {
    logNudgeEvent("BREAK_SKIPPED", { extendedByMs: SNOOZE_MS });
    setRound("WORK", endsAt + SNOOZE_MS);
  }

  return (
    <main
      className="flex min-h-screen flex-1 flex-col items-center justify-center gap-4 px-4"
      style={{
        backgroundColor: isNudging ? "var(--background-nudge)" : "var(--background)",
        transition: "background-color 60s ease",
      }}
    >
      {remainingMs !== null && state === "WORK" && (nudgeStage === null || nudgeStage === 0) && (
        <p className="text-sm text-neutral-400 dark:text-neutral-600">
          {formatRemaining(remainingMs)}
        </p>
      )}

      {hasReacted && (
        <p className="text-sm text-neutral-400 dark:text-neutral-600">
          Pause beginnt … (echter Pausenbildschirm folgt in F7)
        </p>
      )}

      {!hasReacted && (nudgeStage === 1 || nudgeStage === 2) && (
        <NudgeCard
          big={nudgeStage === 2}
          onAccept={handleAccept}
          onSnooze={handleSnooze}
          onSkip={handleSkip}
        />
      )}

      {!hasReacted && nudgeStage === 3 && (
        <NudgeModal onAccept={handleAccept} onSnooze={handleSnooze} />
      )}

      <EndSessionButton sessionId={sessionId} />
    </main>
  );
}

function NudgeCard({
  big,
  onAccept,
  onSnooze,
  onSkip,
}: {
  big: boolean;
  onAccept: () => void;
  onSnooze: () => void;
  onSkip: () => void;
}) {
  return (
    <div
      className={`fixed bottom-6 right-6 rounded-lg border border-black/10 bg-white/95 shadow-sm dark:border-white/15 dark:bg-neutral-900/95 ${
        big ? "w-72 p-5 animate-nudge-pulse" : "w-60 p-4"
      }`}
    >
      <p className="text-sm">Zeit für eine Pause.</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onAccept}
          className="rounded border border-black/15 px-3 py-1.5 text-xs dark:border-white/20"
        >
          Pause starten
        </button>
        <button
          type="button"
          onClick={onSnooze}
          className="rounded border border-black/15 px-3 py-1.5 text-xs dark:border-white/20"
        >
          5 Min später
        </button>
        <button
          type="button"
          onClick={onSkip}
          className="rounded px-3 py-1.5 text-xs opacity-60"
        >
          Überspringen
        </button>
      </div>
    </div>
  );
}

function NudgeModal({
  onAccept,
  onSnooze,
}: {
  onAccept: () => void;
  onSnooze: () => void;
}) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/10 dark:bg-black/30">
      <div className="w-80 rounded-lg border border-black/10 bg-white p-6 shadow-lg dark:border-white/15 dark:bg-neutral-900">
        <p className="text-sm">Zeit für eine Pause.</p>
        <div className="mt-4 flex flex-col gap-2">
          <button
            type="button"
            onClick={onAccept}
            className="rounded bg-neutral-800 px-3 py-2 text-sm text-white dark:bg-neutral-100 dark:text-neutral-900"
          >
            Pause starten
          </button>
          <button
            type="button"
            onClick={onSnooze}
            className="rounded border border-black/15 px-3 py-2 text-sm dark:border-white/20"
          >
            Noch 5 Minuten
          </button>
        </div>
      </div>
    </div>
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
      className="fixed bottom-3 left-3 text-xs text-neutral-400 opacity-40 hover:opacity-80 disabled:opacity-20 dark:text-neutral-600"
    >
      Sitzung beenden
    </button>
  );
}
