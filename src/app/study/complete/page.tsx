import { redirect } from "next/navigation";
import { getCurrentParticipant } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { closingContent } from "@/content/closing";
import { LogoutButton } from "../logout-button";
import { Celebration } from "./celebration";
import { ThanksCloud } from "./thanks-cloud";

export default async function CompletePage() {
  const participant = await getCurrentParticipant();
  if (!participant) {
    redirect("/login");
  }

  const session = await prisma.session.findFirst({
    where: { participantId: participant.sub },
    orderBy: { createdAt: "desc" },
  });

  if (!session?.endedAt) {
    redirect("/study");
  }

  // overflow-hidden, damit die Woerter rund um die Karte auf schmalen
  // Bildschirmen nie eine seitliche Bildlaufleiste erzeugen.
  return (
    <main className="relative flex min-h-screen flex-1 flex-col items-center justify-center gap-6 overflow-hidden px-4 text-center">
      <div aria-hidden="true" className="phase-glow phase-glow-neutral" />
      <ThanksCloud />
      <Celebration />

      <div className="animate-card-rise relative z-10 max-w-sm space-y-3 rounded-3xl border border-black/5 bg-white/60 px-8 py-10 backdrop-blur-sm dark:border-white/10">
        <h1 className="animate-line-in text-lg font-medium [animation-delay:150ms]">
          {closingContent.title}
        </h1>
        <p className="animate-line-in text-sm opacity-80 [animation-delay:300ms]">
          {closingContent.body}
        </p>
        <p className="animate-line-in pt-2 text-sm opacity-60 [animation-delay:450ms]">
          {closingContent.contactLabel}
          <br />
          {closingContent.contactEmail}
        </p>
      </div>

      <div className="animate-line-in relative z-10 [animation-delay:600ms]">
        <LogoutButton />
      </div>
    </main>
  );
}
