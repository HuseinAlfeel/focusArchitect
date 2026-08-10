// Items N1-N10 aus docs/SPEZIFIKATION.md, Abschnitt [10] Nachbefragung.
// N3 und N6 sind die Kernvariablen fuer UF3 (Stoerwirkung/Akzeptanz),
// N1/N2 werden in der Auswertung gegen V4/V5 aus der Vorbefragung verglichen.
// Pflichtfelder: N1-N7 (Skalen + Vergleichsfrage). N8-N10 sind Freitext und
// duerfen leer bleiben, genau wie das Kommentarfeld im Kurzfeedback (F8).

export const postSurveyScaleItems = [
  {
    id: "N1",
    question: "Wie konzentriert warst du in dieser Sitzung?",
    lowLabel: "gar nicht",
    highLabel: "sehr",
  },
  {
    id: "N2",
    question: "Wie erschöpft fühlst du dich jetzt?",
    lowLabel: "gar nicht",
    highLabel: "sehr",
  },
  {
    id: "N3",
    question: "Wie störend empfandest du die Pausenhinweise?",
    lowLabel: "gar nicht",
    highLabel: "sehr",
  },
  {
    id: "N4",
    question: "Wie angemessen war der Zeitpunkt der Hinweise?",
    lowLabel: "gar nicht",
    highLabel: "sehr",
  },
  {
    id: "N5",
    question: "Wie angenehm war die Art der Hinweise (Farbe, Ton, Einblendung)?",
    lowLabel: "gar nicht",
    highLabel: "sehr",
  },
  {
    id: "N6",
    question: "Würdest du diese Anwendung weiter nutzen?",
    lowLabel: "gar nicht",
    highLabel: "sehr",
  },
] as const;

export const postSurveyComparisonItem = {
  id: "N7",
  question: "Im Vergleich zu deiner gewohnten Arbeitsweise war diese Sitzung …",
  options: [
    { value: "besser", label: "besser" },
    { value: "gleich", label: "gleich" },
    { value: "schlechter", label: "schlechter" },
  ],
} as const;

export const postSurveyTextItems = [
  { id: "N8", question: "Warum? (optional)" },
  { id: "N9", question: "Was hat dich am meisten gestört? (optional)" },
  { id: "N10", question: "Was hat am besten funktioniert? (optional)" },
] as const;

export const requiredPostSurveyIds = [
  ...postSurveyScaleItems.map((item) => item.id),
  postSurveyComparisonItem.id,
] as const;
