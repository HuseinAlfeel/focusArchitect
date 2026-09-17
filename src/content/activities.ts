// Aktivitäten aus docs/SPEZIFIKATION.md, Abschnitt [7]. Die Spezifikation
// nennt nur grobe Gesamtdauern und Stichworte ("angeleitete Dehnung,
// Schritt für Schritt") - die einzelnen Schritte hier sind eine sinnvolle
// Ausformulierung davon, kein wörtliches Zitat. Bei Bedarf mit Holly
// abstimmen und hier anpassen, nicht im JSX suchen müssen.

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

// Feinabstimmung 17.09. (Husin, zum zweiten Mal gemeldet): ein Satz und
// danach 60-85 Sekunden reine Stille pro Schritt wirkte robotisch und kaputt,
// nicht wie eine unterstützte Aktivität - gerade weil die Durchführung
// unbegleitet ist, muss die App selbst die ganze "Anwesenheit" tragen. Zwei
// Prinzipien jetzt konsequent für jeden Schritt: (1) die Ansage nennt immer
// die eigene Dauer/Wiederholzahl, damit die Stille danach erwartbar ist,
// statt wie ein Hänger zu wirken, und (2) kein Schritt lässt mehr als rund
// 15 Sekunden Stille nach dem letzten gesprochenen Wort - lieber mehr,
// kürzere Schritte als wenige, lange. Dadurch sind die Aktivitäten insgesamt
// kürzer als die grob geschätzten (2/3/5 Min) aus SPEZIFIKATION.md [7] -
// bewusst, ein gut getaktetes 1:30-Video schlägt ein schlecht getaktetes
// 5-Minuten-Video. Nach dem letzten Schritt übernimmt ohnehin wieder die
// normale Pausenuhr für die restliche Pausenzeit (siehe BreakScreen).
export const activities: Activity[] = [
  {
    id: "eyes",
    label: "Augenentlastung",
    steps: [
      {
        instruction: "Schau jetzt 20 Sekunden lang auf etwas in ungefähr 6 Metern Entfernung.",
        durationSeconds: 20,
      },
      {
        instruction: "Und noch einmal, 20 Sekunden in die Ferne schauen.",
        durationSeconds: 20,
      },
      {
        instruction: "Ein letztes Mal, 20 Sekunden.",
        durationSeconds: 20,
      },
      {
        instruction: "Gut so. Kurz blinzeln, dann zurück zum Bildschirm.",
        durationSeconds: 9,
      },
    ],
  },
  {
    id: "neck",
    label: "Nacken und Schultern",
    steps: [
      {
        instruction: "Neige den Kopf 15 Sekunden lang langsam zur rechten Schulter.",
        durationSeconds: 15,
      },
      { instruction: "Jetzt 15 Sekunden zur linken Schulter.", durationSeconds: 15 },
      {
        instruction: "Kreise die Schultern 15 Sekunden lang langsam nach vorne.",
        durationSeconds: 15,
      },
      { instruction: "Und jetzt 15 Sekunden nach hinten.", durationSeconds: 15 },
      {
        instruction:
          "Zieh die Schultern zu den Ohren hoch und lass sie wieder fallen. Wiederhole das dreimal.",
        durationSeconds: 15,
      },
      {
        instruction: "Senke den Kopf sanft nach vorne, 15 Sekunden lang, der Nacken wird lang.",
        durationSeconds: 15,
      },
      {
        instruction: "Gut gemacht. Schultern noch einmal kurz lockern.",
        durationSeconds: 9,
      },
    ],
  },
  {
    id: "move",
    label: "Aufstehen und bewegen",
    steps: [
      {
        instruction:
          "Steh auf und geh 20 Sekunden lang ein paar Schritte, zum Beispiel zum Fenster und zurück.",
        durationSeconds: 20,
      },
      {
        instruction: "Kreise die Schultern 15 Sekunden lang nach vorne.",
        durationSeconds: 15,
      },
      { instruction: "Und jetzt 15 Sekunden nach hinten.", durationSeconds: 15 },
      {
        instruction: "Streck die Arme 15 Sekunden lang über den Kopf und atme tief durch.",
        durationSeconds: 15,
      },
      {
        instruction: "Geh noch einmal 20 Sekunden umher, ganz in deinem Tempo.",
        durationSeconds: 20,
      },
      {
        instruction: "Gut gemacht. Setz dich wieder hin, wenn du möchtest.",
        durationSeconds: 9,
      },
    ],
  },
];
