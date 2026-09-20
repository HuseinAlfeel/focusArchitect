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

// Feinabstimmung 17.09., beim Testen zweimal aufgefallen: ein Satz und
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
//
// Überarbeitung 20.09., drei Punkte:
//
// (3) Kein Schlussschritt schickt mehr an den Bildschirm oder an die Arbeit
//     zurück. "Kurz blinzeln, dann zurück zum Bildschirm" stand am Ende der
//     Augenentlastung, obwohl danach noch mehrere Minuten Pause übrig sind -
//     ausgerechnet die App, die zu Bildschirmpausen anregen soll, holte
//     einen mitten in der Pause zurück an den Bildschirm. Die Schlusssätze
//     übergeben jetzt an die restliche Pause, statt sie zu beenden.
// (4) Die Ansagen klangen wie eine abgelesene Liste, weil jeder Schritt
//     gleich gebaut war ("X Sekunden lang ..."). Die Dauer steht weiterhin
//     in jedem Schritt - das ist der Punkt (1) von oben und bleibt -, aber
//     an wechselnder Stelle im Satz, und jeder Schritt sagt zusätzlich, wie
//     die Bewegung gemeint ist ("nicht ziehen, nur das Gewicht wirken
//     lassen"). Das ist der Unterschied zwischen einer Anweisung und einer
//     Anleitung.
// (5) "Aufstehen und bewegen" bestand in der Mitte aus denselben
//     Schulterkreisen wie "Nacken und Schultern". Wer die Bewegungspause
//     wählt, bekommt jetzt auch Bewegung: Strecken, Drehen aus der Hüfte,
//     Zehenspitzen für den Kreislauf.
//
// Die Sekundenwerte sind dabei unverändert geblieben. Der Ablauf der Pause
// ist Teil der Intervention; geändert wurde, was gesagt wird, nicht wie
// lange es dauert.
//
// Randbedingung für den JEWEILS LETZTEN Schritt: Sobald seine Sekunden
// ablaufen, bricht BreakScreen die Sprachausgabe ab (cancelSpeech bei
// allStepsDone). Ein Schlusssatz, der die 9 Sekunden fast ausfüllt, wird bei
// einer langsameren Stimme mitten im Wort abgeschnitten. Deshalb sind die
// Schlusssätze bewusst kurz gehalten, gerechnet mit rund 2,2 Wörtern pro
// Sekunde bei der eingestellten Sprechrate 0.9 - das lässt etwa ein Drittel
// Luft. Wer hier später umformuliert: kurz halten.
export const activities: Activity[] = [
  {
    id: "eyes",
    label: "Augenentlastung",
    steps: [
      {
        instruction:
          "Such dir etwas, das weit weg ist. Ein Fenster, die Wand am anderen Ende des Raums. Schau 20 Sekunden lang dorthin.",
        durationSeconds: 20,
      },
      {
        instruction:
          "Blinzle ein paar Mal ganz bewusst, das befeuchtet die Augen. Und dann wieder 20 Sekunden in die Ferne.",
        durationSeconds: 20,
      },
      {
        instruction:
          "Noch ein letztes Mal 20 Sekunden in die Ferne. Lass die Augen dabei ganz locker, du musst nichts scharf stellen.",
        durationSeconds: 20,
      },
      {
        instruction: "Das war es für die Augen. Der Rest der Pause gehört dir.",
        durationSeconds: 9,
      },
    ],
  },
  {
    id: "neck",
    label: "Nacken und Schultern",
    steps: [
      {
        instruction:
          "Lass den Kopf langsam zur rechten Schulter sinken. Nicht ziehen, nur das Gewicht wirken lassen. 15 Sekunden.",
        durationSeconds: 15,
      },
      {
        instruction: "Und jetzt die andere Seite. Kopf langsam nach links, wieder 15 Sekunden.",
        durationSeconds: 15,
      },
      {
        instruction:
          "Zurück in die Mitte. Kreise die Schultern 15 Sekunden lang nach vorne, ruhig und groß.",
        durationSeconds: 15,
      },
      {
        instruction:
          "Jetzt die Richtung wechseln, 15 Sekunden nach hinten. Die Arme hängen dabei ganz locker.",
        durationSeconds: 15,
      },
      {
        instruction:
          "Zieh die Schultern hoch zu den Ohren, halte kurz, und lass sie fallen. Dreimal, in deinem Tempo.",
        durationSeconds: 15,
      },
      {
        instruction:
          "Zum Schluss den Kopf sanft nach vorne sinken lassen, 15 Sekunden. Spür, wie der Nacken dabei lang wird.",
        durationSeconds: 15,
      },
      {
        instruction: "Fertig. Schultern einmal locker ausrollen. Der Rest der Pause gehört dir.",
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
          "Steh auf und geh ein paar Schritte. Zum Fenster, zur Tür, egal wohin. 20 Sekunden.",
        durationSeconds: 20,
      },
      {
        instruction:
          "Streck dich einmal richtig lang. Arme nach oben, 15 Sekunden, und atme dabei tief ein.",
        durationSeconds: 15,
      },
      {
        instruction:
          "Arme wieder fallen lassen. Dreh dich jetzt 15 Sekunden lang locker aus der Hüfte, einmal nach rechts, einmal nach links.",
        durationSeconds: 15,
      },
      {
        instruction:
          "Stell dich hin und geh ein paar Mal auf die Zehenspitzen und wieder herunter. 15 Sekunden, das bringt den Kreislauf in Schwung.",
        durationSeconds: 15,
      },
      {
        instruction:
          "Geh noch einmal 20 Sekunden umher, ganz in deinem Tempo. Schau dabei ruhig aus dem Fenster, wenn eins da ist.",
        durationSeconds: 20,
      },
      {
        instruction: "Fertig. Bleib ruhig noch stehen. Der Rest der Pause gehört dir.",
        durationSeconds: 9,
      },
    ],
  },
];
