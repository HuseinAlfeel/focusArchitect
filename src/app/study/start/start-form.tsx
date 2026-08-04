"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function StartForm({
  sessionId,
  initialWorkMin,
  initialBreakMin,
}: {
  sessionId: string;
  initialWorkMin: number;
  initialBreakMin: number;
}) {
  const router = useRouter();
  const [taskDescription, setTaskDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    if (!taskDescription.trim()) {
      setError("Bitte beschreibe kurz, woran du arbeitest.");
      return;
    }

    setSubmitting(true);
    setError(null);

    const response = await fetch(`/api/session/${sessionId}/start`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        taskDescription,
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

    router.push("/study");
    router.refresh();
  }

  return (
    <div className="space-y-6">
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
      </div>

      <div className="rounded border border-black/10 p-4 text-sm dark:border-white/15">
        <p>
          Start: <strong>{initialWorkMin} Minuten</strong> Arbeit,{" "}
          <strong>{initialBreakMin} Minuten</strong> Pause.
        </p>
        <p className="mt-1 text-xs opacity-60">
          Du kannst das nach jeder Pause anpassen.
        </p>
      </div>

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
        {submitting ? "Wird gestartet …" : "Sitzung starten"}
      </button>
    </div>
  );
}
