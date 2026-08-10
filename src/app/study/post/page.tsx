import { redirect } from "next/navigation";
import { getCurrentParticipant } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PostSurveyForm } from "./post-survey-form";

export default async function PostSurveyPage() {
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

  // Die Nachbefragung gehoert ans Ende - "Sitzung beenden" ist der
  // vorgesehene Weg dorthin (siehe /study Hub), erst danach ergibt sie
  // inhaltlich Sinn ("wie war die Sitzung", nicht "wie war sie bisher").
  if (!session.endedAt) {
    redirect("/study");
  }

  const existingPostSurvey = await prisma.surveyResponse.findFirst({
    where: { sessionId: session.id, phase: "POST" },
  });

  if (existingPostSurvey) {
    redirect("/study/complete");
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-1 flex-col justify-center gap-6 px-4 py-12">
      <div>
        <h1 className="text-xl font-medium">Nachbefragung</h1>
        <p className="mt-2 text-sm opacity-80">
          Ein paar letzte Fragen, dann bist du fertig.
        </p>
      </div>

      <PostSurveyForm sessionId={session.id} />
    </main>
  );
}
