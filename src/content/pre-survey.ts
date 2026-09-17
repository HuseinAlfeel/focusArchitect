// Vorbefragung aus docs/SPEZIFIKATION.md, Abschnitt [3] (ueberarbeitet 14.09.,
// zweigeteilt fuer den Onboarding-Flow: Schritt 1 = Block A, Schritt 2 =
// Bloecke B+C+D in einem, siehe pre-survey-form.tsx).
//
// Block A: Person und Taetigkeit. Block B: tatsaechliches Pausenverhalten
// (Verhalten, keine Einschaetzung). Block C: Einstellung zu Pausen. Block D:
// typisches Befinden an einem normalen Arbeitstag (Baseline-Trait, kein
// Sitzungsvergleich - der verlaesslichere Vergleichswert fuer die
// Nachbefragung ist restedAtStart/focusAtStart vom Sitzungsstart, siehe
// session-start.ts). Die "typische Konzentration" (frueher D2) ist bewusst
// raus, Husins Vorgabe beim Onboarding-Umbau am 14.09. - Erschoepfung allein
// reicht als Baseline-Trait.
//
// B2 und B3 haben eine bedingte Anschlussfrage (nur bei "ja" sichtbar).
//
// B3 selbst haengt zusaetzlich an B2 (`showIf`, ergaenzt 17.09. auf Husins
// Hinweis): wer bei "Machst du bewusst Pausen?" mit Nein antwortet, wurde
// vorher trotzdem gefragt, ob er Hilfsmittel FUER Pausen nutzt - das ergibt
// keinen Sinn und wirkte wie eine verdrehte Logik. B4 ("Beschreibe kurz, wie
// du Pausen machst") bleibt bewusst in beiden Faellen sichtbar: auch ein
// "ich mache keine" ist eine verwertbare Antwort. Verborgene Fragen werden
// nicht mitgespeichert - die Spalte bleibt im Export leer, und weil B2 in
// derselben Zeile steht, ist eindeutig erkennbar warum.

export const preSurveyStep1Items = [
  {
    id: "A1",
    type: "choice",
    question: "Altersgruppe",
    options: [
      { value: "18-24", label: "18–24" },
      { value: "25-34", label: "25–34" },
      { value: "35-44", label: "35–44" },
      { value: "45-54", label: "45–54" },
      { value: "55+", label: "55 und älter" },
    ],
  },
  {
    id: "A2",
    type: "choice",
    question: "Geschlecht",
    options: [
      { value: "weiblich", label: "weiblich" },
      { value: "maennlich", label: "männlich" },
      { value: "divers", label: "divers" },
      { value: "keine_angabe", label: "keine Angabe" },
    ],
  },
  {
    id: "A3",
    type: "text",
    question: "Welche Tätigkeit übst du aus? (Berufsbezeichnung oder Studiengang)",
  },
  {
    id: "A4",
    type: "choice",
    question: "Arbeitest du überwiegend im Homeoffice?",
    options: [
      { value: "ja", label: "ja" },
      { value: "teilweise", label: "teilweise" },
      { value: "nein", label: "nein" },
    ],
  },
  {
    id: "A5",
    type: "number",
    question: "Wie viele Stunden arbeitest du an einem typischen Arbeitstag?",
  },
  {
    id: "A6",
    type: "number",
    question: "Wie viele davon sitzend am Bildschirm?",
  },
] as const;

export const preSurveyStep2Items = [
  {
    id: "B1",
    type: "choice",
    question:
      "Wie lange arbeitest du üblicherweise am Stück am Bildschirm, ohne Pause?",
    options: [
      { value: "<30", label: "unter 30 Minuten" },
      { value: "30-60", label: "30 bis 60 Minuten" },
      { value: "60-120", label: "60 bis 120 Minuten" },
      { value: ">120", label: "über 120 Minuten" },
    ],
  },
  {
    id: "B2",
    type: "yesno",
    question: "Machst du bei solcher Arbeit bewusst Pausen?",
    followUp: {
      type: "number",
      question: "Wie viele bewusste Pausen machst du an einem typischen Arbeitstag?",
    },
  },
  {
    id: "B3",
    type: "yesno",
    question: "Nutzt du Hilfsmittel für Pausen (z. B. Timer, Pomodoro-App)?",
    showIf: { id: "B2", yes: true },
    followUp: {
      type: "text",
      question: "Welche, und wie regelmäßig nutzt du sie?",
    },
  },
  {
    id: "B4",
    type: "textarea",
    question: "Beschreibe kurz, wie du Pausen machst.",
  },
  {
    id: "C1",
    type: "scale",
    question: "Wie wichtig sind dir Pausen bei der Bildschirmarbeit?",
    lowLabel: "gar nicht wichtig",
    highLabel: "sehr wichtig",
  },
  {
    id: "D1",
    type: "scale",
    question: "Wie erschöpft fühlst du dich typischerweise am Ende eines Arbeitstages?",
    lowLabel: "gar nicht",
    highLabel: "sehr",
  },
] as const;

export const preSurveyItems = [...preSurveyStep1Items, ...preSurveyStep2Items] as const;

/**
 * Ist diese Frage bei den bisherigen Antworten ueberhaupt sichtbar? Bewusst
 * hier und nicht im Formular, weil die Regel an zwei Stellen gelten muss:
 * das Formular blendet die Frage aus und verlangt sie nicht als Pflichtfeld,
 * und `POST /api/survey` darf eine fehlende, gar nicht gestellte Antwort
 * nicht als "Fehlende Antworten" abweisen. Lagen die beiden Stellen
 * auseinander, liess sich die Vorbefragung mit "Nein" bei B2 nicht mehr
 * absenden - genau das ist beim Umbau am 17.09. passiert und im Test
 * aufgefallen.
 */
export function isPreSurveyItemVisible(
  item: { id: string; showIf?: { id: string; yes: boolean } },
  answers: Record<string, unknown>
): boolean {
  if (!item.showIf) return true;
  const controlling = answers[item.showIf.id] as { yes?: unknown } | undefined;
  return controlling?.yes === item.showIf.yes;
}

// Ueberschriften vor dem jeweils ersten Item eines Unterblocks innerhalb von
// Schritt 2 (siehe Rendering in pre-survey-form.tsx). Schritt 1 ist selbst
// schon Block A, braucht keine zusaetzliche Unterueberschrift.
export const preSurveyBlockTitles: Record<string, string> = {
  B1: "Pausenverhalten",
  C1: "Einstellung",
  D1: "Typisches Befinden",
};
