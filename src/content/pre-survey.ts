// Items D1-D5 und V1-V7 aus docs/SPEZIFIKATION.md, Abschnitt [3] Vorbefragung.
// D1-D5 sind demografische Angaben (24.08. mit Holly abgestimmt ergaenzt),
// V1-V7 die urspruengliche Baseline-Erhebung. Liegen in einer eigenen Datei,
// damit Holly sie bei Bedarf leicht anpassen kann, ohne im JSX suchen zu muessen.

export const preSurveyItems = [
  {
    id: "D1",
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
    id: "D2",
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
    id: "D3",
    type: "choice",
    question: "Tätigkeit",
    options: [
      { value: "studium", label: "Studium" },
      { value: "anstellung", label: "Anstellung" },
      { value: "selbststaendig", label: "selbstständig" },
      { value: "sonstiges", label: "sonstiges" },
    ],
  },
  {
    id: "D4",
    type: "number",
    question: "Wie viele Stunden arbeitest du an einem typischen Tag?",
  },
  {
    id: "D5",
    type: "number",
    question: "Wie viele davon im Sitzen?",
  },
  {
    id: "V1",
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
    id: "V2",
    type: "scale",
    question: "Wie oft machst du bei solcher Arbeit bewusst Pausen?",
    lowLabel: "nie",
    highLabel: "sehr oft",
  },
  {
    id: "V3",
    type: "yesno",
    question:
      "Nutzt du bereits Hilfsmittel für Pausen (z. B. Timer, Pomodoro-App)?",
  },
  {
    id: "V4",
    type: "scale",
    question:
      "Wie konzentriert fühlst du dich typischerweise am Ende eines Arbeitsblocks?",
    lowLabel: "gar nicht",
    highLabel: "sehr",
  },
  {
    id: "V5",
    type: "scale",
    question:
      "Wie erschöpft fühlst du dich typischerweise am Ende eines Arbeitsblocks?",
    lowLabel: "gar nicht",
    highLabel: "sehr",
  },
  {
    id: "V6",
    type: "scale",
    question: "Wie zufrieden bist du mit deiner bisherigen Pausenroutine?",
    lowLabel: "gar nicht",
    highLabel: "sehr",
  },
  {
    id: "V7",
    type: "scale",
    question: "Wie ausgeruht fühlst du dich jetzt gerade, vor dieser Sitzung?",
    lowLabel: "gar nicht",
    highLabel: "sehr",
  },
] as const;
