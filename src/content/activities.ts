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
//     wählt, bekommt jetzt auch Bewegung.
//
// Nachgeschärft am 23.09. (Betreuung): Die Übungen sind ausschließlich im
// Stehen und überschneiden sich an keiner Stelle mehr mit "Nacken und
// Schultern" - gehen, Beine ausschütteln, strecken, Zehenspitzen, ans
// Fenster gehen. Dabei zusätzlich auf gesprochene Sprache geachtet: kurze
// Sätze, und keine Aufzählung innerhalb eines Satzes. Vorlesen betont eine
// Aufzählung nicht, sie klingt dann wie eine abgehakte Liste ("Zum Fenster,
// zur Tür, egal wohin" stand vorher so drin).
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
          "Steh auf und geh ein paar Schritte durch den Raum. 20 Sekunden, ganz gemütlich.",
        durationSeconds: 20,
      },
      {
        instruction:
          "Stell dich hin und schüttel das rechte Bein locker aus. Dann das linke. 15 Sekunden.",
        durationSeconds: 15,
      },
      {
        instruction:
          "Jetzt streck dich. Arme nach oben, so weit es angenehm ist. 15 Sekunden, und atme dabei tief ein.",
        durationSeconds: 15,
      },
      {
        instruction:
          "Lass die Arme sinken. Geh 15 Sekunden lang ein paar Mal auf die Zehenspitzen und wieder herunter.",
        durationSeconds: 15,
      },
      {
        instruction:
          "Geh noch ein paar Schritte, am besten Richtung Fenster. Schau 20 Sekunden lang nach draußen.",
        durationSeconds: 20,
      },
      {
        instruction: "Fertig. Bleib ruhig noch stehen. Der Rest der Pause gehört dir.",
        durationSeconds: 9,
      },
    ],
  },
];
