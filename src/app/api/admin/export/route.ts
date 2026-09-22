import { NextResponse, type NextRequest } from "next/server";
import { getCurrentParticipant, requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { toCsv } from "@/lib/csv";
import { preSurveyItems } from "@/content/pre-survey";
// Spaltenlisten und ihre Reihenfolge stehen in src/lib/exportColumns.ts -
// dieselbe Quelle, aus der auch docs/CODEBUCH.md erzeugt wird.
import {
  CYCLES_COLUMNS,
  EVENTS_COLUMNS,
  PARTICIPANTS_COLUMNS,
  POST_IDS,
  POST_PAGE_TIMING_COLUMNS,
  pruefeSpaltenlisten,
} from "@/lib/exportColumns";

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

  // Die Pruefung der Spaltenliste wirft absichtlich. Ohne diesen Block
  // bekaeme man eine nackte 500 ohne Hinweis, was zu tun ist - genau dann,
  // wenn jemand gerade eine Frage ergaenzt hat und nicht weiss, warum der
  // Export klemmt.
  try {
    if (file === "participants") return csvResponse(await participantsCsv(), "participants.csv");
    if (file === "cycles") return csvResponse(await cyclesCsv(), "cycles.csv");
    if (file === "events") return csvResponse(await eventsCsv(), "events.csv");
  } catch (fehler) {
    return NextResponse.json(
      { error: fehler instanceof Error ? fehler.message : "Export fehlgeschlagen." },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { error: "Ungültiger Parameter 'file'. Erwartet: participants, cycles oder events." },
    { status: 400 }
  );
}

// Eine Zeile je Sitzung (in der Praxis: je Teilnehmende), Vor- und
// Nachbefragung nebeneinander (SPEZIFIKATION.md [7]).
async function participantsCsv() {
  const spaltenProblem = pruefeSpaltenlisten();
  if (spaltenProblem) {
    // Lieber gar kein Export als ein stillschweigend unvollstaendiger.
    throw new Error(spaltenProblem);
  }

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
    // könnte nur aus dem Takt geraten (25.08., Sitzung hat jetzt kein
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
      restedAtStart: session.restedAtStart,
      focusAtStart: session.focusAtStart,
    };
    // Ja/Nein-Fragen mit Anschlussfrage liegen als Objekt { yes, followUp } in
    // den Antworten. Direkt geschrieben stand im CSV roher JSON-Text
    // (`{""yes"":false,""followUp"":""""}`), damit laesst sich in Excel nicht
    // rechnen. Jetzt zwei saubere Spalten je Frage: B2 mit ja/nein und
    // B2_followUp mit der Anschlussantwort. Eine leere B3-Spalte heisst
    // weiterhin, dass die Frage gar nicht gestellt wurde, weil B2 "nein" war
    // (siehe isPreSurveyItemVisible).
    for (const item of preSurveyItems) {
      const value = preAnswers[item.id];
      if (item.type === "yesno") {
        const answer = value as { yes?: boolean; followUp?: string } | undefined;
        row[item.id] =
          typeof answer?.yes === "boolean" ? (answer.yes ? "ja" : "nein") : null;
        row[`${item.id}_followUp`] = answer?.followUp ?? null;
      } else {
        row[item.id] = value;
      }
    }
    for (const id of POST_IDS) row[id] = postAnswers[id];

    const pageTimings = postAnswers.pageTimings as
      | Record<string, { loadedAt?: string; submittedAt?: string }>
      | undefined;
    for (const [index, column] of POST_PAGE_TIMING_COLUMNS.entries()) {
      const timing = pageTimings?.[String(index + 1)];
      row[column] =
        timing?.loadedAt && timing?.submittedAt
          ? Math.round(
              (new Date(timing.submittedAt).getTime() - new Date(timing.loadedAt).getTime()) /
                1000
            )
          : null;
    }

    return row;
  });

  return toCsv(PARTICIPANTS_COLUMNS, rows);
}

