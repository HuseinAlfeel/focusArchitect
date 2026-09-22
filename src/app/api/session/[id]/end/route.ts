import { NextResponse, type NextRequest } from "next/server";
import { getCurrentParticipant } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isSessionEndPhase } from "@/lib/events";

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

  // Rundennummer und Phase kommen vom Browser (22.09., Punkt 6 der
  // Datenpruefung) - der Server kennt den Bildschirmzustand nicht. Fehlen sie
  // oder sind sie unbrauchbar, wird die Sitzung trotzdem beendet: das
  // Beenden darf an einer Zusatzangabe nicht scheitern.
  const cycleRaw = (body as { cycle?: unknown } | null)?.cycle;
  const phaseRaw = (body as { phase?: unknown } | null)?.phase;
  const cycle =
    typeof cycleRaw === "number" && Number.isInteger(cycleRaw) && cycleRaw > 0
      ? cycleRaw
      : null;
  const phase = isSessionEndPhase(phaseRaw) ? phaseRaw : null;

  const session = await prisma.session.findUnique({ where: { id } });

  if (!session || session.participantId !== participant.sub) {
    return NextResponse.json(
      { error: "Sitzung nicht gefunden." },
      { status: 404 }
    );
  }

  if (session.endedAt) {
    return NextResponse.json(
      { error: "Sitzung wurde bereits beendet." },
      { status: 400 }
    );
  }

  const endedAt = new Date();

  const updated = await prisma.session.update({
    where: { id },
    data: { endedAt },
  });

  await prisma.event.create({
    data: {
      sessionId: id,
      type: "SESSION_ENDED",
      clientAt,
      cycle,
      payload: phase ? { phase } : undefined,
    },
  });

  return NextResponse.json({ id: updated.id, endedAt: updated.endedAt });
}
