"use client";

import { useState, type UIEvent } from "react";
import { useRouter } from "next/navigation";
import { consentContent } from "@/content/consent";

const SCROLL_END_THRESHOLD_PX = 16;

export function ConsentForm() {
  const router = useRouter();
  const [hasReadToEnd, setHasReadToEnd] = useState(false);
  const [checked, setChecked] = useState<boolean[]>(
    () => consentContent.checkboxLabels.map(() => false)
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const allChecked = checked.every(Boolean);

  function toggleChecked(index: number, value: boolean) {
    setChecked((prev) => prev.map((c, i) => (i === index ? value : c)));
  }

  function handleScroll(event: UIEvent<HTMLDivElement>) {
    const el = event.currentTarget;
    const reachedEnd =
      el.scrollTop + el.clientHeight >= el.scrollHeight - SCROLL_END_THRESHOLD_PX;
    if (reachedEnd) setHasReadToEnd(true);
  }

  // Falls der Text ausnahmsweise ganz ohne Scrollen in den Rahmen passt
  // (z. B. sehr großer Bildschirm), gilt er von Anfang an als gelesen.
  function handleContentRef(node: HTMLDivElement | null) {
    if (node && node.scrollHeight <= node.clientHeight) {
      setHasReadToEnd(true);
    }
  }

  async function handleSubmit() {
    setSubmitting(true);
    setError(null);

    const response = await fetch("/api/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientAt: new Date().toISOString() }),
    });

    if (!response.ok) {
      setError(
        "Konnte die Einwilligung nicht speichern. Bitte versuch es erneut."
      );
      setSubmitting(false);
      return;
    }

    router.push("/study");
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <div
        ref={handleContentRef}
        onScroll={handleScroll}
        className="max-h-80 space-y-4 overflow-y-auto rounded border border-black/10 p-4 dark:border-white/15"
      >
        {consentContent.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="text-sm font-medium">{section.heading}</h2>
            <p className="mt-1 text-sm opacity-80">{section.body}</p>
          </section>
        ))}
      </div>

      <p className="text-xs opacity-60" aria-live="polite">
        {hasReadToEnd
          ? "✓ Text vollständig gelesen."
          : "Bitte lies den Text bis zum Ende (runterscrollen), bevor du zustimmen kannst."}
      </p>

      <div className="space-y-2">
        {consentContent.checkboxLabels.map((label, index) => (
          <label
            key={label}
            className={`flex items-start gap-2 text-sm ${
              hasReadToEnd ? "" : "opacity-40"
            }`}
          >
            <input
              type="checkbox"
              checked={checked[index]}
              disabled={!hasReadToEnd}
              onChange={(event) => toggleChecked(index, event.target.checked)}
              className="mt-0.5"
            />
            <span>{label}</span>
          </label>
        ))}
      </div>

      {error && (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}

      <button
        type="button"
        disabled={!allChecked || submitting}
        onClick={handleSubmit}
        className="w-full rounded bg-neutral-800 px-3 py-2 text-sm text-white transition-opacity disabled:opacity-40 dark:bg-neutral-100 dark:text-neutral-900"
      >
        {submitting ? "Speichern …" : consentContent.submitLabel}
      </button>
    </div>
  );
}
