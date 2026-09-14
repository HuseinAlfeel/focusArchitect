"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  preSurveyStep1Items,
  preSurveyStep2Items,
  preSurveyBlockTitles,
} from "@/content/pre-survey";
import { onboardingIntroContent } from "@/content/onboarding-intro";

type PreSurveyItem =
  | (typeof preSurveyStep1Items)[number]
  | (typeof preSurveyStep2Items)[number];
type YesNoValue = { yes: boolean; followUp: string };
type AnswerValue = number | string | YesNoValue;

const SCALE_VALUES = [1, 2, 3, 4, 5, 6, 7] as const;

function isAnswered(item: PreSurveyItem, value: AnswerValue | undefined) {
  if (item.type === "yesno") {
    const v = value as YesNoValue | undefined;
    if (typeof v?.yes !== "boolean") return false;
    if (!v.yes) return true;
    if (!("followUp" in item)) return true;
    if (item.followUp.type === "number") {
      return v.followUp !== "" && !Number.isNaN(Number(v.followUp));
    }
    return v.followUp.trim() !== "";
  }
  if (value === undefined) return false;
  if (item.type === "number") {
    return value !== "" && value !== null && !Number.isNaN(Number(value));
  }
  if (item.type === "text" || item.type === "textarea") {
    return typeof value === "string" && value.trim() !== "";
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
  followUp,
  value,
  onChange,
}: {
  followUp: { type: "number" | "text"; question: string } | undefined;
  value: YesNoValue | undefined;
  onChange: (value: YesNoValue) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <ChoiceButton
          active={value?.yes === true}
          onClick={() => onChange({ yes: true, followUp: value?.followUp ?? "" })}
        >
          Ja
        </ChoiceButton>
        <ChoiceButton
          active={value?.yes === false}
          onClick={() => onChange({ yes: false, followUp: "" })}
        >
          Nein
        </ChoiceButton>
      </div>
      {followUp && value?.yes === true && (
        <div className="space-y-1">
          <p className="text-sm">{followUp.question}</p>
          <input
            type={followUp.type === "number" ? "number" : "text"}
            inputMode={followUp.type === "number" ? "decimal" : undefined}
            value={value.followUp}
            onChange={(event) =>
              onChange({ yes: true, followUp: event.target.value })
            }
            className="w-full rounded border border-black/15 bg-transparent px-3 py-2 text-sm dark:border-white/20"
          />
        </div>
      )}
    </div>
  );
}

function SurveyItemField({
  item,
  value,
  onChange,
  showMissing,
}: {
  item: PreSurveyItem;
  value: AnswerValue | undefined;
  onChange: (value: AnswerValue) => void;
  showMissing: boolean;
}) {
  return (
    <div className="space-y-2">
      {preSurveyBlockTitles[item.id] && (
        <h2 className="pt-2 text-base font-semibold">{preSurveyBlockTitles[item.id]}</h2>
      )}
      <p className="text-sm font-medium">{item.question}</p>

      {item.type === "number" && (
        <input
          type="number"
          inputMode="decimal"
          min={0}
          max={24}
          step={0.5}
          placeholder="z. B. 8"
          value={(value as number | string) ?? ""}
          onChange={(event) => onChange(event.target.value)}
          className="w-24 rounded border border-black/15 bg-transparent px-3 py-2 text-sm dark:border-white/20"
        />
      )}

      {item.type === "text" && (
        <input
          type="text"
          value={(value as string) ?? ""}
          onChange={(event) => onChange(event.target.value)}
          className="w-full rounded border border-black/15 bg-transparent px-3 py-2 text-sm dark:border-white/20"
        />
      )}

      {item.type === "textarea" && (
        <textarea
          value={(value as string) ?? ""}
          onChange={(event) => onChange(event.target.value)}
          rows={2}
          className="w-full rounded border border-black/15 bg-transparent px-3 py-2 text-sm dark:border-white/20"
        />
      )}

      {item.type === "scale" && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="w-20 text-xs opacity-60">{item.lowLabel}</span>
          <div className="flex gap-1.5">
            {SCALE_VALUES.map((n) => (
              <ChoiceButton key={n} active={value === n} onClick={() => onChange(n)}>
                {n}
              </ChoiceButton>
            ))}
          </div>
          <span className="w-20 text-right text-xs opacity-60">{item.highLabel}</span>
        </div>
      )}

      {item.type === "choice" && (
        <div className="flex flex-wrap gap-2">
          {item.options.map((option) => (
            <ChoiceButton
              key={option.value}
              active={value === option.value}
              onClick={() => onChange(option.value)}
            >
              {option.label}
            </ChoiceButton>
          ))}
        </div>
      )}

      {item.type === "yesno" && (
        <YesNoQuestion
          followUp={"followUp" in item ? item.followUp : undefined}
          value={value as YesNoValue | undefined}
          onChange={onChange}
        />
      )}

      {showMissing && !isAnswered(item, value) && (
        <p className="text-xs text-red-600 dark:text-red-400">Bitte beantworten.</p>
      )}
    </div>
  );
}

