import { NextResponse, type NextRequest } from "next/server";
import { getCurrentParticipant } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Schutz gegen versehentliches "Sitzung beenden": macht endedAt rueckgaengig,
// damit man dort weitermachen kann, wo man war (sessionStorage-Rundenzustand
// bleibt unberuehrt, da nur der DB-Zeitstempel geloescht wird).
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const participant = await getCurrentParticipant();
  if (!participant) {
    return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401 });
  }

  const { id } = await params;

  const body = await request.json().catch(() => null);
  const clientAtRaw = (body as { clientAt?: unknown } | null)?.clientAt;
  const clientAt =
    typeof clientAtRaw === "string" && !Number.isNaN(Date.parse(clientAtRaw))
      ? new Date(clientAtRaw)
      : new Date();

  const session = await prisma.session.findUnique({ where: { id } });

  if (!session || session.participantId !== participant.sub) {
    return NextResponse.json(
      { error: "Sitzung nicht gefunden." },
      { status: 404 }
    );
  }

  if (!session.endedAt) {
    return NextResponse.json(
      { error: "Sitzung ist gar nicht beendet." },
      { status: 400 }
    );
  }

  const updated = await prisma.session.update({
    where: { id },
    data: { endedAt: null },
  });

  await prisma.event.create({
    data: { sessionId: id, type: "SESSION_REOPENED", clientAt },
  });

  return NextResponse.json({ id: updated.id });
}
