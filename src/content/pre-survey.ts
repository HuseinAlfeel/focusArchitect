// Items V1-V7 aus docs/SPEZIFIKATION.md, Abschnitt [3] Vorbefragung.
// Diese sind dort bereits konkret vorgeschlagen (nicht als offen markiert),
// liegen aber trotzdem in einer eigenen Datei, damit Holly sie bei Bedarf
// leicht anpassen kann, ohne im JSX suchen zu muessen.

export const preSurveyItems = [
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
