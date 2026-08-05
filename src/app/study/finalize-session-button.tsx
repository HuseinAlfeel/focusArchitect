"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function FinalizeSessionButton({ sessionId }: { sessionId: string }) {
  const router = useRouter();
  const [finalizing, setFinalizing] = useState(false);

  async function handleFinalize() {
    const confirmed = window.confirm(
      "Wirklich final abgeben? Das kann danach nicht mehr rückgängig gemacht werden."
    );
    if (!confirmed) return;

    setFinalizing(true);

    await fetch(`/api/session/${sessionId}/finalize`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientAt: new Date().toISOString() }),
    });

    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleFinalize}
      disabled={finalizing}
      className="text-sm underline disabled:opacity-50"
    >
      {finalizing ? "Wird abgegeben …" : "Final abgeben"}
    </button>
  );
}
