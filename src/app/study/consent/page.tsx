import { redirect } from "next/navigation";
import { getCurrentParticipant } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { consentContent } from "@/content/consent";
import { ConsentForm } from "./consent-form";

export default async function ConsentPage() {
  const participant = await getCurrentParticipant();
  if (!participant) {
    redirect("/login");
  }

  // Wer schon eingewilligt hat, sieht diesen Bildschirm nicht noch einmal -
  // sonst laesst er sich per Zurueck-Taste erneut absenden. Zweite Haelfte
  // derselben Absicherung wie in `POST /api/session` (siehe dort). Die
  // Bedingung ist genau die Umkehrung der Weiche in `/study`, dadurch kann
  // zwischen den beiden Seiten keine Weiterleitungsschleife entstehen.
  const session = await prisma.session.findFirst({
    where: { participantId: participant.sub },
    orderBy: { createdAt: "desc" },
  });

  if (session?.consentAt) {
    redirect("/study");
  }

  return (
    <main className="relative mx-auto flex min-h-screen max-w-xl flex-1 flex-col justify-center gap-6 px-4 py-12">
      <div aria-hidden="true" className="phase-glow phase-glow-neutral" />

      <div className="relative z-10 space-y-1">
        <h1 className="text-xl font-medium">{consentContent.title}</h1>
        <p className="text-sm opacity-80">{consentContent.intro}</p>
      </div>

      <div className="relative z-10">
        <ConsentForm />
      </div>
    </main>
  );
}
