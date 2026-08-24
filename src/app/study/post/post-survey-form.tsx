"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  likertScaleLabels,
  postSurveyStateItems,
  postSurveyLikertIntro,
  postSurveyPersuasivenessItems,
  postSurveyIntrusivenessItems,
  postSurveyComparisonItem,
  postSurveyTextItems,
  requiredPostSurveyIds,
} from "@/content/post-survey";

const SCALE_VALUES = [1, 2, 3, 4, 5, 6, 7] as const;

type AnswerValue = number | string;

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

function MissingNotice({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <p className="text-xs text-red-600 dark:text-red-400">Bitte beantworten.</p>
  );
}

export function PostSurveyForm({ sessionId }: { sessionId: string }) {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [triedSubmit, setTriedSubmit] = useState(false);

  const allRequiredAnswered = requiredPostSurveyIds.every(
    (id) => answers[id] !== undefined && answers[id] !== ""
  );

  function setAnswer(id: string, value: AnswerValue) {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  }

  async function handleSubmit() {
    setTriedSubmit(true);
    if (!allRequiredAnswered) return;

    setSubmitting(true);
    setError(null);

    const surveyResponse = await fetch("/api/survey", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phase: "POST",
        answers,
        clientAt: new Date().toISOString(),
      }),
    });

    if (!surveyResponse.ok) {
      setError(
        "Konnte die Antworten nicht speichern. Bitte versuch es erneut."
      );
      setSubmitting(false);
      return;
    }

    // Die Nachbefragung ist der eindeutige Abschluss - keine Notwendigkeit
    // mehr, die Sitzung nochmal "aus Versehen beendet" wiederherzustellen.
    await fetch(`/api/session/${sessionId}/finalize`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientAt: new Date().toISOString() }),
    });

    router.push("/study/complete");
    router.refresh();
  }

  return (
    <div className="space-y-8">
      {postSurveyStateItems.map((item) => (
        <div key={item.id} className="space-y-2">
          <p className="text-sm font-medium">{item.question}</p>
          <div className="flex flex-wrap items-center gap-2">
            <span className="w-16 text-xs opacity-60">{item.lowLabel}</span>
            <div className="flex gap-1.5">
              {SCALE_VALUES.map((n) => (
                <ChoiceButton
                  key={n}
                  active={answers[item.id] === n}
                  onClick={() => setAnswer(item.id, n)}
                >
                  {n}
                </ChoiceButton>
              ))}
            </div>
            <span className="w-16 text-right text-xs opacity-60">
              {item.highLabel}
            </span>
          </div>
          <MissingNotice show={triedSubmit && answers[item.id] === undefined} />
        </div>
      ))}

      <div className="space-y-4 border-t border-black/10 pt-6 dark:border-white/10">
        <div className="space-y-1">
          <p className="text-sm font-medium">{postSurveyLikertIntro}</p>
          <p className="text-xs opacity-60">
            {likertScaleLabels.map((label, i) => `${i + 1} = ${label}`).join(" · ")}
          </p>
        </div>

        {postSurveyPersuasivenessItems.map((item) => (
          <div key={item.id} className="space-y-2">
            <p className="text-sm">{item.question}</p>
            <div className="flex gap-1.5">
              {SCALE_VALUES.map((n) => (
                <ChoiceButton
                  key={n}
                  active={answers[item.id] === n}
                  onClick={() => setAnswer(item.id, n)}
                >
                  {n}
                </ChoiceButton>
              ))}
            </div>
            <MissingNotice show={triedSubmit && answers[item.id] === undefined} />
          </div>
        ))}
      </div>

      <div className="space-y-4 border-t border-black/10 pt-6 dark:border-white/10">
        <div className="space-y-1">
          <p className="text-sm font-medium">{postSurveyLikertIntro}</p>
          <p className="text-xs opacity-60">
            {likertScaleLabels.map((label, i) => `${i + 1} = ${label}`).join(" · ")}
          </p>
        </div>

        {postSurveyIntrusivenessItems.map((item) => (
          <div key={item.id} className="space-y-2">
            <p className="text-sm">{item.question}</p>
            <div className="flex gap-1.5">
              {SCALE_VALUES.map((n) => (
                <ChoiceButton
                  key={n}
                  active={answers[item.id] === n}
                  onClick={() => setAnswer(item.id, n)}
                >
                  {n}
                </ChoiceButton>
              ))}
            </div>
            <MissingNotice show={triedSubmit && answers[item.id] === undefined} />
          </div>
        ))}
      </div>

      <div className="space-y-2 border-t border-black/10 pt-6 dark:border-white/10">
        <p className="text-sm font-medium">{postSurveyComparisonItem.question}</p>
        <div className="flex flex-wrap gap-2">
          {postSurveyComparisonItem.options.map((option) => (
            <ChoiceButton
              key={option.value}
              active={answers[postSurveyComparisonItem.id] === option.value}
              onClick={() => setAnswer(postSurveyComparisonItem.id, option.value)}
            >
              {option.label}
            </ChoiceButton>
          ))}
        </div>
        <MissingNotice
          show={triedSubmit && answers[postSurveyComparisonItem.id] === undefined}
        />
      </div>

      {postSurveyTextItems.map((item) => (
        <div key={item.id} className="space-y-2">
          <p className="text-sm font-medium">{item.question}</p>
          <textarea
            value={(answers[item.id] as string) ?? ""}
            onChange={(event) => setAnswer(item.id, event.target.value)}
            rows={2}
            className="w-full rounded border border-black/15 bg-transparent px-3 py-2 text-sm dark:border-white/20"
          />
        </div>
      ))}

      {error && (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={submitting}
        className="w-full rounded bg-neutral-800 px-3 py-2 text-sm text-white transition-opacity disabled:opacity-40 dark:bg-neutral-100 dark:text-neutral-900"
      >
        {submitting ? "Speichern …" : "Abschließen"}
      </button>
    </div>
  );
}
