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
  "ACTIVITY_SELECTED",
  "ACTIVITY_SKIPPED",
  "ACTIVITY_STEP_DONE",
  "ACTIVITY_TICK",
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
