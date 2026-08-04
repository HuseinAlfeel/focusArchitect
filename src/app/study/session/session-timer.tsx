"use client";

import { useCountdown, formatRemaining } from "@/hooks/useCountdown";
import { useRoundTimer } from "@/hooks/useRoundTimer";

// Bewusst minimal (Regel 7: die Arbeitsphase darf nicht ablenken). Das ist
// hier noch die F4-Version, nur zum Testen des Timer-Mechanismus - der
// "Sitzung beenden"-Knopf und die Tab-Sichtbarkeits-Ereignisse (F5) sowie
// der abgestufte Pausenhinweis (F6) fehlen bewusst noch.
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
    </main>
  );
}
