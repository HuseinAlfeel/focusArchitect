import { NextResponse, type NextRequest } from "next/server";
import { getCurrentParticipant, requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { toCsv } from "@/lib/csv";
import { preSurveyItems } from "@/content/pre-survey";
import {
  postSurveyStateItems,
  postSurveyPersuasivenessItems,
  postSurveyIntrusivenessItems,
  postSurveyComparisonItem,
  postSurveyTextItems,
} from "@/content/post-survey";

const PRE_IDS = preSurveyItems.map((item) => item.id);
const POST_IDS = [
  ...postSurveyStateItems.map((item) => item.id),
  ...postSurveyPersuasivenessItems.map((item) => item.id),
  ...postSurveyIntrusivenessItems.map((item) => item.id),
  postSurveyComparisonItem.id,
  ...postSurveyTextItems.map((item) => item.id),
];

export async function GET(request: NextRequest) {
  const participant = await getCurrentParticipant();
  if (!participant) {
    return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401 });
  }

  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Nur für Admins." }, { status: 403 });
  }

  const file = request.nextUrl.searchParams.get("file");

  if (file === "participants") return csvResponse(await participantsCsv(), "participants.csv");
  if (file === "cycles") return csvResponse(await cyclesCsv(), "cycles.csv");
  if (file === "events") return csvResponse(await eventsCsv(), "events.csv");

  return NextResponse.json(
    { error: "Ungültiger Parameter 'file'. Erwartet: participants, cycles oder events." },
    { status: 400 }
  );
}

// Eine Zeile je Sitzung (in der Praxis: je Teilnehmende), Vor- und
// Nachbefragung nebeneinander (SPEZIFIKATION.md [7]).
async function participantsCsv() {
  const sessions = await prisma.session.findMany({
    include: { participant: true, surveys: true },
    orderBy: { createdAt: "asc" },
  });

  const rows = sessions.map((session) => {
    const pre = session.surveys.find((s) => s.phase === "PRE");
    const post = session.surveys.find((s) => s.phase === "POST");
    const preAnswers = (pre?.answers ?? {}) as Record<string, unknown>;
    const postAnswers = (post?.answers ?? {}) as Record<string, unknown>;

    // Gesamtdauer nicht redundant in der DB gespeichert, sondern hier aus
    // startedAt/endedAt berechnet - beide stehen schon fest, ein eigenes Feld
    // koennte nur aus dem Takt geraten (Husin, 25.08.: Sitzung hat jetzt kein
    // festes Ende mehr, siehe ENTSCHEIDUNGEN.md).
    const durationMin =
      session.startedAt && session.endedAt
        ? Math.round(
            (session.endedAt.getTime() - session.startedAt.getTime()) / 60_000
          )
        : null;

    const row: Record<string, unknown> = {
      code: session.participant.code,
      sessionId: session.id,
      consentAt: session.consentAt,
      startedAt: session.startedAt,
      endedAt: session.endedAt,
      durationMin,
      finalizedAt: session.finalizedAt,
      initialWorkMin: session.initialWorkMin,
      initialBreakMin: session.initialBreakMin,
      taskDescription: session.taskDescription,
    };
    for (const id of PRE_IDS) row[id] = preAnswers[id];
    for (const id of POST_IDS) row[id] = postAnswers[id];
    return row;
  });

  const columns = [
    "code",
    "sessionId",
    "consentAt",
    "startedAt",
    "endedAt",
    "durationMin",
    "finalizedAt",
    "initialWorkMin",
    "initialBreakMin",
    "taskDescription",
    ...PRE_IDS,
    ...POST_IDS,
  ];

  return toCsv(columns, rows);
}

