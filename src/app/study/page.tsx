import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentParticipant } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Role } from "@/generated/prisma/enums";
import { LogoutButton } from "./logout-button";
import { ReopenSessionButton } from "./reopen-session-button";
import { DashboardStartForm } from "./dashboard-start-form";

// Landet hier bei jedem Login (14.09., die alte leere "Eingeloggt
// als..."-Zwischenseite ist weg). Fehlen Einwilligung oder Vorbefragung,
// geht es ohne Klick direkt weiter dorthin - erst wenn beides steht, zeigt
// diese Seite das eigentliche Dashboard mit dem Sitzungsstart.
export default async function StudyPage() {
  const participant = await getCurrentParticipant();
  if (!participant) {
    redirect("/login");
  }

  // Das ADMIN-Konto ist zum Auswerten da, nicht zum Teilnehmen. Ohne diese
  // Weiche landet es nach dem Login auf der Einwilligung und legt beim
  // Durchklicken eine ganz normale Studiensitzung an, die dann als eigene
  // Zeile im Export steht (18.09. genau so passiert). Zum Ausprobieren des
  // Ablaufs gibt es PILOT.
  if (participant.role === Role.ADMIN) {
    redirect("/admin");
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

  // Läuft die Sitzung schon, gibt es hier nichts zu entscheiden - direkt
  // weiter zum Timer, kein Klick über eine Zwischenseite (14.09.,
  // genau das fiel nach "Sitzung fortsetzen" unangenehm auf).
  if (session.startedAt && !session.endedAt) {
    redirect("/study/session");
  }

  if (session.endedAt && !session.finalizedAt) {
    return (
      <main className="relative flex min-h-screen flex-1 flex-col items-center justify-center gap-3 px-4 text-center">
        <div aria-hidden="true" className="phase-glow phase-glow-neutral" />
        <div className="relative z-10 space-y-3">
          <p className="text-sm font-medium">
            Sitzung beendet um {session.endedAt.toLocaleString("de-DE")}
          </p>
          {/* Keine "Final abgeben"-Option mehr hier (Betreuung, 12.09.): eine
              Sitzung gilt erst als abgeschlossen, wenn die Nachbefragung
              abgesendet wurde (finalisiert dann automatisch, siehe
              post-survey-form.tsx). Vorher war "Final abgeben" ein dritter,
              versehentlich klickbarer Weg, der die Nachbefragung komplett
              unerreichbar machte - echter Datenverlust. */}
          <div className="flex flex-col items-center gap-2">
            <Link
              href="/study/post"
              className="rounded bg-neutral-800 px-4 py-2 text-sm text-white dark:bg-neutral-100 dark:text-neutral-900"
            >
              Weiter zur Nachbefragung
            </Link>
            <ReopenSessionButton sessionId={session.id} />
          </div>
        </div>
        <div className="relative z-10">
          <LogoutButton />
        </div>
      </main>
    );
  }

  if (session.finalizedAt) {
    return (
      <main className="relative flex min-h-screen flex-1 flex-col items-center justify-center gap-3 px-4 text-center">
        <div aria-hidden="true" className="phase-glow phase-glow-neutral" />
        <p className="relative z-10 text-sm opacity-70">
          Studie abgeschlossen am {session.finalizedAt.toLocaleString("de-DE")}.
        </p>
        <div className="relative z-10">
          <LogoutButton />
        </div>
      </main>
    );
  }

  // Einwilligung und Vorbefragung stehen, die Sitzung ist noch nicht
  // gestartet - das eigentliche Dashboard.
  return (
    <main className="relative mx-auto flex min-h-screen max-w-xl flex-1 flex-col justify-center gap-6 px-4 py-12">
      <div aria-hidden="true" className="phase-glow phase-glow-neutral" />
      <div className="relative z-10">
        <DashboardStartForm
          participantCode={participant.code}
          sessionId={session.id}
          initialWorkMin={session.initialWorkMin}
          initialBreakMin={session.initialBreakMin}
        />
        <div className="flex justify-center">
          <LogoutButton />
        </div>
      </div>
    </main>
  );
}
