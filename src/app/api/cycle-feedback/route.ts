import { NextResponse, type NextRequest } from "next/server";
import { getCurrentParticipant } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Timing } from "@/generated/prisma/enums";

const MIN_WORK_MIN = 5;
const ADJUSTMENT_STEP_MIN = 5;

export async function POST(request: NextRequest) {
  const participant = await getCurrentParticipant();
  if (!participant) {
    return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const cycle = (body as { cycle?: unknown } | null)?.cycle;
  const timing = (body as { timing?: unknown } | null)?.timing;
  const adjustmentMinRaw = (body as { adjustmentMin?: unknown } | null)
    ?.adjustmentMin;
  const activity = (body as { activity?: unknown } | null)?.activity;
  const comment = (body as { comment?: unknown } | null)?.comment;
  const clientAtRaw = (body as { clientAt?: unknown } | null)?.clientAt;

  if (
    typeof cycle !== "number" ||
    (timing !== Timing.TOO_EARLY &&
      timing !== Timing.OK &&
      timing !== Timing.TOO_LATE)
  ) {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  // Der Zaehler im Kurzfeedback bewegt sich frei in 5-Minuten-Schritten
  // (Aenderung 11.08.), keine feste Liste erlaubter Werte mehr - nur noch
  // pruefen, dass es tatsaechlich ein Vielfaches von 5 ist.
  const adjustmentMin =
    typeof adjustmentMinRaw === "number" &&
    Number.isInteger(adjustmentMinRaw) &&
    adjustmentMinRaw % ADJUSTMENT_STEP_MIN === 0
      ? adjustmentMinRaw
      : 0;

  const clientAt =
    typeof clientAtRaw === "string" && !Number.isNaN(Date.parse(clientAtRaw))
      ? new Date(clientAtRaw)
      : new Date();

  const session = await prisma.session.findFirst({
    where: { participantId: participant.sub },
    orderBy: { createdAt: "desc" },
  });

  if (!session?.consentAt) {
    return NextResponse.json(
      { error: "Keine gültige Sitzung mit Einwilligung gefunden." },
      { status: 400 }
    );
  }

  const latestFeedback = await prisma.cycleFeedback.findFirst({
    where: { sessionId: session.id },
    orderBy: { cycle: "desc" },
  });

  const currentWorkMin = latestFeedback?.newWorkMin ?? session.initialWorkMin;
  const newWorkMin = Math.max(MIN_WORK_MIN, currentWorkMin + adjustmentMin);

  const feedback = await prisma.cycleFeedback.create({
    data: {
      sessionId: session.id,
      cycle,
      timing,
      adjustmentMin,
      newWorkMin,
      activity: typeof activity === "string" ? activity : null,
      comment:
        typeof comment === "string" && comment.trim() ? comment.trim() : null,
    },
  });

  const events: {
    sessionId: string;
    type: string;
    cycle: number;
    clientAt: Date;
    payload?: object;
  }[] = [];

  if (adjustmentMin !== 0) {
    events.push({
      sessionId: session.id,
      type: "INTERVAL_ADJUSTED",
      cycle,
      clientAt,
      payload: { adjustmentMin, newWorkMin },
    });
  }

  events.push({
    sessionId: session.id,
    type: "CYCLE_FEEDBACK_SUBMITTED",
    cycle,
    clientAt,
  });

  await prisma.event.createMany({ data: events });

  return NextResponse.json({ id: feedback.id, newWorkMin });
}
