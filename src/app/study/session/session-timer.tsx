"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCountdown, formatRemaining, formatRemainingMinutes } from "@/hooks/useCountdown";
import { useRoundTimer } from "@/hooks/useRoundTimer";
import { useTabVisibilityLogging } from "@/hooks/useTabVisibilityLogging";
import { useNudgeSoundSchedule } from "@/hooks/useNudgeSoundSchedule";
import { useNudgeStage } from "@/hooks/useNudgeStage";
import { useNudgeStageLogging } from "@/hooks/useNudgeStageLogging";
import { useActivitySteps } from "@/hooks/useActivitySteps";
import { useActivityTicks } from "@/hooks/useActivityTicks";
import { useBreakEndSound } from "@/hooks/useBreakEndSound";
import { activities, type ActivityId } from "@/content/activities";
import { sendEventNow, startEventQueue } from "@/lib/eventQueue";
import type { EventType } from "@/lib/events";

const MIN_WORK_MIN = 5;
const ADJUSTMENT_STEP_MIN = 5;
const SNOOZE_MS = 5 * 60_000;

// Bewusst minimal (Regel 7: die Arbeitsphase darf nicht ablenken). Die vier
// Nudge-Stufen laufen rein zeitbasiert (Regel 1) und parallel zur
// Ton-Eskalation. Reihenfolge (mit Husin am 09.08. korrigiert): auf die
// Nudge-Reaktion folgt SOFORT das Kurzfeedback (F8) - die Frage "war der
// Zeitpunkt passend" bezieht sich auf die gerade zu Ende gegangene
// Arbeitsphase, nicht auf die noch bevorstehende Pause. Die dort
// entschiedene nächste Arbeitszeit (pendingWorkMin) wird erst nach der
// Pause tatsächlich angewendet, wenn "Sitzung starten" geklickt wird.
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
  // Eigener Bezugspunkt für die Eskalation (Stufen + Ton), getrennt von der
  // echten Rundenendzeit `endsAt`: "Noch 5 Minuten" (reactToSnooze) verschiebt
  // nur diesen, nicht die Runde selbst - die Anzeige "Seit Rundenende" oben
  // bleibt dadurch ehrlich (echte Gesamtverspätung), während die Eskalation
  // nach dem Snooze wirklich bei Stufe 1 neu beginnt (Husin, 25.08.).
  const [nudgeEndsAt, setNudgeEndsAt] = useState(endsAt);
  // Setstate direkt im Render statt in einem Effect - offiziell empfohlenes
  // Muster fürs Zurücksetzen von State bei einer geänderten Prop (neue
  // Runde), ohne einen zusätzlichen Render-Umweg über einen Effect.
  const [prevEndsAtForNudge, setPrevEndsAtForNudge] = useState(endsAt);
  if (endsAt !== prevEndsAtForNudge) {
    setPrevEndsAtForNudge(endsAt);
    setNudgeEndsAt(endsAt);
  }
  const isSnoozeActive = nudgeEndsAt !== endsAt;
  // Eigener Countdown bis zum nächsten Hinweis während der Snooze-Gnadenfrist
  // - vorher wurde der Bildschirm hier komplett leer, das wirkte wie ein Fehler
  // (Husin, 26.08.: "Timer geht weg, unsichtbar, soll nicht so sein").
  const { remainingMs: snoozeRemainingMs } = useCountdown(nudgeEndsAt);
  const nudgeStage = useNudgeStage(nudgeEndsAt);
  const [hasReacted, setHasReacted] = useState(false);
  const [wasSkipped, setWasSkipped] = useState(false);
  const [currentWorkMin, setCurrentWorkMin] = useState(initialWorkMin);
  // Während eine Rundenwechsel-Funktion unten läuft (siehe logEvent),
  // blockiert dieser Schalter ein zweites, überlapptes Auslösen durch
  // Doppelklicks - die Funktionen warten jetzt auf die Serverbestätigung,
  // bevor der Zustand wechselt, und die Knöpfe bleiben in dieser kurzen
  // Zeit anklickbar.
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    startEventQueue();
  }, []);

  useTabVisibilityLogging(sessionId, cycle);
  useActivityTicks(sessionId, cycle);
  useNudgeSoundSchedule(nudgeEndsAt, sessionId, state === "WORK" && !hasReacted);
  useNudgeStageLogging(sessionId, cycle, nudgeEndsAt, nudgeStage, state === "WORK" && !hasReacted);

  const isNudging = state === "WORK" && !hasReacted && nudgeStage !== null;

  // Wartet auf die Serverbestätigung, statt nur "abzufeuern": schließt man
  // den Tab (nicht nur Reload) sehr kurz nach einem Rundenwechsel, geht die
  // im Browser gemerkte Rundennummer verloren (sessionStorage überlebt das
  // nicht) - ohne diese Bestätigung kennt der Server dann noch die alte
  // Runde, und die Sitzung fällt beim nächsten Aufruf fälschlich darauf
  // zurück (Husin, 11.08.: genau das mit "Pause starten"/"Überspringen"
  // sofort nach einem frischen Rundenstart beobachtet).
  async function logEvent(
    type: EventType,
    extraPayload?: Record<string, unknown>,
    cycleOverride?: number
  ) {
    await sendEventNow(sessionId, type, {
      cycle: cycleOverride ?? cycle,
      payload: extraPayload,
    });
  }

  async function reactToNudge(type: "BREAK_ACCEPTED" | "BREAK_SKIPPED") {
    if (isTransitioning) return;
    setIsTransitioning(true);
    try {
      const secondsAfterEnd = Math.round((Date.now() - endsAt) / 1000);
      await logEvent(type, { stage: nudgeStage, secondsAfterEnd });
      setHasReacted(true);
      setWasSkipped(type === "BREAK_SKIPPED");
      setRound("FEEDBACK", Date.now());
    } finally {
      setIsTransitioning(false);
    }
  }

  // Verschiebt nur die Eskalation um 5 Minuten (siehe nudgeEndsAt oben), nicht
  // die Runde selbst - kein "Reagieren" im Sinne von BREAK_ACCEPTED/SKIPPED,
  // die Runde läuft unverändert weiter. Eigener Ereignistyp, damit die
  // Kernkennzahl (bei welcher Stufe wird echt reagiert) davon unberührt bleibt.
  async function reactToSnooze() {
    if (isTransitioning) return;
    setIsTransitioning(true);
    try {
      const secondsAfterEnd = Math.round((Date.now() - endsAt) / 1000);
      await logEvent("BREAK_SNOOZED", { stage: nudgeStage, secondsAfterEnd });
      setNudgeEndsAt(Date.now() + SNOOZE_MS);
    } finally {
      setIsTransitioning(false);
    }
  }

  // Gemeinsamer Startpunkt für die nächste Arbeitsrunde - genutzt sowohl
  // wenn eine echte Pause zu Ende geht (fromBreak: true, "Sitzung starten"
  // in BreakScreen) als auch wenn die Pause ganz übersprungen wurde
  // (fromBreak: false, direkt nach dem Kurzfeedback).
  async function startNextRound(newWorkMin: number, fromBreak: boolean) {
    if (isTransitioning) return;
    setIsTransitioning(true);
    try {
      if (fromBreak) {
        await logEvent("BREAK_ENDED");
      }

      const nextCycle = cycle + 1;
      const nextEndsAt = Date.now() + newWorkMin * 60_000;

      // Explizit nextCycle übergeben, nicht das cycle-Closure - React hat den
      // State an dieser Stelle noch nicht auf die neue Runde aktualisiert.
      await logEvent("CYCLE_STARTED", undefined, nextCycle);
      await logEvent("WORK_STARTED", undefined, nextCycle);

      setCurrentWorkMin(newWorkMin);
      setHasReacted(false);
      setWasSkipped(false);
      setRound("WORK", nextEndsAt, {
        cycle: nextCycle,
        activityId: null,
        pendingWorkMin: null,
      });
    } finally {
      setIsTransitioning(false);
    }
  }

  async function handleFeedbackSubmitted(newWorkMin: number) {
    if (wasSkipped) {
      // Überspringen soll auch wirklich überspringen: keine
      // Aktivitätsauswahl, keine Pause, direkt in die nächste Runde.
      await startNextRound(newWorkMin, false);
      return;
    }
    // Die neue Arbeitszeit wird nur gemerkt, nicht sofort gestartet - sie
    // kommt erst nach der Pause zum Einsatz (siehe handleStartNextRound).
    setRound("ACTIVITY_CHOICE", Date.now(), { pendingWorkMin: newWorkMin });
  }

  async function handleActivityChosen(chosenId: ActivityId | "none") {
    if (isTransitioning) return;
    setIsTransitioning(true);
    try {
      if (chosenId === "none") {
        await logEvent("ACTIVITY_SKIPPED");
      } else {
        await logEvent("ACTIVITY_SELECTED", { activity: chosenId });
      }
      await logEvent("BREAK_STARTED");
      const breakEndsAt = Date.now() + initialBreakMin * 60_000;
      setRound("BREAK", breakEndsAt, { activityId: chosenId === "none" ? null : chosenId });
    } finally {
      setIsTransitioning(false);
    }
  }

  async function handleStartNextRound() {
    await startNextRound(pendingWorkMin ?? currentWorkMin, true);
  }

  return (
    <main
      className="flex min-h-screen flex-1 flex-col items-center justify-center gap-4 px-4"
      style={{
        backgroundColor: isNudging ? "var(--background-nudge)" : "var(--background)",
        transition: "background-color 60s ease",
      }}
    >
      {(state === "WORK" || state === "BREAK") && !isNudging && (
        <div
          aria-hidden="true"
          className={`phase-glow ${state === "BREAK" ? "phase-glow-break" : "phase-glow-work"}`}
        />
      )}

      {state === "WORK" && (nudgeStage === null || nudgeStage === 0) && (
        <div className="relative z-10 flex flex-col items-center gap-5">
          <span className="rounded-full border border-black/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-neutral-400 dark:border-white/15 dark:text-neutral-500">
            Fokus · Runde {cycle}
          </span>
          {!isSnoozeActive && remainingMs !== null && (
            <div className="rounded-3xl border border-black/5 px-14 py-10 dark:border-white/10">
              <span className="text-7xl font-extralight tabular-nums text-neutral-500 dark:text-neutral-400">
                {formatRemaining(remainingMs)}
              </span>
            </div>
          )}
          {isSnoozeActive && !hasReacted && snoozeRemainingMs !== null && (
            <p className="text-lg text-neutral-400 dark:text-neutral-600">
              Nächster Hinweis in {formatRemainingMinutes(snoozeRemainingMs)}
            </p>
          )}
        </div>
      )}

      {!hasReacted && (nudgeStage === 1 || nudgeStage === 2) && (
        <NudgeCard
          big={nudgeStage === 2}
          overtimeMs={overtimeMs}
          onAccept={() => reactToNudge("BREAK_ACCEPTED")}
          onSkip={() => reactToNudge("BREAK_SKIPPED")}
          onSnooze={reactToSnooze}
        />
      )}

      {!hasReacted && nudgeStage === 3 && (
        <NudgeModal
          overtimeMs={overtimeMs}
          onAccept={() => reactToNudge("BREAK_ACCEPTED")}
          onSkip={() => reactToNudge("BREAK_SKIPPED")}
          onSnooze={reactToSnooze}
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
  overtimeMs,
  onAccept,
  onSkip,
  onSnooze,
}: {
  big: boolean;
  overtimeMs: number | null;
  onAccept: () => void;
  onSkip: () => void;
  onSnooze: () => void;
}) {
  return (
    <div
      className={`fixed bottom-6 right-6 rounded-lg border border-black/10 bg-white/95 shadow-sm dark:border-white/15 dark:bg-neutral-900/95 ${
        big ? "w-72 p-5 animate-nudge-pulse" : "w-60 p-4"
      }`}
    >
      {overtimeMs !== null && (
        <p className="mb-1 text-xs text-neutral-400 dark:text-neutral-600">
          Seit Rundenende: +{formatRemaining(overtimeMs)}
        </p>
      )}
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
          Noch 5 Minuten
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
  overtimeMs,
  onAccept,
  onSkip,
  onSnooze,
}: {
  overtimeMs: number | null;
  onAccept: () => void;
  onSkip: () => void;
  onSnooze: () => void;
}) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/10 dark:bg-black/30">
      <div className="w-80 rounded-lg border border-black/10 bg-white p-6 shadow-lg dark:border-white/15 dark:bg-neutral-900">
        {overtimeMs !== null && (
          <p className="mb-1 text-xs text-neutral-400 dark:text-neutral-600">
            Seit Rundenende: +{formatRemaining(overtimeMs)}
          </p>
        )}
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
          <div className="flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => setAdjustmentMin((prev) => prev - ADJUSTMENT_STEP_MIN)}
              aria-label="5 Minuten weniger"
              className="h-9 w-9 rounded border border-black/15 text-lg leading-none dark:border-white/20"
            >
              −
            </button>
            <span className="w-16 text-sm tabular-nums">
              {adjustmentMin > 0 ? `+${adjustmentMin}` : adjustmentMin} Min
            </span>
            <button
              type="button"
              onClick={() => setAdjustmentMin((prev) => prev + ADJUSTMENT_STEP_MIN)}
              aria-label="5 Minuten mehr"
              className="h-9 w-9 rounded border border-black/15 text-lg leading-none dark:border-white/20"
            >
              +
            </button>
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

// Vier gleichwertig aussehende Optionen - "keine Aktivität" darf nicht wie
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

  // Die Pausenzeit bestimmt allein, wann "Sitzung starten" erscheint - eine
  // Aktivität, die länger dauert als die (ggf. per Kurzfeedback verkürzte)
  // Pause, darf den Weiterknopf nicht blockieren. Endet die Pause während
  // eine Aktivität noch läuft, wird deren Anzeige einfach ausgeblendet,
  // die Aktivität endet quasi mit der Pause (Husin, 26.08.).
  const readyToContinue = breakDone;

  useBreakEndSound(breakEndsAt, !readyToContinue);

  return (
    <div className="relative z-10 flex flex-col items-center gap-5 text-center">
      {remainingMs !== null && (
        <div className="flex flex-col items-center gap-5">
          <span className="rounded-full border border-black/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-neutral-400 dark:border-white/15 dark:text-neutral-500">
            Pause · Runde {cycle}
          </span>
          <div className="rounded-3xl border border-black/5 px-14 py-10 dark:border-white/10">
            <span className="text-7xl font-extralight tabular-nums text-neutral-500 dark:text-neutral-400">
              {formatRemaining(remainingMs)}
            </span>
          </div>
        </div>
      )}

      {activity && !allStepsDone && !breakDone && (
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
  const [confirming, setConfirming] = useState(false);
  const [ending, setEnding] = useState(false);

  async function handleEnd() {
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
    <>
      <button
        type="button"
        onClick={() => setConfirming(true)}
        disabled={ending}
        className="fixed top-4 right-4 z-10 rounded border border-black/15 px-3 py-1.5 text-xs text-neutral-500 hover:border-black/30 disabled:opacity-40 dark:border-white/20 dark:text-neutral-400 dark:hover:border-white/30"
      >
        Sitzung beenden
      </button>

      {confirming && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/10 dark:bg-black/30">
          <div className="w-80 rounded-lg border border-black/10 bg-white p-6 shadow-lg dark:border-white/15 dark:bg-neutral-900">
            <p className="text-sm">
              Sitzung wirklich beenden? Danach geht es weiter zur Nachbefragung.
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirming(false)}
                className="rounded border border-black/15 px-3 py-1.5 text-sm dark:border-white/20"
              >
                Abbrechen
              </button>
              <button
                type="button"
                onClick={handleEnd}
                disabled={ending}
                className="rounded bg-neutral-800 px-3 py-1.5 text-sm text-white disabled:opacity-40 dark:bg-neutral-100 dark:text-neutral-900"
              >
                {ending ? "Wird beendet …" : "Sitzung beenden"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
