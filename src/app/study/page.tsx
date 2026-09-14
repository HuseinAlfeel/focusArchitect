import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentParticipant } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { LogoutButton } from "./logout-button";
import { ReopenSessionButton } from "./reopen-session-button";
import { DashboardStartForm } from "./dashboard-start-form";

// Landet hier bei jedem Login (Husin, 14.09.: die alte leere "Eingeloggt
// als..."-Zwischenseite ist weg). Fehlen Einwilligung oder Vorbefragung,
// geht es ohne Klick direkt weiter dorthin - erst wenn beides steht, zeigt
// diese Seite das eigentliche Dashboard mit dem Sitzungsstart.
export default async function StudyPage() {
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

  const preSurvey = await prisma.surveyResponse.findFirst({
    where: { sessionId: session.id, phase: "PRE" },
  });

  if (!preSurvey) {
    redirect("/study/pre");
  }

  if (session.startedAt && !session.endedAt) {
    return (
      <main className="flex min-h-screen flex-1 flex-col items-center justify-center gap-3 px-4 text-center">
        <div className="space-y-1">
          <p className="text-sm opacity-70">
            Sitzung gestartet um {session.startedAt.toLocaleString("de-DE")}
            {session.taskDescription ? ` — „${session.taskDescription}“` : ""}
          </p>
          <Link href="/study/session" className="text-sm underline">
            Zur Sitzung
          </Link>
        </div>
        <LogoutButton />
      </main>
    );
  }

  if (session.endedAt && !session.finalizedAt) {
    return (
      <main className="flex min-h-screen flex-1 flex-col items-center justify-center gap-3 px-4 text-center">
        <div className="space-y-3">
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
        <LogoutButton />
      </main>
    );
  }

  if (session.finalizedAt) {
    return (
      <main className="flex min-h-screen flex-1 flex-col items-center justify-center gap-3 px-4 text-center">
        <p className="text-sm opacity-70">
          Studie abgeschlossen am {session.finalizedAt.toLocaleString("de-DE")}.
        </p>
        <LogoutButton />
      </main>
    );
  }

  // Einwilligung und Vorbefragung stehen, die Sitzung ist noch nicht
  // gestartet - das eigentliche Dashboard.
  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-1 flex-col justify-center gap-6 px-4 py-12">
      <DashboardStartForm
        participantCode={participant.code}
        sessionId={session.id}
        initialWorkMin={session.initialWorkMin}
        initialBreakMin={session.initialBreakMin}
      />
      <div className="flex justify-center">
        <LogoutButton />
      </div>
    </main>
  );
}
