import { NextResponse, type NextRequest } from "next/server";
import { getCurrentParticipant } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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
  const taskDescription = (body as { taskDescription?: unknown } | null)
    ?.taskDescription;
  const clientAtRaw = (body as { clientAt?: unknown } | null)?.clientAt;

  if (typeof taskDescription !== "string" || !taskDescription.trim()) {
    return NextResponse.json(
      { error: "Bitte beschreibe kurz, woran du arbeitest." },
      { status: 400 }
    );
  }

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

  if (!session.consentAt) {
    return NextResponse.json(
      { error: "Ohne Einwilligung kann keine Sitzung gestartet werden." },
      { status: 400 }
    );
  }

  if (session.startedAt) {
    return NextResponse.json(
      { error: "Sitzung wurde bereits gestartet." },
      { status: 400 }
    );
  }

  const startedAt = new Date();

  const updated = await prisma.session.update({
    where: { id },
    data: { taskDescription: taskDescription.trim(), startedAt },
  });

  await prisma.event.createMany({
    data: [
      { sessionId: id, type: "SESSION_STARTED", clientAt },
      { sessionId: id, type: "CYCLE_STARTED", cycle: 1, clientAt },
      { sessionId: id, type: "WORK_STARTED", cycle: 1, clientAt },
    ],
  });

  return NextResponse.json({
    id: updated.id,
    startedAt: updated.startedAt,
    initialWorkMin: updated.initialWorkMin,
    initialBreakMin: updated.initialBreakMin,
  });
}
