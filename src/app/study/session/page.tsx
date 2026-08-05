import { redirect } from "next/navigation";
import { getCurrentParticipant } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SessionTimer } from "./session-timer";

export default async function WorkSessionPage() {
  const participant = await getCurrentParticipant();
  if (!participant) {
    redirect("/login");
  }

  const session = await prisma.session.findFirst({
    where: { participantId: participant.sub },
    orderBy: { createdAt: "desc" },
  });

  if (!session?.consentAt) {
    redirect("/study/consent");
  }

  const preSurvey = await prisma.surveyResponse.findFirst({
    where: { sessionId: session.id, phase: "PRE" },
  });
  if (!preSurvey) {
    redirect("/study/pre");
  }

  if (!session.startedAt) {
    redirect("/study/start");
  }

  if (session.endedAt) {
    redirect("/study");
  }

  // Ab Runde 2 (F8) gibt es keinen eigenen Session-Zeitstempel fuer den
  // Rundenstart wie initialWorkMin/startedAt bei Runde 1 - die Wahrheit
  // steht im Ereignis-Log: das juengste WORK_STARTED-Ereignis sagt, welche
  // Runde gerade laeuft und wann sie begann. Damit ueberlebt auch ein
  // kompletter Seiten-Reload in Runde 2+ (nicht nur ein sessionStorage-
  // Wiederherstellen), konsistent mit Regel 1 (Zielzeitpunkt, nicht
  // hochgezaehlt).
  const [latestFeedback, latestWorkStarted] = await Promise.all([
    prisma.cycleFeedback.findFirst({
      where: { sessionId: session.id },
      orderBy: { cycle: "desc" },
    }),
    prisma.event.findFirst({
      where: { sessionId: session.id, type: "WORK_STARTED" },
      orderBy: { at: "desc" },
    }),
  ]);

  const currentCycle = latestWorkStarted?.cycle ?? 1;
  const currentWorkMin = latestFeedback?.newWorkMin ?? session.initialWorkMin;
  const cycleStartedAt = latestWorkStarted?.at ?? session.startedAt;
  const initialEndsAt = cycleStartedAt.getTime() + currentWorkMin * 60_000;

  return (
    <SessionTimer
      sessionId={session.id}
      cycle={currentCycle}
      initialEndsAt={initialEndsAt}
      initialWorkMin={currentWorkMin}
      initialBreakMin={session.initialBreakMin}
    />
  );
}
