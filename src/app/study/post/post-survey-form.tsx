"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  likertScaleLabels,
  postSurveyStateItems,
  postSurveyLikertIntro,
  postSurveyPersuasivenessItems,
  postSurveyIntrusivenessItems,
  postSurveyComparisonItem,
  postSurveyComparisonReasonItem,
  postSurveyClosingTextItems,
  requiredPostSurveyIds,
} from "@/content/post-survey";

const SCALE_VALUES = [1, 2, 3, 4, 5, 6, 7] as const;
const TOTAL_STEPS = 3;

type AnswerValue = number | string;
type PageTiming = { loadedAt: string; submittedAt?: string };

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

function StepProgress({ step }: { step: number }) {
  return (
    <p className="text-xs uppercase tracking-wide opacity-50">
      Schritt {step} von {TOTAL_STEPS}
    </p>
  );
}

function ScaleQuestion({
  question,
  lowLabel,
  highLabel,
  value,
  onChange,
  showMissing,
}: {
  question: string;
  lowLabel: string;
  highLabel: string;
  value: AnswerValue | undefined;
  onChange: (value: number) => void;
  showMissing: boolean;
}) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">{question}</p>
      <div className="flex flex-wrap items-center gap-2">
        <span className="w-16 text-xs opacity-60">{lowLabel}</span>
        <div className="flex gap-1.5">
          {SCALE_VALUES.map((n) => (
            <ChoiceButton key={n} active={value === n} onClick={() => onChange(n)}>
              {n}
            </ChoiceButton>
          ))}
        </div>
        <span className="w-16 text-right text-xs opacity-60">{highLabel}</span>
      </div>
      <MissingNotice show={showMissing} />
    </div>
  );
}

