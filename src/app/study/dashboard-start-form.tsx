"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  sessionStartStateItems,
  sessionStartSetupHint,
} from "@/content/session-start";

const SCALE_VALUES = [1, 2, 3, 4, 5, 6, 7] as const;

function ChoiceButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded border px-3 py-1.5 text-sm ${
        active
          ? "border-neutral-800 bg-neutral-800 text-white dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900"
          : "border-black/15 dark:border-white/20"
      }`}
    >
      {children}
    </button>
  );
}

// Das "Jetzt": Dashboard und Sitzungsstart in einem (14.09.). Die
// Vorbefragung ist ein einmaliges Profil, das hier Abgefragte dagegen ist
// situativ und kommt bei jedem Timer-Start neu dran. Der Knopf startet die
// Runde sofort und springt direkt zum Timer, keine Zwischenseite mehr.
export function DashboardStartForm({
  participantCode,
  sessionId,
  initialWorkMin,
  initialBreakMin,
}: {
  participantCode: string;
  sessionId: string;
  initialWorkMin: number;
  initialBreakMin: number;
}) {
  const router = useRouter();
  const [taskDescription, setTaskDescription] = useState("");
  const [stateAnswers, setStateAnswers] = useState<Record<string, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [triedSubmit, setTriedSubmit] = useState(false);
  const [setupConfirmed, setSetupConfirmed] = useState(false);

  const allAnswered =
    taskDescription.trim() !== "" &&
    setupConfirmed &&
    sessionStartStateItems.every((item) => stateAnswers[item.id] !== undefined);

  async function handleSubmit() {
    setTriedSubmit(true);
    if (!allAnswered) return;

    setSubmitting(true);
    setError(null);

    const response = await fetch(`/api/session/${sessionId}/start`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        taskDescription,
        restedAtStart: stateAnswers.restedAtStart,
        focusAtStart: stateAnswers.focusAtStart,
        clientAt: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      setError(
        data?.error ?? "Konnte die Sitzung nicht starten. Bitte versuch es erneut."
      );
      setSubmitting(false);
      return;
    }

    // Direkt zum Timer, keine Zwischenstation mehr über den Hub.
    router.push("/study/session");
    router.refresh();
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-medium">Hallo {participantCode}!</h1>
        <p className="mt-1 text-sm opacity-80">
          Bevor es losgeht: Wie sieht es jetzt gerade aus?
        </p>
      </div>

      <div className="space-y-1">
        <label htmlFor="task" className="block text-sm font-medium">
          Woran wirst du in dieser Sitzung arbeiten?
        </label>
        <input
          id="task"
          type="text"
          autoFocus
          value={taskDescription}
          onChange={(event) => setTaskDescription(event.target.value)}
          className="w-full rounded border border-black/15 bg-transparent px-3 py-2 text-sm dark:border-white/20"
          placeholder="z. B. Kapitel 3 der Arbeit schreiben"
        />
        {triedSubmit && !taskDescription.trim() && (
          <p className="text-xs text-red-600 dark:text-red-400">Bitte beantworten.</p>
        )}
      </div>

      {sessionStartStateItems.map((item) => (
        <div key={item.id} className="space-y-2">
          <p className="text-sm font-medium">{item.question}</p>
          <div className="flex flex-wrap items-center gap-2">
            <span className="w-16 text-xs opacity-60">{item.lowLabel}</span>
            <div className="flex gap-1.5">
              {SCALE_VALUES.map((n) => (
                <ChoiceButton
                  key={n}
                  active={stateAnswers[item.id] === n}
                  onClick={() =>
                    setStateAnswers((prev) => ({ ...prev, [item.id]: n }))
                  }
                >
                  {n}
                </ChoiceButton>
              ))}
            </div>
            <span className="w-16 text-right text-xs opacity-60">
              {item.highLabel}
            </span>
          </div>
          {triedSubmit && stateAnswers[item.id] === undefined && (
            <p className="text-xs text-red-600 dark:text-red-400">Bitte beantworten.</p>
          )}
        </div>
      ))}

      <div className="space-y-3 rounded-2xl border border-black/10 p-4 dark:border-white/15">
        <p className="text-sm font-medium">{sessionStartSetupHint.title}</p>
        <ul className="space-y-1.5">
          {sessionStartSetupHint.points.map((point) => (
            <li key={point} className="flex gap-2 text-sm opacity-80">
              <span aria-hidden="true" className="opacity-50">
                ·
              </span>
              <span>{point}</span>
            </li>
          ))}
        </ul>
        <label className="flex items-start gap-2 text-sm">
          <input
            type="checkbox"
            checked={setupConfirmed}
            onChange={(event) => setSetupConfirmed(event.target.checked)}
            className="mt-0.5"
          />
          <span>{sessionStartSetupHint.confirmLabel}</span>
        </label>
        {triedSubmit && !setupConfirmed && (
          <p className="text-xs text-red-600 dark:text-red-400">
            Bitte einmal bestätigen.
          </p>
        )}
      </div>

      <p className="text-xs opacity-50">
        Start: {initialWorkMin} Minuten Arbeit, {initialBreakMin} Minuten Pause. Das
        System lernt aus deinem Feedback und passt sich später an dich an.
      </p>

      {error && (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={submitting}
        className="w-full rounded-xl bg-neutral-800 px-6 py-5 text-lg font-semibold text-white transition-opacity disabled:opacity-40 dark:bg-neutral-100 dark:text-neutral-900"
      >
        {submitting ? "Wird gestartet …" : "Fokus-Sitzung starten"}
      </button>
    </div>
  );
}
