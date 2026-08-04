"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { consentContent } from "@/content/consent";

export function ConsentForm() {
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    <div className="space-y-4 border-t border-black/10 pt-4 dark:border-white/15">
      <label className="flex items-start gap-2 text-sm">
        <input
          type="checkbox"
          checked={checked}
          onChange={(event) => setChecked(event.target.checked)}
          className="mt-0.5"
        />
        <span>{consentContent.checkboxLabel}</span>
      </label>

      {error && (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}

      <button
        type="button"
        disabled={!checked || submitting}
        onClick={handleSubmit}
        className="w-full rounded bg-neutral-800 px-3 py-2 text-sm text-white transition-opacity disabled:opacity-40 dark:bg-neutral-100 dark:text-neutral-900"
      >
        {submitting ? "Speichern …" : consentContent.submitLabel}
      </button>
    </div>
  );
}
