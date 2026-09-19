import { redirect } from "next/navigation";
import { getCurrentParticipant } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { closingContent } from "@/content/closing";
import { LogoutButton } from "../logout-button";
import { Celebration } from "./celebration";

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

  return (
    <main className="relative flex min-h-screen flex-1 flex-col items-center justify-center gap-6 px-4 text-center">
      <div aria-hidden="true" className="phase-glow phase-glow-neutral" />
      <Celebration />

      <div className="relative z-10 max-w-sm space-y-3 rounded-3xl border border-black/5 px-8 py-10 dark:border-white/10">
        <h1 className="text-lg font-medium">{closingContent.title}</h1>
        <p className="text-sm opacity-80">{closingContent.body}</p>
        <p className="pt-2 text-sm opacity-60">
          {closingContent.contactLabel}
          <br />
          {closingContent.contactEmail}
        </p>
      </div>

      <div className="relative z-10">
        <LogoutButton />
      </div>
    </main>
  );
}