// Eine Zeile je Runde. CycleFeedback.activity wird vom Client nie befuellt
// (das Formular schickt dort immer null) - die tatsaechlich gewaehlte
// Aktivitaet steht stattdessen im Ereignis-Log (ACTIVITY_SELECTED/
// ACTIVITY_SKIPPED), deshalb hier ueber die Events je Runde zusammengefuehrt.
async function cyclesCsv() {
  const sessions = await prisma.session.findMany({
    include: {
      participant: true,
      events: { orderBy: { at: "asc" } },
      cycles: true,
    },
    orderBy: { createdAt: "asc" },
  });

  const rows: Record<string, unknown>[] = [];

  for (const session of sessions) {
    const cycleNumbers = new Set<number>();
    for (const event of session.events) {
      if (event.cycle !== null) cycleNumbers.add(event.cycle);
    }

    for (const cycle of [...cycleNumbers].sort((a, b) => a - b)) {
      const cycleEvents = session.events.filter((e) => e.cycle === cycle);
      const workStarted = cycleEvents.find((e) => e.type === "WORK_STARTED");
      const reaction = cycleEvents.find(
        (e) => e.type === "BREAK_ACCEPTED" || e.type === "BREAK_SKIPPED"
      );
      const activitySelected = cycleEvents.find((e) => e.type === "ACTIVITY_SELECTED");
      const activitySkipped = cycleEvents.find((e) => e.type === "ACTIVITY_SKIPPED");
      const feedback = session.cycles.find((f) => f.cycle === cycle);
      const previousFeedback = session.cycles.find((f) => f.cycle === cycle - 1);

      const reactionPayload = reaction?.payload as
        | { stage?: number; secondsAfterEnd?: number }
        | null;
      const activityPayload = activitySelected?.payload as { activity?: string } | null;

      // Reaktionslatenz: wie lange, bis die Person nach Stufe 1 ueberhaupt
      // wieder zum Tab zurueckkommt - unabhaengig davon, wann/ob sie dann auf
      // den Hinweis reagiert. Kein TAB_VISIBLE danach gefunden heisst: Tab war
      // durchgehend sichtbar, es gab nichts zum Zurueckkommen (Husin, 25.08.).
      const nudgeStage1 = cycleEvents.find((e) => e.type === "NUDGE_STAGE_1");
      const firstTabVisibleAfterNudge = nudgeStage1
        ? cycleEvents.find(
            (e) => e.type === "TAB_VISIBLE" && e.at > nudgeStage1.at
          )
        : undefined;
      const latencyToTabReturnSeconds =
        nudgeStage1 && firstTabVisibleAfterNudge
          ? Math.round(
              (firstTabVisibleAfterNudge.at.getTime() - nudgeStage1.at.getTime()) / 1000
            )
          : null;

      const snoozeCount = cycleEvents.filter((e) => e.type === "BREAK_SNOOZED").length;

      rows.push({
        code: session.participant.code,
        sessionId: session.id,
        cycle,
        workMin: cycle === 1 ? session.initialWorkMin : previousFeedback?.newWorkMin ?? null,
        workStartedAt: workStarted?.at ?? null,
        reactionType: reaction?.type ?? null,
        reactionStage: reactionPayload?.stage ?? null,
        reactionSecondsAfterEnd: reactionPayload?.secondsAfterEnd ?? null,
        reactionAt: reaction?.at ?? null,
        nudgeStage1At: nudgeStage1?.at ?? null,
        firstTabVisibleAfterNudge: firstTabVisibleAfterNudge?.at ?? null,
        latencyToTabReturnSeconds,
        snoozeCount,
        activity: activitySelected
          ? activityPayload?.activity ?? null
          : activitySkipped
            ? "keine"
            : null,
        timing: feedback?.timing ?? null,
        adjustmentMin: feedback?.adjustmentMin ?? null,
        newWorkMin: feedback?.newWorkMin ?? null,
        comment: feedback?.comment ?? null,
      });
    }
  }

  const columns = [
    "code",
    "sessionId",
    "cycle",
    "workMin",
    "workStartedAt",
    "reactionType",
    "reactionStage",
    "reactionSecondsAfterEnd",
    "reactionAt",
    "nudgeStage1At",
    "firstTabVisibleAfterNudge",
    "latencyToTabReturnSeconds",
    "snoozeCount",
    "activity",
    "timing",
    "adjustmentMin",
    "newWorkMin",
    "comment",
  ];

  return toCsv(columns, rows);
}

// Eine Zeile je Ereignis - der vollstaendige Rohlog, fuer alles, was die
// beiden anderen Dateien nicht abdecken (z.B. TAB_HIDDEN/TAB_VISIBLE,
// NUDGE_STAGE_*, NUDGE_SOUND_PLAYED).
async function eventsCsv() {
  const events = await prisma.event.findMany({
    include: { session: { include: { participant: true } } },
    orderBy: [{ sessionId: "asc" }, { at: "asc" }],
  });

  const rows = events.map((event) => ({
    code: event.session.participant.code,
    sessionId: event.sessionId,
    type: event.type,
    cycle: event.cycle,
    clientAt: event.clientAt,
    at: event.at,
    payload: event.payload,
  }));

  const columns = ["code", "sessionId", "type", "cycle", "clientAt", "at", "payload"];

  return toCsv(columns, rows);
}

function csvResponse(csv: string, filename: string) {
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