export function PostSurveyForm({ sessionId }: { sessionId: string }) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [triedStep, setTriedStep] = useState<number | null>(null);

  // page_load_timestamp/page_submit_timestamp je Seite (Husin, 14.09.) - für
  // die Auswertung, um über die Lesezeit Blindklicker zu erkennen. Als Ref,
  // weil es reine Buchführung ist und keinen Re-Render braucht.
  const timingsRef = useRef<Record<number, PageTiming>>({});

  useEffect(() => {
    timingsRef.current[1] = { loadedAt: new Date().toISOString() };
  }, []);

  function markLoaded(nextStep: number) {
    timingsRef.current[nextStep] = { loadedAt: new Date().toISOString() };
  }

  function markSubmitted(currentStep: number) {
    const entry = timingsRef.current[currentStep] ?? {
      loadedAt: new Date().toISOString(),
    };
    timingsRef.current[currentStep] = { ...entry, submittedAt: new Date().toISOString() };
  }

  function goToStep(next: number) {
    markLoaded(next);
    setStep(next);
  }

  function setAnswer(id: string, value: AnswerValue) {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  }

  function handleStep1Next() {
    setTriedStep(1);
    const required = [...postSurveyStateItems.map((i) => i.id), postSurveyComparisonItem.id];
    const allAnswered = required.every(
      (id) => answers[id] !== undefined && answers[id] !== ""
    );
    if (!allAnswered) return;
    markSubmitted(1);
    goToStep(2);
  }

  function handleStep2Next() {
    setTriedStep(2);
    const required = [
      ...postSurveyPersuasivenessItems.map((i) => i.id),
      ...postSurveyIntrusivenessItems.map((i) => i.id),
    ];
    const allAnswered = required.every(
      (id) => answers[id] !== undefined && answers[id] !== ""
    );
    if (!allAnswered) return;
    markSubmitted(2);
    goToStep(3);
  }

  async function handleFinalSubmit() {
    const allRequiredAnswered = requiredPostSurveyIds.every(
      (id) => answers[id] !== undefined && answers[id] !== ""
    );
    // Sollte nicht vorkommen - die Pflichtfragen stehen alle auf Seite 1 und 2
    // und werden dort schon geprueft. Falls doch, darf der Knopf nicht
    // wortlos nichts tun: die Person sitzt sonst vor der letzten Seite ihrer
    // Nachbefragung fest, ohne zu sehen warum, und ihre Antworten gehen
    // verloren (Datenverlust-Pruefung 18.09.).
    if (!allRequiredAnswered) {
      setError(
        "Auf einer der vorherigen Seiten fehlt noch eine Antwort. Geh bitte einmal zurück und ergänze sie."
      );
      return;
    }

    markSubmitted(3);
    setSubmitting(true);
    setError(null);

    const surveyResponse = await fetch("/api/survey", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        phase: "POST",
        answers: { ...answers, pageTimings: timingsRef.current },
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

  if (step === 1) {
    return (
      <div className="space-y-8">
        <div className="space-y-2">
          <StepProgress step={1} />
          <h1 className="text-xl font-medium">Sitzung beendet! Wie geht es dir jetzt?</h1>
        </div>

        {postSurveyStateItems.map((item) => (
          <ScaleQuestion
            key={item.id}
            question={item.question}
            lowLabel={item.lowLabel}
            highLabel={item.highLabel}
            value={answers[item.id]}
            onChange={(value) => setAnswer(item.id, value)}
            showMissing={triedStep === 1 && answers[item.id] === undefined}
          />
        ))}

        <div className="space-y-2">
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
            show={triedStep === 1 && answers[postSurveyComparisonItem.id] === undefined}
          />

          <textarea
            value={(answers[postSurveyComparisonReasonItem.id] as string) ?? ""}
            onChange={(event) =>
              setAnswer(postSurveyComparisonReasonItem.id, event.target.value)
            }
            placeholder={postSurveyComparisonReasonItem.question}
            rows={2}
            className="w-full rounded border border-black/15 bg-transparent px-3 py-2 text-sm dark:border-white/20"
          />
        </div>

        <button
          type="button"
          onClick={handleStep1Next}
          className="w-full rounded bg-neutral-800 px-3 py-2 text-sm text-white transition-opacity dark:bg-neutral-100 dark:text-neutral-900"
        >
          Weiter
        </button>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="space-y-8">
        <div className="space-y-2">
          <StepProgress step={2} />
          <h1 className="text-xl font-medium">Bewertung des Systems</h1>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-semibold">{postSurveyLikertIntro}</p>
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs opacity-60">
            {likertScaleLabels.map((label, i) => (
              <span key={label}>
                {i + 1} = {label}
                {i < likertScaleLabels.length - 1 ? " ·" : ""}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-6">
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
              <MissingNotice show={triedStep === 2 && answers[item.id] === undefined} />
            </div>
          ))}
        </div>

        <hr className="border-black/10 dark:border-white/10" />

        <div className="space-y-6">
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
              <MissingNotice show={triedStep === 2 && answers[item.id] === undefined} />
            </div>
          ))}
        </div>

        {error && (
          <p role="alert" className="text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        )}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => goToStep(1)}
            className="rounded border border-black/15 px-4 py-2 text-sm dark:border-white/20"
          >
            Zurück
          </button>
          <button
            type="button"
            onClick={handleStep2Next}
            className="flex-1 rounded bg-neutral-800 px-3 py-2 text-sm text-white transition-opacity dark:bg-neutral-100 dark:text-neutral-900"
          >
            Weiter
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <StepProgress step={3} />
        <h1 className="text-xl font-medium">Noch ein kurzes Feedback zum Schluss (Optional)</h1>
      </div>

      {postSurveyClosingTextItems.map((item) => (
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

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => goToStep(2)}
          disabled={submitting}
          className="rounded border border-black/15 px-4 py-2 text-sm disabled:opacity-40 dark:border-white/20"
        >
          Zurück
        </button>
        <button
          type="button"
          onClick={handleFinalSubmit}
          disabled={submitting}
          className="flex-1 rounded bg-neutral-800 px-3 py-2 text-sm text-white transition-opacity disabled:opacity-40 dark:bg-neutral-100 dark:text-neutral-900"
        >
          {submitting ? "Speichern …" : "Befragung abschließen"}
        </button>
      </div>
    </div>
  );
}
