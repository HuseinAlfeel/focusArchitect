"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCountdown, formatRemaining } from "@/hooks/useCountdown";
import { useRoundTimer } from "@/hooks/useRoundTimer";
import { useTabVisibilityLogging } from "@/hooks/useTabVisibilityLogging";

// Bewusst minimal (Regel 7: die Arbeitsphase darf nicht ablenken). Der
// abgestufte Pausenhinweis (F6) fehlt hier noch bewusst.
export function SessionTimer({
  sessionId,
  cycle,
  initialEndsAt,
}: {
  sessionId: string;
  cycle: number;
  initialEndsAt: number;
}) {
  const { state, endsAt } = useRoundTimer(
    sessionId,
    cycle,
    "WORK",
    initialEndsAt
  );
  const { remainingMs, isDone } = useCountdown(endsAt);

  useTabVisibilityLogging(sessionId, cycle);

  return (
    <main className="flex min-h-screen flex-1 flex-col items-center justify-center px-4">
      {remainingMs !== null && state === "WORK" && !isDone && (
        <p className="text-sm text-neutral-400 dark:text-neutral-600">
          {formatRemaining(remainingMs)}
        </p>
      )}

      {remainingMs !== null && state === "WORK" && isDone && (
        <p className="text-sm text-neutral-400 dark:text-neutral-600">
          Zeit abgelaufen — der Pausenhinweis (Phase F6) folgt noch.
        </p>
      )}

      <EndSessionButton sessionId={sessionId} />
    </main>
  );
}

function EndSessionButton({ sessionId }: { sessionId: string }) {
  const router = useRouter();
  const [ending, setEnding] = useState(false);

  async function handleEnd() {
    const confirmed = window.confirm(
      "Sitzung wirklich beenden? Das lässt sich nicht rückgängig machen."
    );
    if (!confirmed) return;

    setEnding(true);

    await fetch(`/api/session/${sessionId}/end`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientAt: new Date().toISOString() }),
    });

    router.push("/study");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleEnd}
      disabled={ending}
      className="fixed bottom-3 right-3 text-xs text-neutral-400 opacity-40 hover:opacity-80 disabled:opacity-20 dark:text-neutral-600"
    >
      Sitzung beenden
    </button>
  );
}
