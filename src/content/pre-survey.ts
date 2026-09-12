// Vier Bloecke aus docs/SPEZIFIKATION.md, Abschnitt [3] Vorbefragung
// (ueberarbeitet 12.09. mit Holly, Prioritaet 2 aus der Betreuungsbesprechung,
// ersetzt die alte D1-D5/V1-V7-Fassung vollstaendig).
//
// Block A: Person und Taetigkeit. Block B: tatsaechliches Pausenverhalten
// (Verhalten, keine Einschaetzung). Block C: Einstellung zu Pausen, eigener
// kleiner Block statt vermischt mit Verhalten. Block D: typisches Befinden
// an einem normalen Arbeitstag (Baseline-Trait, kein Sitzungsvergleich mehr -
// der verlaesslichere Vergleichswert fuer die Nachbefragung ist jetzt
// restedAtStart/focusAtStart vom Sitzungsstart, siehe session-start.ts).
//
// B2 und B3 haben eine bedingte Anschlussfrage (nur bei "ja" sichtbar). Bei
// "nein" wird das Anschlussfeld leer mitgespeichert, nicht weggelassen.

export const preSurveyItems = [
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
  {
    id: "D2",
    type: "scale",
    question: "Wie konzentriert fühlst du dich typischerweise am Ende eines Arbeitstages?",
    lowLabel: "gar nicht",
    highLabel: "sehr",
  },
] as const;

// Ueberschriften vor dem jeweils ersten Item eines Blocks (siehe Rendering
// in pre-survey-form.tsx).
export const preSurveyBlockTitles: Record<string, string> = {
  A1: "Person und Tätigkeit",
  B1: "Tatsächliches Pausenverhalten",
  C1: "Einstellung",
  D1: "Typisches Befinden",
};
