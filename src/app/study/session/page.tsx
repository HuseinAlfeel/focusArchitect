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

  // Zielzeitpunkt fuer Runde 1 ist startedAt + initialWorkMin, NICHT
  // "jetzt + initialWorkMin". Das WORK_STARTED-Ereignis wurde bereits bei
  // startedAt protokolliert (F3) - wuerde man den Zielzeitpunkt hier neu ab
  // "jetzt" berechnen, bekaeme jemand, der die Seite erst spaeter oeffnet,
  // unbeabsichtigt mehr Arbeitszeit, als das Ereignis-Log eigentlich zeigt.
  const initialEndsAt =
    session.startedAt.getTime() + session.initialWorkMin * 60_000;

  return (
    <SessionTimer
      sessionId={session.id}
      cycle={1}
      initialEndsAt={initialEndsAt}
    />
  );
}
