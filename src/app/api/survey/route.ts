import { NextResponse, type NextRequest } from "next/server";
import { getCurrentParticipant } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Phase } from "@/generated/prisma/enums";
import { preSurveyItems } from "@/content/pre-survey";

export async function POST(request: NextRequest) {
  const participant = await getCurrentParticipant();
  if (!participant) {
    return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const phase = (body as { phase?: unknown } | null)?.phase;
  const answers = (body as { answers?: unknown } | null)?.answers;
  const clientAtRaw = (body as { clientAt?: unknown } | null)?.clientAt;

  if (
    (phase !== Phase.PRE && phase !== Phase.POST) ||
    typeof answers !== "object" ||
    answers === null
  ) {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  if (phase === Phase.PRE) {
    const answered = answers as Record<string, unknown>;
    const missing = preSurveyItems.filter((item) => !(item.id in answered));
    if (missing.length > 0) {
      return NextResponse.json(
        { error: `Fehlende Antworten: ${missing.map((item) => item.id).join(", ")}` },
        { status: 400 }
      );
    }
  }

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

  const surveyResponse = await prisma.surveyResponse.create({
    data: {
      sessionId: session.id,
      phase,
      answers,
    },
  });

  await prisma.event.create({
    data: {
      sessionId: session.id,
      type:
        phase === Phase.PRE ? "SURVEY_PRE_SUBMITTED" : "SURVEY_POST_SUBMITTED",
      clientAt,
    },
  });

  return NextResponse.json({ id: surveyResponse.id });
}
