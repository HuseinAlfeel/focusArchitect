"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function ReopenSessionButton({ sessionId }: { sessionId: string }) {
  const router = useRouter();
  const [reopening, setReopening] = useState(false);

  async function handleReopen() {
    setReopening(true);

    await fetch(`/api/session/${sessionId}/reopen`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientAt: new Date().toISOString() }),
    });

    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleReopen}
      disabled={reopening}
      className="rounded border border-black/15 px-4 py-2 text-sm disabled:opacity-50 dark:border-white/20"
    >
      {reopening ? "Wird fortgesetzt …" : "Sitzung fortsetzen"}
    </button>
  );
}
