import { redirect } from "next/navigation";
import { getCurrentParticipant } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PreSurveyForm } from "./pre-survey-form";

export default async function PreSurveyPage() {
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

  const existingSurvey = await prisma.surveyResponse.findFirst({
    where: { sessionId: session.id, phase: "PRE" },
  });

  if (existingSurvey) {
    redirect("/study");
  }

  return (
    <main className="relative mx-auto flex min-h-screen max-w-xl flex-1 flex-col justify-center gap-6 px-4 py-12">
      <div aria-hidden="true" className="phase-glow phase-glow-neutral" />
      <div className="relative z-10">
        <PreSurveyForm />
      </div>
    </main>
  );
}
