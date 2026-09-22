import { NextResponse, type NextRequest } from "next/server";
import { getCurrentParticipant } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isEventType } from "@/lib/events";

// Nimmt einen Batch von Ereignissen entgegen - der Client (src/lib/eventQueue.ts,
// Phase G) sammelt, spiegelt in localStorage, sendet alle 10s oder sofort bei
// Phasenwechseln, und reicht beim Verlassen der Seite per sendBeacon nach.
// Dieser Endpunkt bleibt dabei die gleiche Schnittstelle, egal ob normaler
// fetch oder Beacon dahintersteckt.
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
      clientEventId?: unknown;
      type?: unknown;
      clientAt?: unknown;
      cycle?: unknown;
      payload?: unknown;
    };

    if (!isEventType(event.type)) {
      return [];
    }

    // Vom Browser vergebene Kennung (22.09.), siehe eventQueue.ts. Fehlt sie
    // (Eintrag aus der Zeit davor), wird das Ereignis trotzdem gespeichert -
    // dann eben ohne Doppelerkennung, so wie es vorher immer war. Lieber ein
    // moeglicherweise doppeltes Ereignis als ein verlorenes (Regel 3).
    const clientEventId =
      typeof event.clientEventId === "string" && event.clientEventId.trim()
        ? event.clientEventId.trim()
        : null;

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

    return [{ clientEventId, sessionId, type: event.type, cycle, clientAt, payload }];
  });

  if (rows.length === 0) {
    return NextResponse.json(
      { error: "Keine gültigen Ereignisse." },
      { status: 400 }
    );
  }

  // skipDuplicates statt eines Fehlers: Die Warteschlange im Browser liefert
  // "mindestens einmal". Geht die Antwort verloren, obwohl hier schon
  // geschrieben wurde, kommt derselbe Stapel noch einmal - im Probelauf stand
  // dadurch ein TAB_VISIBLE zweimal mit identischen Zeitstempeln im Export.
  // Wichtig ist die Kombination aus beidem: Die Wiederholung wird uebersprungen,
  // UND die Antwort bleibt erfolgreich. Ein Fehler (z.B. 409) wuerde die
  // Warteschlange den Stapel behalten und endlos erneut senden lassen, womit
  // alles dahinter blockiert waere.
  const { count } = await prisma.event.createMany({
    data: rows,
    skipDuplicates: true,
  });

  return NextResponse.json({ count, skipped: rows.length - count });
}
