import { NextResponse, type NextRequest } from "next/server";
import { getCurrentParticipant } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const participant = await getCurrentParticipant();
  if (!participant) {
    return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const clientAtRaw = (body as { clientAt?: unknown } | null)?.clientAt;
  const clientAt =
    typeof clientAtRaw === "string" && !Number.isNaN(Date.parse(clientAtRaw))
      ? new Date(clientAtRaw)
      : new Date();

  const consentAt = new Date();

  const session = await prisma.session.create({
    data: {
      participantId: participant.sub,
      consentAt,
    },
  });

  await prisma.event.create({
    data: {
      sessionId: session.id,
      type: "CONSENT_GIVEN",
      clientAt,
    },
  });

  return NextResponse.json({ id: session.id });
}
