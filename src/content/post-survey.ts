// Items N1-N19 aus docs/SPEZIFIKATION.md, Abschnitt [10] Nachbefragung
// (finale Fassung vom 24.08. mit Holly abgestimmt, ersetzt die alte N1-N10-Version).
//
// N1-N2: Zustand nach der Sitzung, spiegeln V4/V5 aus der Vorbefragung.
// N3-N11: etablierte Skala "wahrgenommene Ueberzeugungskraft" (Persuasiveness).
// N12-N15: etablierte Skala "wahrgenommene Aufdringlichkeit" (Intrusiveness).
// Beide Skalen sind wortgleich aus der Vorlage uebernommen, inklusive Tippfehler
// in N4 ("diesem Assistenzsystems" statt "diesem Assistenzsystem") - so im
// Original, bei validierten Skalen wird der Wortlaut nicht "korrigiert".
// N16-N19: Vergleich zur gewohnten Arbeitsweise plus Freitext.
//
// Pflichtfelder: N1-N16 (alle Skalen + Vergleichsfrage). N17-N19 sind Freitext
// und duerfen leer bleiben.

export const likertScaleLabels = [
  "Stimme überhaupt nicht zu",
  "Stimme nicht zu",
  "Stimme eher nicht zu",
  "Neutral",
  "Stimme eher zu",
  "Stimme zu",
  "Stimme voll und ganz zu",
] as const;

export const postSurveyStateItems = [
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
] as const;

export const postSurveyLikertIntro = "Wie sehr stimmst du den folgenden Aussagen zu?";

export const postSurveyPersuasivenessItems = [
  {
    id: "N3",
    question: "Durch die Nutzung dieses Assistenzsystem werde ich meine Einstellung verändern.",
  },
  {
    id: "N4",
    question: "Ich glaube, dass Erinnerungen von diesem Assistenzsystems richtig sind.",
  },
  {
    id: "N5",
    question: "Dieses Assistenzsystem hat das Potential andere Nutzer*innen zu beeinflussen.",
  },
  {
    id: "N6",
    question: "Dieses Assistenzsystem bewirkt, dass ich einige Veränderungen an meinem Verhalten vornehme.",
  },
  {
    id: "N7",
    question: "Dieses Assistenzsystem hat das Potential das Verhalten anderer Nutzer*innen zu verändern.",
  },
  {
    id: "N8",
    question: "Dieses Assistenzsystem wird Veränderungen in meinem Verhalten herbei führen.",
  },
  {
    id: "N9",
    question: "Dieses Assistenzsystem hat das Potential andere Nutzer*innen zu inspirieren.",
  },
  {
    id: "N10",
    question: "Erinnerungen von diesem Assistenzsystem sind akkurat.",
  },
  {
    id: "N11",
    question: "Dieses Assistenzsystem ist vertrauenswürdig.",
  },
] as const;

export const postSurveyIntrusivenessItems = [
  {
    id: "N12",
    question: "Die Qualität meiner Arbeit hat sich in Anwesenheit des Assistenzsystems verschlechtert.",
  },
  {
    id: "N13",
    question: "Das Assistenzsystem stört meinen Arbeitsfluss.",
  },
  {
    id: "N14",
    question: "Ich fühle mich genervt von dem Assistenzsystem.",
  },
  {
    id: "N15",
    question: "Das Assistenzsystem lenkt mich ab.",
  },
] as const;

export const postSurveyComparisonItem = {
  id: "N16",
  question: "Im Vergleich zu deiner gewohnten Arbeitsweise war diese Sitzung …",
  options: [
    { value: "besser", label: "besser" },
    { value: "gleich", label: "gleich" },
    { value: "schlechter", label: "schlechter" },
  ],
} as const;

export const postSurveyTextItems = [
  { id: "N17", question: "Warum? (optional)" },
  { id: "N18", question: "Was hat dich am meisten gestört? (optional)" },
  { id: "N19", question: "Was hat am besten funktioniert? (optional)" },
] as const;

export const requiredPostSurveyIds = [
  ...postSurveyStateItems.map((item) => item.id),
  ...postSurveyPersuasivenessItems.map((item) => item.id),
  ...postSurveyIntrusivenessItems.map((item) => item.id),
  postSurveyComparisonItem.id,
] as const;
