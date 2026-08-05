// Aktivitaeten aus docs/SPEZIFIKATION.md, Abschnitt [7]. Die Spezifikation
// nennt nur grobe Gesamtdauern und Stichworte ("angeleitete Dehnung,
// Schritt fuer Schritt") - die einzelnen Schritte hier sind eine sinnvolle
// Ausformulierung davon, kein woertliches Zitat. Bei Bedarf mit Holly
// abstimmen und hier anpassen, nicht im JSX suchen muessen.

export type ActivityStep = {
  instruction: string;
  durationSeconds: number;
};

export type ActivityId = "eyes" | "neck" | "move";

export type Activity = {
  id: ActivityId;
  label: string;
  steps: ActivityStep[];
};

export const activities: Activity[] = [
  {
    id: "eyes",
    label: "Augenentlastung",
    steps: [
      {
        instruction: "Schau für 20 Sekunden auf etwas in etwa 6 Metern Entfernung.",
        durationSeconds: 20,
      },
      {
        instruction: "Noch einmal: 20 Sekunden in die Ferne schauen.",
        durationSeconds: 20,
      },
      {
        instruction: "Ein drittes Mal: 20 Sekunden in die Ferne schauen.",
        durationSeconds: 20,
      },
    ],
  },
  {
    id: "neck",
    label: "Nacken und Schultern",
    steps: [
      { instruction: "Kopf langsam zur rechten Schulter neigen.", durationSeconds: 30 },
      { instruction: "Kopf langsam zur linken Schulter neigen.", durationSeconds: 30 },
      { instruction: "Schultern langsam nach vorne kreisen.", durationSeconds: 30 },
      { instruction: "Schultern langsam nach hinten kreisen.", durationSeconds: 30 },
      {
        instruction: "Kopf sanft nach vorne senken, Nacken lang machen.",
        durationSeconds: 60,
      },
    ],
  },
  {
    id: "move",
    label: "Aufstehen und bewegen",
    steps: [
      {
        instruction: "Steh auf und geh ein paar Schritte, z. B. zum Fenster und zurück.",
        durationSeconds: 90,
      },
      {
        instruction: "Schultern kreisen, erst vorwärts, dann rückwärts.",
        durationSeconds: 60,
      },
      { instruction: "Arme über den Kopf strecken, tief durchatmen.", durationSeconds: 60 },
      {
        instruction: "Noch einmal ein paar Schritte gehen.",
        durationSeconds: 90,
      },
    ],
  },
];
