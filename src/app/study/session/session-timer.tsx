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
import { useBreakEndSound } from "@/hooks/useBreakEndSound";
import { activities, type ActivityId } from "@/content/activities";

const MIN_WORK_MIN = 5;
const ADJUSTMENT_OPTIONS = [-10, -5, 5, 10] as const;

// Bewusst minimal (Regel 7: die Arbeitsphase darf nicht ablenken). Die vier
// Nudge-Stufen laufen rein zeitbasiert (Regel 1) und parallel zur
// Ton-Eskalation. Reihenfolge (mit Husin am 09.08. korrigiert): auf die
// Nudge-Reaktion folgt SOFORT das Kurzfeedback (F8) - die Frage "war der
// Zeitpunkt passend" bezieht sich auf die gerade zu Ende gegangene
// Arbeitsphase, nicht auf die noch bevorstehende Pause. Die dort
// entschiedene naechste Arbeitszeit (pendingWorkMin) wird erst nach der
// Pause tatsaechlich angewendet, wenn "Sitzung starten" geklickt wird.
export function SessionTimer({
  sessionId,
  cycle: initialCycle,
  initialEndsAt,
  initialWorkMin,
  initialBreakMin,
}: {
  sessionId: string;
  cycle: number;
  initialEndsAt: number;
  initialWorkMin: number;
  initialBreakMin: number;
}) {
  const { cycle, state, endsAt, activityId, pendingWorkMin, setRound } = useRoundTimer(
    sessionId,
    initialCycle,
    "WORK",
    initialEndsAt
  );
  const { remainingMs, overtimeMs } = useCountdown(endsAt);
  const nudgeStage = useNudgeStage(endsAt);
  const [hasReacted, setHasReacted] = useState(false);
  const [wasSkipped, setWasSkipped] = useState(false);
  const [currentWorkMin, setCurrentWorkMin] = useState(initialWorkMin);

  useTabVisibilityLogging(sessionId, cycle);
  useNudgeSoundSchedule(endsAt, sessionId, state === "WORK" && !hasReacted);
  useNudgeStageLogging(sessionId, cycle, endsAt, nudgeStage, state === "WORK" && !hasReacted);

  const isNudging = state === "WORK" && !hasReacted && nudgeStage !== null;

  function logEvent(
    type: string,
    extraPayload?: Record<string, unknown>,
    cycleOverride?: number
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
            cycle: cycleOverride ?? cycle,
            payload: extraPayload,
          },
        ],
      }),
      keepalive: true,
    });
  }

  function reactToNudge(type: "BREAK_ACCEPTED" | "BREAK_SKIPPED") {
    const secondsAfterEnd = Math.round((Date.now() - endsAt) / 1000);
    logEvent(type, { stage: nudgeStage, secondsAfterEnd });
    setHasReacted(true);
    setWasSkipped(type === "BREAK_SKIPPED");
    setRound("FEEDBACK", Date.now());
  }

  // Gemeinsamer Startpunkt fuer die naechste Arbeitsrunde - genutzt sowohl
  // wenn eine echte Pause zu Ende geht (fromBreak: true, "Sitzung starten"
  // in BreakScreen) als auch wenn die Pause ganz uebersprungen wurde
  // (fromBreak: false, direkt nach dem Kurzfeedback).
  function startNextRound(newWorkMin: number, fromBreak: boolean) {
    if (fromBreak) {
      logEvent("BREAK_ENDED");
    }

    const nextCycle = cycle + 1;
    const nextEndsAt = Date.now() + newWorkMin * 60_000;

    // Explizit nextCycle uebergeben, nicht das cycle-Closure - React hat den
    // State an dieser Stelle noch nicht auf die neue Runde aktualisiert.
    logEvent("CYCLE_STARTED", undefined, nextCycle);
    logEvent("WORK_STARTED", undefined, nextCycle);

    setCurrentWorkMin(newWorkMin);
    setHasReacted(false);
    setWasSkipped(false);
    setRound("WORK", nextEndsAt, {
      cycle: nextCycle,
      activityId: null,
      pendingWorkMin: null,
    });
  }

  function handleFeedbackSubmitted(newWorkMin: number) {
    if (wasSkipped) {
      // Ueberspringen soll auch wirklich ueberspringen: keine
      // Aktivitaetsauswahl, keine Pause, direkt in die naechste Runde.
      startNextRound(newWorkMin, false);
      return;
    }
    // Die neue Arbeitszeit wird nur gemerkt, nicht sofort gestartet - sie
    // kommt erst nach der Pause zum Einsatz (siehe handleStartNextRound).
    setRound("ACTIVITY_CHOICE", Date.now(), { pendingWorkMin: newWorkMin });
  }

  function handleActivityChosen(chosenId: ActivityId | "none") {
    if (chosenId === "none") {
      logEvent("ACTIVITY_SKIPPED");
    } else {
      logEvent("ACTIVITY_SELECTED", { activity: chosenId });
    }
    logEvent("BREAK_STARTED");
    const breakEndsAt = Date.now() + initialBreakMin * 60_000;
    setRound("BREAK", breakEndsAt, { activityId: chosenId === "none" ? null : chosenId });
  }

  function handleStartNextRound() {
    startNextRound(pendingWorkMin ?? currentWorkMin, true);
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

      {overtimeMs !== null &&
        state === "WORK" &&
        !hasReacted &&
        nudgeStage !== null &&
        nudgeStage > 0 && (
          <p className="text-xs text-neutral-400 dark:text-neutral-600">
            +{formatRemaining(overtimeMs)}
          </p>
        )}

      {!hasReacted && (nudgeStage === 1 || nudgeStage === 2) && (
        <NudgeCard
          big={nudgeStage === 2}
          onAccept={() => reactToNudge("BREAK_ACCEPTED")}
          onSkip={() => reactToNudge("BREAK_SKIPPED")}
        />
      )}

      {!hasReacted && nudgeStage === 3 && (
        <NudgeModal
          onAccept={() => reactToNudge("BREAK_ACCEPTED")}
          onSkip={() => reactToNudge("BREAK_SKIPPED")}
        />
      )}

      {state === "FEEDBACK" && (
        <FeedbackScreen
          cycle={cycle}
          currentWorkMin={currentWorkMin}
          onSubmitted={handleFeedbackSubmitted}
        />
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
          onStartNextRound={handleStartNextRound}
        />
      )}

      <EndSessionButton sessionId={sessionId} />
    </main>
  );
}