function StepProgress({ step }: { step: 1 | 2 | 3 }) {
  return (
    <p className="text-xs uppercase tracking-wide opacity-50">Schritt {step} von 3</p>
  );
}

export function PreSurveyForm() {
  const router = useRouter();
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [triedStep, setTriedStep] = useState<1 | 2 | null>(null);

  function setAnswer(id: string, value: AnswerValue) {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  }

  function handleNext() {
    setTriedStep(1);
    const allAnswered = preSurveyStep1Items.every((item) => isAnswered(item, answers[item.id]));
    if (!allAnswered) return;
    setTriedStep(null);
    setStep(2);
  }

  async function handleSubmit() {
    setTriedStep(2);
    const allAnswered = preSurveyStep2Items.every((item) => isAnswered(item, answers[item.id]));
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

  if (step === 0) {
    return (
      <div className="space-y-8">
        <div className="space-y-2">
          <StepProgress step={1} />
          <h1 className="text-xl font-medium">{onboardingIntroContent.title}</h1>
        </div>

        <div className="space-y-3">
          {onboardingIntroContent.paragraphs.map((paragraph) => (
            <p key={paragraph} className="text-sm opacity-80">
              {paragraph}
            </p>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setStep(1)}
          className="w-full rounded bg-neutral-800 px-3 py-2 text-sm text-white transition-opacity dark:bg-neutral-100 dark:text-neutral-900"
        >
          {onboardingIntroContent.buttonLabel}
        </button>
      </div>
    );
  }

  if (step === 1) {
    return (
      <div className="space-y-8">
        <div className="space-y-2">
          <StepProgress step={2} />
          <h1 className="text-xl font-medium">
            Willkommen! Ein paar Angaben zu deinem Arbeitsalltag.
          </h1>
        </div>

        {preSurveyStep1Items.map((item) => (
          <SurveyItemField
            key={item.id}
            item={item}
            value={answers[item.id]}
            onChange={(value) => setAnswer(item.id, value)}
            showMissing={triedStep === 1}
          />
        ))}

        <button
          type="button"
          onClick={handleNext}
          className="w-full rounded bg-neutral-800 px-3 py-2 text-sm text-white transition-opacity dark:bg-neutral-100 dark:text-neutral-900"
        >
          Weiter (1/2) →
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <StepProgress step={3} />
        <h1 className="text-xl font-medium">Noch dein Pausenverhalten.</h1>
      </div>

      {preSurveyStep2Items.map((item) => (
        <SurveyItemField
          key={item.id}
          item={item}
          value={answers[item.id]}
          onChange={(value) => setAnswer(item.id, value)}
          showMissing={triedStep === 2}
        />
      ))}

      {error && (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => setStep(1)}
          disabled={submitting}
          className="rounded border border-black/15 px-4 py-2 text-sm disabled:opacity-40 dark:border-white/20"
        >
          Zurück
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting}
          className="flex-1 rounded bg-neutral-800 px-3 py-2 text-sm text-white transition-opacity disabled:opacity-40 dark:bg-neutral-100 dark:text-neutral-900"
        >
          {submitting ? "Speichern …" : "Profil speichern & Weiter →"}
        </button>
      </div>
    </div>
  );
}
