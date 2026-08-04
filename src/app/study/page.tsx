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

  const latestSession = await prisma.session.findFirst({
    where: { participantId: participant.sub },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="flex min-h-screen flex-1 flex-col items-center justify-center gap-3 px-4 text-center">
      <p className="text-sm">
        Eingeloggt als <strong>{participant.code}</strong>
      </p>

      {latestSession?.consentAt ? (
        <p className="text-sm opacity-70">
          Einwilligung erteilt am{" "}
          {latestSession.consentAt.toLocaleString("de-DE")}
        </p>
      ) : (
        <Link href="/study/consent" className="text-sm underline">
          Zur Einwilligung
        </Link>
      )}

      <p className="text-sm opacity-50">
        Platzhalter — der Rest von Phase F (Vorbefragung, Timer,
        Pausenhinweis, …) folgt.
      </p>

      <LogoutButton />
    </main>
  );
}
