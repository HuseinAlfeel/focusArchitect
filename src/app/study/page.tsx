import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentParticipant } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { LogoutButton } from "./logout-button";

export default async function StudyPlaceholderPage() {
  const participant = await getCurrentParticipant();

  if (!participant) {
    redirect("/login");
  }

  const session = await prisma.session.findFirst({
    where: { participantId: participant.sub },
    orderBy: { createdAt: "desc" },
  });

  const preSurvey = session
    ? await prisma.surveyResponse.findFirst({
        where: { sessionId: session.id, phase: "PRE" },
      })
    : null;

  return (
    <main className="flex min-h-screen flex-1 flex-col items-center justify-center gap-3 px-4 text-center">
      <p className="text-sm">
        Eingeloggt als <strong>{participant.code}</strong>
      </p>

      {!session?.consentAt && (
        <Link href="/study/consent" className="text-sm underline">
          Zur Einwilligung
        </Link>
      )}

      {session?.consentAt && !preSurvey && (
        <Link href="/study/pre" className="text-sm underline">
          Zur Vorbefragung
        </Link>
      )}

      {session?.consentAt && preSurvey && !session.startedAt && (
        <Link href="/study/start" className="text-sm underline">
          Sitzung starten
        </Link>
      )}

      {session?.startedAt && (
        <div className="space-y-1">
          <p className="text-sm opacity-70">
            Sitzung gestartet um {session.startedAt.toLocaleString("de-DE")}
            {session.taskDescription ? ` — „${session.taskDescription}“` : ""}
          </p>
          <Link href="/study/session" className="text-sm underline">
            Zur Sitzung
          </Link>
        </div>
      )}

      <p className="text-sm opacity-50">
        Platzhalter — der Rest von Phase F (Pausenhinweis, …) folgt.
      </p>

      <LogoutButton />
    </main>
  );
}
