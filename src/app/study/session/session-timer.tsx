"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCountdown, formatRemaining } from "@/hooks/useCountdown";
import { useRoundTimer } from "@/hooks/useRoundTimer";
import { useTabVisibilityLogging } from "@/hooks/useTabVisibilityLogging";
import { useNudgeSoundSchedule } from "@/hooks/useNudgeSoundSchedule";
import { useNudgeStage } from "@/hooks/useNudgeStage";
import { useNudgeStageLogging } from "@/hooks/useNudgeStageLogging";
import { useActivitySteps } from "@/hooks/useActivitySteps";
import { activities, type ActivityId } from "@/content/activities";

const SNOOZE_MS = 5 * 60_000;

// Bewusst minimal (Regel 7: die Arbeitsphase darf nicht ablenken). Die vier
// Nudge-Stufen laufen rein zeitbasiert (Regel 1) und parallel zur
// Ton-Eskalation. Nach "Pause starten" folgt Aktivitaetsauswahl (F7) und
// der Pausenbildschirm.
export function SessionTimer({
  sessionId,
  cycle,
  initialEndsAt,
  initialBreakMin,
}: {
  sessionId: string;
  cycle: number;
  initialEndsAt: number;
  initialBreakMin: number;
}) {
  const router = useRouter();
  const { state, endsAt, activityId, setRound } = useRoundTimer(
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

  function logEvent(
    type: string,
    extraPayload?: Record<string, unknown>
  ) {
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
            payload: extraPayload,
          },
        ],
      }),
      keepalive: true,
    });
  }

  function logNudgeReaction(
    type: "BREAK_ACCEPTED" | "BREAK_SNOOZED" | "BREAK_SKIPPED",
    extraPayload?: Record<string, unknown>
  ) {
    const secondsAfterEnd = Math.round((Date.now() - endsAt) / 1000);
    logEvent(type, { stage: nudgeStage, secondsAfterEnd, ...extraPayload });
  }

  function handleAccept() {
    logNudgeReaction("BREAK_ACCEPTED");
    setHasReacted(true);
    setRound("ACTIVITY_CHOICE", Date.now());
  }

  function handleSnooze() {
    logNudgeReaction("BREAK_SNOOZED", { extendedByMs: SNOOZE_MS });
    setRound("WORK", endsAt + SNOOZE_MS);
  }

  function handleSkip() {
    logNudgeReaction("BREAK_SKIPPED", { extendedByMs: SNOOZE_MS });
    setRound("WORK", endsAt + SNOOZE_MS);
  }

  function handleActivityChosen(chosenId: ActivityId | "none") {
    if (chosenId === "none") {
      logEvent("ACTIVITY_SKIPPED");
    } else {
      logEvent("ACTIVITY_SELECTED", { activity: chosenId });
    }
    logEvent("BREAK_STARTED");
    const breakEndsAt = Date.now() + initialBreakMin * 60_000;
    setRound("BREAK", breakEndsAt, chosenId === "none" ? null : chosenId);
  }

  function handleReadyToContinue() {
    logEvent("BREAK_ENDED");
    router.push("/study");
    router.refresh();
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

      {state === "ACTIVITY_CHOICE" && (
        <ActivityChoiceScreen onChoose={handleActivityChosen} />
      )}

      {state === "BREAK" && (
        <BreakScreen
          sessionId={sessionId}
          cycle={cycle}
          breakEndsAt={endsAt}
          activityId={activityId as ActivityId | null}
          onReady={handleReadyToContinue}
        />
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

// Vier gleichwertig aussehende Optionen - "keine Aktivitaet" darf nicht wie
// die schlechte Wahl aussehen, sonst verzerrt das die Daten (SPEZIFIKATION.md [7]).
function ActivityChoiceScreen({
  onChoose,
}: {
  onChoose: (id: ActivityId | "none") => void;
}) {
  return (
    <div className="w-full max-w-sm space-y-3 text-center">
      <p className="text-sm">Möchtest du etwas in der Pause machen?</p>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {activities.map((activity) => (
          <button
            key={activity.id}
            type="button"
            onClick={() => onChoose(activity.id)}
            className="rounded border border-black/15 px-4 py-3 text-sm dark:border-white/20"
          >
            {activity.label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => onChoose("none")}
          className="rounded border border-black/15 px-4 py-3 text-sm dark:border-white/20"
        >
          Keine Aktivität
        </button>
      </div>
    </div>
  );
}

function BreakScreen({
  sessionId,
  cycle,
  breakEndsAt,
  activityId,
  onReady,
}: {
  sessionId: string;
  cycle: number;
  breakEndsAt: number;
  activityId: ActivityId | null;
  onReady: () => void;
}) {
  const { remainingMs, isDone: breakDone } = useCountdown(breakEndsAt);
  const activity = activityId
    ? activities.find((a) => a.id === activityId) ?? null
    : null;
  const stepDurations = activity ? activity.steps.map((s) => s.durationSeconds) : [];
  const { currentStepIndex, remainingMs: stepRemainingMs, allStepsDone } =
    useActivitySteps(sessionId, cycle, stepDurations);

  const readyToContinue = breakDone && (!activity || allStepsDone);

  return (
    <div className="flex flex-col items-center gap-4 text-center">
      {remainingMs !== null && (
        <p className="text-sm text-neutral-400 dark:text-neutral-600">
          Pause: {formatRemaining(remainingMs)}
        </p>
      )}

      {activity && !allStepsDone && (
        <div className="max-w-xs space-y-1">
          <p className="text-sm">{activity.steps[currentStepIndex]?.instruction}</p>
          {stepRemainingMs !== null && (
            <p className="text-xs opacity-50">{formatRemaining(stepRemainingMs)}</p>
          )}
        </div>
      )}

      {readyToContinue && (
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm">Bereit weiterzuarbeiten?</p>
          <button
            type="button"
            onClick={onReady}
            className="rounded border border-black/15 px-4 py-2 text-sm dark:border-white/20"
          >
            Weiter
          </button>
        </div>
      )}
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
