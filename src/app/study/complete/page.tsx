import { redirect } from "next/navigation";
import { getCurrentParticipant } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { closingContent } from "@/content/closing";
import { LogoutButton } from "../logout-button";

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
    <main className="flex min-h-screen flex-1 flex-col items-center justify-center gap-4 px-4 text-center">
      <div className="max-w-sm space-y-2">
        <h1 className="text-lg font-medium">{closingContent.title}</h1>
        <p className="text-sm opacity-80">{closingContent.body}</p>
      </div>

      <p className="text-sm opacity-60">
        {closingContent.contactLabel}
        <br />
        {closingContent.contactEmail}
      </p>

      <LogoutButton />
    </main>
  );
}
