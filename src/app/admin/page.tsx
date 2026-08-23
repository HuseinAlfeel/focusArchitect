import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { LogoutButton } from "../study/logout-button";

function statusLabel(session: {
  consentAt: Date | null;
  startedAt: Date | null;
  endedAt: Date | null;
  finalizedAt: Date | null;
}) {
  if (session.finalizedAt) return "Abgeschlossen";
  if (session.endedAt) return "Beendet";
  if (session.startedAt) return "Läuft";
  if (session.consentAt) return "Vorbereitung";
  return "Ausstehend";
}

export default async function AdminPage() {
  const admin = await requireAdmin();
  if (!admin) {
    redirect("/study");
  }

  const sessions = await prisma.session.findMany({
    include: {
      participant: true,
      _count: { select: { events: true, cycles: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-6 px-4 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-medium">Admin</h1>
        <LogoutButton />
      </div>

      <section className="space-y-2">
        <h2 className="text-sm font-medium opacity-70">Sitzungen</h2>
        <div className="overflow-x-auto rounded border border-black/10 dark:border-white/15">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-black/10 text-xs opacity-60 dark:border-white/15">
              <tr>
                <th className="px-3 py-2 font-normal">Code</th>
                <th className="px-3 py-2 font-normal">Status</th>
                <th className="px-3 py-2 font-normal">Gestartet</th>
                <th className="px-3 py-2 font-normal">Beendet</th>
                <th className="px-3 py-2 font-normal">Runden</th>
                <th className="px-3 py-2 font-normal">Ereignisse</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((session) => (
                <tr key={session.id} className="border-b border-black/5 last:border-0 dark:border-white/10">
                  <td className="px-3 py-2">{session.participant.code}</td>
                  <td className="px-3 py-2">{statusLabel(session)}</td>
                  <td className="px-3 py-2">
                    {session.startedAt?.toLocaleString("de-DE") ?? "–"}
                  </td>
                  <td className="px-3 py-2">
                    {session.endedAt?.toLocaleString("de-DE") ?? "–"}
                  </td>
                  <td className="px-3 py-2">{session._count.cycles}</td>
                  <td className="px-3 py-2">{session._count.events}</td>
                </tr>
              ))}
              {sessions.length === 0 && (
                <tr>
                  <td className="px-3 py-4 text-center opacity-60" colSpan={6}>
                    Noch keine Sitzungen.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-medium opacity-70">Export</h2>
        <div className="flex flex-wrap gap-3">
          <a
            href="/api/admin/export?file=participants"
            className="rounded border border-black/15 px-3 py-1.5 text-sm dark:border-white/20"
          >
            participants.csv
          </a>
          <a
            href="/api/admin/export?file=cycles"
            className="rounded border border-black/15 px-3 py-1.5 text-sm dark:border-white/20"
          >
            cycles.csv
          </a>
          <a
            href="/api/admin/export?file=events"
            className="rounded border border-black/15 px-3 py-1.5 text-sm dark:border-white/20"
          >
            events.csv
          </a>
        </div>
      </section>
    </main>
  );
}