// Eine Zeile je Runde. CycleFeedback.activity wird vom Client nie befüllt
// (das Formular schickt dort immer null) - die tatsächlich gewählte
// Aktivität steht stattdessen im Ereignis-Log (ACTIVITY_SELECTED/
// ACTIVITY_SKIPPED), deshalb hier über die Events je Runde zusammengeführt.
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

    // Wird sequenziell mitgefuehrt statt je Runde aus der vorherigen
    // CycleFeedback abgeleitet: falls doch einmal eine Runde ohne
    // CycleFeedback endet, laeuft die naechste Runde trotzdem mit dem
    // unveraenderten Wert weiter - der Tracker haelt das fest, ohne bei
    // fehlendem Feedback auf null zurueckzufallen. Seit 17.09. bekommt auch
    // eine selbst gestartete Pause (BREAK_SELF_INITIATED) ein CycleFeedback
    // wie jede andere Runde, siehe SPEZIFIKATION.md [7].
    let workMinTracker = session.initialWorkMin;

    for (const cycle of [...cycleNumbers].sort((a, b) => a - b)) {
      const cycleEvents = session.events.filter((e) => e.cycle === cycle);
      const workMin = workMinTracker;
      const workStarted = cycleEvents.find((e) => e.type === "WORK_STARTED");
      // BREAK_SELF_INITIATED zaehlt hier auch als "Reaktion", obwohl es keine
      // Reaktion auf einen Systemhinweis ist (kein NUDGE_STAGE_* davor) -
      // reactionType bekommt dafuer den eigenen Wert "SELF_INITIATED" statt
      // des rohen Ereignistyps, die bestehenden Werte bleiben unveraendert.
      const reaction = cycleEvents.find(
        (e) =>
          e.type === "BREAK_ACCEPTED" ||
          e.type === "BREAK_SKIPPED" ||
          e.type === "BREAK_SELF_INITIATED"
      );
      const activitySelected = cycleEvents.find((e) => e.type === "ACTIVITY_SELECTED");
      const activitySkipped = cycleEvents.find((e) => e.type === "ACTIVITY_SKIPPED");
      const feedback = session.cycles.find((f) => f.cycle === cycle);
      if (feedback?.newWorkMin != null) workMinTracker = feedback.newWorkMin;

      const reactionType =
        reaction?.type === "BREAK_SELF_INITIATED" ? "SELF_INITIATED" : reaction?.type ?? null;
      const reactionPayload = reaction?.payload as
        | { stage?: number; secondsAfterEnd?: number; secondsIntoWork?: number }
        | null;
      const activityPayload = activitySelected?.payload as { activity?: string } | null;

      // Reaktionslatenz: wie lange, bis die Person nach Stufe 1 ueberhaupt
      // wieder zum Tab zurueckkommt. Zwei Bedingungen, beide korrigiert am
      // 20.09. nach dem Probelauf:
      //
      // (1) Der Tab muss beim Hinweis tatsaechlich unsichtbar gewesen sein.
      //     Die Spezifikation [11] beschreibt das schon so ("leer, wenn der
      //     Tab durchgehend sichtbar war und es also nichts zum Zurueckkommen
      //     gab"), der Code hat es nur nie geprueft. `tabVisibleAtNudge`
      //     steht seit dem 25.08. im Payload jedes NUDGE_STAGE_*.
      // (2) Das Suchfenster endet bei der Reaktion. Vorher wurde das erste
      //     TAB_VISIBLE der ganzen Runde genommen - und weil auch die Pause
      //     zur selben Runde gehoert, konnte ein Tabwechsel mitten in der
      //     Pause als "Reaktionslatenz" erscheinen. Im Probelauf ergab das
      //     in Runde 4 einen Wert von 2697 Sekunden, obwohl der Tab beim
      //     Hinweis sichtbar war und nach 42 Sekunden reagiert wurde.
      //
      // Ohne Reaktion bleibt das Feld leer: dann hat das Fenster keine
      // Obergrenze, und genau daran ist die alte Rechnung gescheitert.
      const nudgeStage1 = cycleEvents.find((e) => e.type === "NUDGE_STAGE_1");
      const nudgeStage1Payload = nudgeStage1?.payload as
        | { tabVisibleAtNudge?: boolean }
        | null;
      const tabVisibleAtNudge = nudgeStage1Payload?.tabVisibleAtNudge ?? null;

      const firstTabVisibleAfterNudge =
        nudgeStage1 && tabVisibleAtNudge === false && reaction
          ? cycleEvents.find(
              (e) =>
                e.type === "TAB_VISIBLE" &&
                e.at > nudgeStage1.at &&
                e.at <= reaction.at
            )
          : undefined;
      const latencyToTabReturnSeconds =
        nudgeStage1 && firstTabVisibleAfterNudge
          ? Math.round(
              (firstTabVisibleAfterNudge.at.getTime() - nudgeStage1.at.getTime()) / 1000
            )
          : null;

      // Tatsaechliche Pausendauer (20.09.). Die Pause endet nicht, wenn der
      // Pausen-Timer ablaeuft, sondern erst wenn die Person "Sitzung starten"
      // drueckt - im Probelauf waren aus geplanten 5 Minuten einmal 23 und
      // einmal 44 Minuten. Das stand bisher nur als Rohereignis in
      // events.csv. Runden ohne Pause (uebersprungen) bleiben leer, ebenso
      // eine Pause, die beim Sitzungsende noch lief: dann fehlt BREAK_ENDED.
      const breakStarted = cycleEvents.find((e) => e.type === "BREAK_STARTED");
      const breakEnded = cycleEvents.find((e) => e.type === "BREAK_ENDED");
      const breakActualMin =
        breakStarted && breakEnded
          ? Math.round((breakEnded.at.getTime() - breakStarted.at.getTime()) / 60_000)
          : null;

      const snoozeCount = cycleEvents.filter((e) => e.type === "BREAK_SNOOZED").length;

      rows.push({
        code: session.participant.code,
        sessionId: session.id,
        cycle,
        workMin,
        workStartedAt: workStarted?.at ?? null,
        reactionType,
        reactionStage: reactionPayload?.stage ?? null,
        reactionSecondsAfterEnd: reactionPayload?.secondsAfterEnd ?? null,
        reactionSecondsIntoWork: reactionPayload?.secondsIntoWork ?? null,
        reactionAt: reaction?.at ?? null,
        nudgeStage1At: nudgeStage1?.at ?? null,
        // Macht lesbar, WARUM die Latenz leer ist: war der Tab beim Hinweis
        // sichtbar, gab es nichts zum Zurueckkommen. Ohne diese Spalte sieht
        // eine leere Latenz wie ein fehlender Wert aus statt wie ein
        // begruendet nicht vorhandener.
        tabVisibleAtNudge,
        firstTabVisibleAfterNudge: firstTabVisibleAfterNudge?.at ?? null,
        latencyToTabReturnSeconds,
        snoozeCount,
        activity: activitySelected
          ? activityPayload?.activity ?? null
          : activitySkipped
            ? "keine"
            : null,
        breakStartedAt: breakStarted?.at ?? null,
        breakEndedAt: breakEnded?.at ?? null,
        breakPlannedMin: breakStarted ? session.initialBreakMin : null,
        breakActualMin,
        timing: feedback?.timing ?? null,
        adjustmentMin: feedback?.adjustmentMin ?? null,
        // Gewuenscht gegen wirksam (20.09.): Die Rundenlaenge hat eine
        // Untergrenze von 5 Minuten (MIN_WORK_MIN in /api/cycle-feedback).
        // Wer bei 5 Minuten noch einmal "5 Minuten weniger" waehlt, bekommt
        // adjustmentMin = -5, die Rundenlaenge bleibt aber bei 5. Genau so
        // im Probelauf passiert. adjustmentMin ist damit der Wunsch,
        // effectiveAdjustmentMin die tatsaechliche Aenderung - fuer die
        // Auswertung sind beide interessant, aber sie duerfen nicht
        // verwechselt werden.
        effectiveAdjustmentMin:
          feedback?.newWorkMin != null ? feedback.newWorkMin - workMin : null,
        newWorkMin: feedback?.newWorkMin ?? null,
        comment: feedback?.comment ?? null,
      });
    }
  }

  return toCsv(CYCLES_COLUMNS, rows);
}

// Eine Zeile je Ereignis - der vollständige Rohlog, für alles, was die
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

  return toCsv(EVENTS_COLUMNS, rows);
}

function csvResponse(csv: string, filename: string) {
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
