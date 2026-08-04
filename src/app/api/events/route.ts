import { NextResponse, type NextRequest } from "next/server";
import { getCurrentParticipant } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isEventType } from "@/lib/events";

// Minimale, direkte Fassung: ein Request, sofort geschrieben. Die robuste
// Absicherung (Client-Queue, localStorage-Spiegel, Batch alle 10s,
// sendBeacon beim Verlassen der Seite) ist Phase G - dieser Endpunkt bleibt
// dabei die gleiche Schnittstelle, nur der Client drumherum wird staerker.
export async function POST(request: NextRequest) {
  const participant = await getCurrentParticipant();
  if (!participant) {
    return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const sessionId = (body as { sessionId?: unknown } | null)?.sessionId;
  const events = (body as { events?: unknown } | null)?.events;

  if (
    typeof sessionId !== "string" ||
    !Array.isArray(events) ||
    events.length === 0
  ) {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  const session = await prisma.session.findUnique({
    where: { id: sessionId },
  });

  if (!session || session.participantId !== participant.sub) {
    return NextResponse.json(
      { error: "Sitzung nicht gefunden." },
      { status: 404 }
    );
  }

  const rows = events.flatMap((raw) => {
    const event = raw as {
      type?: unknown;
      clientAt?: unknown;
      cycle?: unknown;
      payload?: unknown;
    };

    if (!isEventType(event.type)) {
      return [];
    }

    const clientAt =
      typeof event.clientAt === "string" &&
      !Number.isNaN(Date.parse(event.clientAt))
        ? new Date(event.clientAt)
        : new Date();

    const cycle = typeof event.cycle === "number" ? event.cycle : null;
    const payload =
      typeof event.payload === "object" && event.payload !== null
        ? event.payload
        : undefined;

    return [{ sessionId, type: event.type, cycle, clientAt, payload }];
  });

  if (rows.length === 0) {
    return NextResponse.json(
      { error: "Keine gültigen Ereignisse." },
      { status: 400 }
    );
  }

  await prisma.event.createMany({ data: rows });

  return NextResponse.json({ count: rows.length });
}
