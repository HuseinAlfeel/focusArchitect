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
    <main className="mx-auto flex min-h-screen max-w-xl flex-1 flex-col justify-center gap-6 px-4 py-12">
      <div>
        <h1 className="text-xl font-medium">Vorbefragung</h1>
        <p className="mt-2 text-sm opacity-80">
          Ein paar kurze Fragen, bevor die Sitzung beginnt.
        </p>
      </div>

      <PreSurveyForm />
    </main>
  );
}
