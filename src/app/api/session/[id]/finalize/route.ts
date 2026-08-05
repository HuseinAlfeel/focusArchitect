import { NextResponse, type NextRequest } from "next/server";
import { getCurrentParticipant } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Endgueltige Gegenstueck zu /reopen: nach dem Beenden entweder fortsetzen
// (aus Versehen beendet) oder final abgeben (wirklich fertig). Danach ist
// kein Reopen mehr moeglich.
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
      { error: "Sitzung wurde noch nicht beendet." },
      { status: 400 }
    );
  }

  if (session.finalizedAt) {
    return NextResponse.json(
      { error: "Sitzung wurde bereits final abgegeben." },
      { status: 400 }
    );
  }

  const updated = await prisma.session.update({
    where: { id },
    data: { finalizedAt: new Date() },
  });

  await prisma.event.create({
    data: { sessionId: id, type: "SESSION_FINALIZED", clientAt },
  });

  return NextResponse.json({ id: updated.id, finalizedAt: updated.finalizedAt });
}
