// Spaltenlisten des Admin-Exports - die eine Stelle, an der steht, welche
// Spalten es gibt und in welcher Reihenfolge (22.09. hierher gezogen).
//
// Warum ein eigenes Modul und nicht in der Export-Route: Das Codebuch
// (docs/CODEBUCH.md, erzeugt von scripts/codebuch-erzeugen.ts) muss genau
// diese Listen beschreiben. Lagen sie in der Route, haette der Generator
// entweder eine Route importieren oder die Listen abschreiben muessen -
// abgeschrieben heisst frueher oder spaeter auseinandergelaufen, und ein
// Codebuch, das nicht zur Datei passt, ist schlimmer als keins. So lesen
// Export und Codebuch dieselbe Quelle und koennen nicht abweichen.

import { preSurveyItems } from "@/content/pre-survey";
import {
  postSurveyStateItems,
  postSurveyPersuasivenessItems,
  postSurveyIntrusivenessItems,
  postSurveyComparisonItem,
  postSurveyComparisonReasonItem,
  postSurveyClosingTextItems,
} from "@/content/post-survey";

// Spaltenreihenfolge der Fragebogen-Antworten (festgelegt 20.09., auf feste
// Listen umgestellt 22.09.).
//
// Die Reihenfolge im CSV folgt NICHT der Reihenfolge im Fragebogen, sondern
// diesen beiden Listen. Anlass: Die Nachbefragung stellt "Was hat am besten
// funktioniert?" (N19) bewusst vor "Was hat dich am meisten gestoert?" (N18),
// und der Export uebernahm das - am Dateiende stand N17;N19;N18;N20. Wer
// Spalten nach Position statt nach Ueberschrift zuordnet, vertauscht genau
// diese beiden Freitextfragen.
//
// Die Reihenfolge im Fragebogen selbst bleibt unangetastet, die ist eine
// bewusste Gestaltungsentscheidung. Sortiert wird nur die Ausgabe.
//
// Diese Listen sind die EINE Stelle, an der die Reihenfolge steht. Damit sie
// nicht unbemerkt veralten koennen, prueft pruefeSpaltenlisten() unten bei
// jedem Export, ob sie noch genau zu den Fragen in den Inhaltsdateien passen,
// und bricht mit einer klaren Meldung ab, wenn nicht. Eine von Hand gepflegte
// Liste ohne diese Pruefung waere gefaehrlich: Wer spaeter ein Item ergaenzt
// und die Liste vergisst, erhebt die Antwort und exportiert sie nie - stiller
// Datenverlust, das Schlimmste, was einem Messinstrument passieren kann.
export const PRE_ID_ORDER = [
  "A1", "A2", "A3", "A4", "A5", "A6",
  "B1", "B2", "B3", "B4",
  "C1",
  "D1",
];

export const POST_ID_ORDER = [
  "N1", "N2", "N3", "N4", "N5", "N6", "N7", "N8", "N9", "N10",
  "N11", "N12", "N13", "N14", "N15", "N16", "N17", "N18", "N19", "N20",
];

// Bewusst auf string aufgeweitet: preSurveyItems ist "as const", die
// Kennungen waeren sonst ein Literal-Typ und die Suche mit einem
// gewoehnlichen String aus PRE_ID_ORDER liesse sich nicht uebersetzen.
const PRE_ITEMS_BY_ID = new Map<string, (typeof preSurveyItems)[number]>(
  preSurveyItems.map((item) => [item.id, item])
);

const POST_IDS_IN_CONTENT = [
  ...postSurveyStateItems.map((item) => item.id),
  ...postSurveyPersuasivenessItems.map((item) => item.id),
  ...postSurveyIntrusivenessItems.map((item) => item.id),
  postSurveyComparisonItem.id,
  postSurveyComparisonReasonItem.id,
  ...postSurveyClosingTextItems.map((item) => item.id),
];

