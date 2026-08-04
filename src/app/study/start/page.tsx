import { redirect } from "next/navigation";
import { getCurrentParticipant } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { StartForm } from "./start-form";

export default async function SessionStartPage() {
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

  if (session.startedAt) {
    redirect("/study");
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-1 flex-col justify-center gap-6 px-4 py-12">
      <div>
        <h1 className="text-xl font-medium">Sitzung starten</h1>
        <p className="mt-2 text-sm opacity-80">
          Bevor es losgeht: woran arbeitest du in dieser Sitzung?
        </p>
      </div>

      <StartForm
        sessionId={session.id}
        initialWorkMin={session.initialWorkMin}
        initialBreakMin={session.initialBreakMin}
      />
    </main>
  );
}