function NudgeCard({
  big,
  onAccept,
  onSkip,
}: {
  big: boolean;
  onAccept: () => void;
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
  onSkip,
}: {
  onAccept: () => void;
  onSkip: () => void;
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
            onClick={onSkip}
            className="rounded border border-black/15 px-3 py-2 text-sm dark:border-white/20"
          >
            Überspringen
          </button>
        </div>
      </div>
    </div>
  );
}

function FeedbackScreen({
  cycle,
  currentWorkMin,
  onSubmitted,
}: {
  cycle: number;
  currentWorkMin: number;
  onSubmitted: (newWorkMin: number) => void;
}) {
  const [timing, setTiming] = useState<"TOO_EARLY" | "OK" | "TOO_LATE" | null>(null);
  const [adjustmentMin, setAdjustmentMin] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const needsAdjustment = timing === "TOO_EARLY" || timing === "TOO_LATE";
  const canSubmit = timing !== null && (!needsAdjustment || adjustmentMin !== 0);
  const previewWorkMin = Math.max(
    MIN_WORK_MIN,
    currentWorkMin + (needsAdjustment ? adjustmentMin : 0)
  );

  async function handleSubmit() {
    if (!timing) return;
    setSubmitting(true);
    setError(null);

    const response = await fetch("/api/cycle-feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cycle,
        timing,
        adjustmentMin: needsAdjustment ? adjustmentMin : 0,
        activity: null,
        comment: comment.trim() || null,
        clientAt: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      setError("Konnte das Feedback nicht speichern. Bitte versuch es erneut.");
      setSubmitting(false);
      return;
    }

    const data = (await response.json()) as { newWorkMin: number };
    onSubmitted(data.newWorkMin);
  }

  return (
    <div className="w-full max-w-sm space-y-4 text-center">
      <p className="text-sm">War der Zeitpunkt der Pause passend?</p>

      <div className="flex justify-center gap-2">
        {(
          [
            ["TOO_EARLY", "Zu früh"],
            ["OK", "Passend"],
            ["TOO_LATE", "Zu spät"],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => {
              setTiming(value);
              setAdjustmentMin(0);
            }}
            className={`rounded border px-3 py-1.5 text-sm ${
              timing === value
                ? "border-neutral-800 bg-neutral-800 text-white dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900"
                : "border-black/15 dark:border-white/20"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {needsAdjustment && (
        <div className="space-y-2">
          <p className="text-sm">Um wie viele Minuten?</p>
          <div className="flex justify-center gap-2">
            {ADJUSTMENT_OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setAdjustmentMin(option)}
                className={`rounded border px-3 py-1.5 text-sm ${
                  adjustmentMin === option
                    ? "border-neutral-800 bg-neutral-800 text-white dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900"
                    : "border-black/15 dark:border-white/20"
                }`}
              >
                {option > 0 ? `+${option}` : option}
              </button>
            ))}
          </div>
        </div>
      )}

      {timing && (
        <p className="text-xs opacity-60">Nächste Runde: {previewWorkMin} Minuten</p>
      )}

      <textarea
        value={comment}
        onChange={(event) => setComment(event.target.value)}
        placeholder="Kurz in eigenen Worten? (optional)"
        rows={2}
        className="w-full rounded border border-black/15 bg-transparent px-3 py-2 text-sm dark:border-white/20"
      />

      {error && (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={!canSubmit || submitting}
        className="w-full rounded bg-neutral-800 px-3 py-2 text-sm text-white transition-opacity disabled:opacity-40 dark:bg-neutral-100 dark:text-neutral-900"
      >
        {submitting ? "Speichern …" : "Weiter"}
      </button>
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
  onStartNextRound,
}: {
  sessionId: string;
  cycle: number;
  breakEndsAt: number;
  activityId: ActivityId | null;
  onStartNextRound: () => void;
}) {
  const { remainingMs, isDone: breakDone } = useCountdown(breakEndsAt);
  const activity = activityId
    ? activities.find((a) => a.id === activityId) ?? null
    : null;
  const stepDurations = activity ? activity.steps.map((s) => s.durationSeconds) : [];
  const { currentStepIndex, remainingMs: stepRemainingMs, allStepsDone } =
    useActivitySteps(sessionId, cycle, stepDurations);

  const readyToContinue = breakDone && (!activity || allStepsDone);

  useBreakEndSound(breakEndsAt, !readyToContinue);

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
          <p className="text-sm">Pause vorbei.</p>
          <button
            type="button"
            onClick={onStartNextRound}
            className="rounded border border-black/15 px-4 py-2 text-sm dark:border-white/20"
          >
            Sitzung starten
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
      "Sitzung wirklich beenden? Danach geht es weiter zur Nachbefragung."
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