/**
 * Vergleicht die festen Listen oben mit den tatsaechlich vorhandenen Fragen.
 * Gibt eine Fehlermeldung zurueck, wenn etwas fehlt oder zu viel ist, sonst
 * null. Beide Richtungen sind wichtig: eine fehlende Kennung bedeutet, dass
 * eine erhobene Antwort nicht exportiert wuerde, eine ueberzaehlige bedeutet
 * eine dauerhaft leere Spalte, die in der Auswertung wie eine unbeantwortete
 * Frage aussieht.
 */
export function pruefeSpaltenlisten(): string | null {
  const probleme: string[] = [];

  for (const [name, liste, vorhanden] of [
    ["Vorbefragung", PRE_ID_ORDER, preSurveyItems.map((item) => item.id)],
    ["Nachbefragung", POST_ID_ORDER, POST_IDS_IN_CONTENT],
  ] as const) {
    const inListe = new Set(liste);
    const imFragebogen = new Set<string>(vorhanden);
    const fehlt = [...imFragebogen].filter((id) => !inListe.has(id));
    const ueberzaehlig = [...inListe].filter((id) => !imFragebogen.has(id));
    if (fehlt.length > 0) {
      probleme.push(`${name}: ${fehlt.join(", ")} fehlt/fehlen in der Spaltenliste`);
    }
    if (ueberzaehlig.length > 0) {
      probleme.push(`${name}: ${ueberzaehlig.join(", ")} steht/stehen in der Spaltenliste, aber nicht im Fragebogen`);
    }
  }

  return probleme.length > 0
    ? `Spaltenliste und Fragebogen stimmen nicht ueberein (PRE_ID_ORDER/POST_ID_ORDER in src/lib/exportColumns.ts anpassen, danach npm run codebuch). ${probleme.join("; ")}`
    : null;
}

// Ja/Nein-Fragen bekommen zwei Spalten, die Anschlussfrage steht unmittelbar
// hinter ihrer Ausgangsfrage (B2, B2_followUp).
export const PRE_COLUMNS = PRE_ID_ORDER.flatMap((id) =>
  PRE_ITEMS_BY_ID.get(id)?.type === "yesno" ? [id, `${id}_followUp`] : [id]
);

export const POST_IDS = POST_ID_ORDER;

// Lesezeit je Nachbefragungs-Seite (14.09.): Differenz aus
// page_load_timestamp/page_submit_timestamp, in `answers.pageTimings`
// gespeichert (siehe /api/survey) - hier fuer die Auswertung als eigene
// Sekunden-Spalten aufbereitet, um Blindklicker zu erkennen.
export const POST_PAGE_TIMING_COLUMNS = ["postPage1Seconds", "postPage2Seconds", "postPage3Seconds"];


/** Sitzungs- und Verwaltungsspalten am Anfang von participants.csv. */
export const PARTICIPANT_META_COLUMNS = [
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
  "restedAtStart",
  "focusAtStart",
];

export const PARTICIPANTS_COLUMNS = [
  ...PARTICIPANT_META_COLUMNS,
  ...PRE_COLUMNS,
  ...POST_IDS,
  ...POST_PAGE_TIMING_COLUMNS,
];

export const CYCLES_COLUMNS = [
  "code",
  "sessionId",
  "cycle",
  "cycleCompleted",
  "workMin",
  "workStartedAt",
  "reactionType",
  "reactionStage",
  "reactionSecondsAfterEnd",
  "reactionSecondsIntoWork",
  "reactionAt",
  "nudgeStage1At",
  "tabVisibleAtNudge",
  "firstTabVisibleAfterNudge",
  "latencyToTabReturnSeconds",
  "snoozeCount",
  "activity",
  "breakStartedAt",
  "breakEndedAt",
  "breakPlannedMin",
  "breakActualMin",
  "timing",
  "adjustmentMin",
  "effectiveAdjustmentMin",
  "newWorkMin",
  "comment",
];

export const EVENTS_COLUMNS = [
  "code",
  "sessionId",
  "type",
  "cycle",
  "clientAt",
  "at",
  "payload",
];
