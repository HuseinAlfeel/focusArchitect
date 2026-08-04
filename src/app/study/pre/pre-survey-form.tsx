"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { preSurveyItems } from "@/content/pre-survey";

type PreSurveyItem = (typeof preSurveyItems)[number];
type YesNoValue = { usesTool: boolean; detail: string };
type AnswerValue = number | string | YesNoValue;

const SCALE_VALUES = [1, 2, 3, 4, 5, 6, 7] as const;

function isAnswered(item: PreSurveyItem, value: AnswerValue | undefined) {
  if (value === undefined) return false;
  if (item.type === "yesno") {
    return typeof (value as YesNoValue).usesTool === "boolean";
  }
  return value !== "" && value !== null;
}

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

function YesNoQuestion({
  value,
  onChange,
}: {
  value: YesNoValue | undefined;
  onChange: (value: YesNoValue) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <ChoiceButton
          active={value?.usesTool === true}
          onClick={() => onChange({ usesTool: true, detail: value?.detail ?? "" })}
        >
          Ja
        </ChoiceButton>
        <ChoiceButton
          active={value?.usesTool === false}
          onClick={() => onChange({ usesTool: false, detail: "" })}
        >
          Nein
        </ChoiceButton>
      </div>
      {value?.usesTool === true && (
        <input
          type="text"
          placeholder="Welches? (optional)"
          value={value.detail}
          onChange={(event) =>
            onChange({ usesTool: true, detail: event.target.value })
          }
          className="w-full rounded border border-black/15 bg-transparent px-3 py-2 text-sm dark:border-white/20"
        />
      )}
    </div>
  );
}

export function PreSurveyForm() {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [triedSubmit, setTriedSubmit] = useState(false);

  const allAnswered = preSurveyItems.every((item) =>
    isAnswered(item, answers[item.id])
  );

  function setAnswer(id: string, value: AnswerValue) {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  }

  async function handleSubmit() {
    setTriedSubmit(true);
    if (!allAnswered) return;

    setSubmitting(true);
    setError(null);

    const response = await fetch("/api/survey", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phase: "PRE",
        answers,
        clientAt: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      setError(
        "Konnte die Antworten nicht speichern. Bitte versuch es erneut."
      );
      setSubmitting(false);
      return;
    }

    router.push("/study");
    router.refresh();
  }

  return (
    <div className="space-y-8">
      {preSurveyItems.map((item) => (
        <div key={item.id} className="space-y-2">
          <p className="text-sm font-medium">{item.question}</p>

          {item.type === "scale" && (
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
          )}

          {item.type === "choice" && (
            <div className="flex flex-wrap gap-2">
              {item.options.map((option) => (
                <ChoiceButton
                  key={option.value}
                  active={answers[item.id] === option.value}
                  onClick={() => setAnswer(item.id, option.value)}
                >
                  {option.label}
                </ChoiceButton>
              ))}
            </div>
          )}

          {item.type === "yesno" && (
            <YesNoQuestion
              value={answers[item.id] as YesNoValue | undefined}
              onChange={(value) => setAnswer(item.id, value)}
            />
          )}

          {triedSubmit && !isAnswered(item, answers[item.id]) && (
            <p className="text-xs text-red-600 dark:text-red-400">
              Bitte beantworten.
            </p>
          )}
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
        {submitting ? "Speichern …" : "Weiter"}
      </button>
    </div>
  );
}
