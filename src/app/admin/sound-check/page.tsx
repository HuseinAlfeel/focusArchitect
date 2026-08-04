import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { SoundCheckPanel } from "./sound-check-panel";

// Reines Testwerkzeug fuer die Kalibrierung der Pausenhinweis-Toene (F6),
// kein Teil des Studienablaufs - deshalb nur fuer ADMIN erreichbar.
export default async function SoundCheckPage() {
  const admin = await requireAdmin();
  if (!admin) {
    redirect("/login");
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-1 flex-col justify-center gap-6 px-4 py-12">
      <div>
        <h1 className="text-xl font-medium">Sound-Check</h1>
        <p className="mt-2 text-sm opacity-70">
          Testwerkzeug für die Pausenhinweis-Töne (F6). Direkt anhören, ohne
          einen echten Timer abzuwarten. Kein Teil des Studienablaufs.
        </p>
      </div>

      <SoundCheckPanel />
    </main>
  );
}
