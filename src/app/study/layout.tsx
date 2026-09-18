import { redirect } from "next/navigation";
import { getCurrentParticipant } from "@/lib/auth";
import { Role } from "@/generated/prisma/enums";

/**
 * Eine Weiche fuer den ganzen Studienablauf: das ADMIN-Konto kommt hier gar
 * nicht hinein, sondern landet auf der Auswertungsseite.
 *
 * Warum als Layout und nicht je Seite: unter /study liegen sechs Seiten
 * (Einwilligung, Vorbefragung, Sitzung, Nachbefragung, Abschluss, Dashboard).
 * Beim ersten Versuch am 18.09. hatte ich die Pruefung nur in zwei davon
 * eingebaut, und /study/pre liess sich als ADMIN weiterhin direkt aufrufen.
 * Ein Layout gilt automatisch fuer alles darunter, auch fuer Seiten, die
 * spaeter dazukommen. Der Riegel gegen das Anlegen einer Sitzung sitzt
 * zusaetzlich in POST /api/session, denn eine Seitenweiche schuetzt nicht
 * gegen einen direkten Aufruf der Schnittstelle.
 */
export default async function StudyLayout({ children }: LayoutProps<"/study">) {
  const participant = await getCurrentParticipant();
  if (!participant) {
    redirect("/login");
  }
  if (participant.role === Role.ADMIN) {
    redirect("/admin");
  }

  return children;
}
