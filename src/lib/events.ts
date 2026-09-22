// Kanonische Liste aller Ereignistypen aus docs/SPEZIFIKATION.md, Abschnitt 4
// ("Ereignistypen für das Log"). Einmal hier pflegen, nicht als lose
// Freitext-Strings über die Routen verstreut - ein Tippfehler in einem
// Ereignistyp würde sonst still Forschungsdaten verfälschen.

export const EVENT_TYPES = [
  "SESSION_CREATED",
  "CONSENT_GIVEN",
  "SURVEY_PRE_SUBMITTED",
  "SESSION_STARTED",
  "CYCLE_STARTED",
  "WORK_STARTED",
  "NUDGE_STAGE_0",
  "NUDGE_STAGE_1",
  "NUDGE_STAGE_2",
  "NUDGE_STAGE_3",
  "NUDGE_SOUND_PLAYED",
  "BREAK_ACCEPTED",
  "BREAK_SKIPPED",
  "BREAK_SNOOZED",
  "BREAK_SELF_INITIATED",
  "ACTIVITY_SELECTED",
  "ACTIVITY_SKIPPED",
  "ACTIVITY_STEP_DONE",
  "ACTIVITY_TICK",
  "SPEECH_TOGGLED",
  "BREAK_STARTED",
  "BREAK_ENDED",
  "INTERVAL_ADJUSTED",
  "CYCLE_FEEDBACK_SUBMITTED",
  "TAB_HIDDEN",
  "TAB_VISIBLE",
  "SESSION_ENDED",
  "SESSION_REOPENED",
  "SESSION_FINALIZED",
  "SURVEY_POST_SUBMITTED",
] as const;

export type EventType = (typeof EVENT_TYPES)[number];

const EVENT_TYPE_SET = new Set<string>(EVENT_TYPES);

export function isEventType(value: unknown): value is EventType {
  return typeof value === "string" && EVENT_TYPE_SET.has(value);
}

/**
 * Phase, in der eine Sitzung beendet wurde (22.09., Punkt 6 der
 * Datenpruefung). Geht als Payload an SESSION_ENDED, zusammen mit der
 * Rundennummer. Hintergrund: Die letzte Runde einer Sitzung ist fast immer
 * unvollstaendig - im Probelauf wurde in Runde 5 die Pause angenommen und
 * zwei Sekunden spaeter die Sitzung beendet. In cycles.csv stand trotzdem
 * BREAK_ACCEPTED, ohne Hinweis darauf, dass die Runde nie zu Ende lief.
 *
 * "work" umfasst auch Stufe 0 des Hinweises: dort laeuft die Runde noch, der
 * Farbuebergang ist bewusst kaum wahrnehmbar und es ist nichts zu sehen, auf
 * das man reagieren koennte. Ab Stufe 1 steht die Karte, dann "nudge".
 */
export const SESSION_END_PHASES = [
  "work",
  "nudge",
  "feedback",
  "activity",
  "break",
] as const;

export type SessionEndPhase = (typeof SESSION_END_PHASES)[number];

const SESSION_END_PHASE_SET = new Set<string>(SESSION_END_PHASES);

export function isSessionEndPhase(value: unknown): value is SessionEndPhase {
  return typeof value === "string" && SESSION_END_PHASE_SET.has(value);
}
