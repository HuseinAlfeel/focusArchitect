import { redirect } from "next/navigation";
import { getCurrentParticipant } from "@/lib/auth";
import { LogoutButton } from "./logout-button";

export default async function StudyPlaceholderPage() {
  const participant = await getCurrentParticipant();

  if (!participant) {
    redirect("/login");
  }

  return (
    <main className="flex min-h-screen flex-1 flex-col items-center justify-center gap-3 px-4 text-center">
      <p className="text-sm">
        Eingeloggt als <strong>{participant.code}</strong>
      </p>
      <p className="text-sm opacity-50">
        Platzhalter — der eigentliche Studienablauf (Phase F) folgt.
      </p>
      <LogoutButton />
    </main>
  );
}
