// Zustand unmittelbar vor Sitzungsstart, siehe docs/SPEZIFIKATION.md [4]
// (ergaenzt 12.09., Prioritaet 2 aus der Betreuungsbesprechung). Ersetzt das
// alte V7 aus der Vorbefragung ("wie ausgeruht fuehlst du dich jetzt gerade,
// vor dieser Sitzung") - eine Messung direkt vor der Sitzung ist ein
// verlaesslicherer Vergleichswert fuer die Nachbefragung als eine
// Einschaetzung des typischen Zustands.
//
// Werte landen als eigene Felder auf Session (restedAtStart, focusAtStart),
// nicht in der Vorbefragung - siehe ENTSCHEIDUNGEN.md.

// Kurzer Hinweis direkt vor dem Start, mit Bestaetigungshaekchen (ergaenzt
// 18.09.). Die Erklaerseite "So funktioniert die App" steht schon vor der
// Vorbefragung und erklaert dort den Ablauf, das bleibt auch so. Nur liegen
// zwischen dem Lesen und dem echten Sitzungsstart rund zehn Minuten
// Fragebogen, und wer das Fenster danach zurechtruecken soll, hat es bis
// dahin vergessen. Deshalb hier noch einmal die drei Bedingungen, die
// wirklich erfuellt sein muessen, in drei Zeilen statt vier Absaetzen.
//
// Das ist keine Formalie: bleibt das Fenster im Hintergrund, wirkt die
// visuelle Eskalation bei dieser Person gar nicht, und dann wird bei ihr
// etwas anderes gemessen als bei den uebrigen neun. Das Haekchen ist
// Pflicht, der Startknopf bleibt ohne es gesperrt. Damit gilt fuer jede
// gestartete Sitzung, dass die Bedingungen zur Kenntnis genommen wurden.
export const sessionStartSetupHint = {
  title: "Kurz vor dem Start, bitte einmal prüfen:",
  points: [
    "Das Fenster mit der App bleibt sichtbar, zum Beispiel auf einem Viertel bis einem Drittel des Bildschirms daneben oder auf einem zweiten Bildschirm.",
    "Der Ton ist an und nicht stummgeschaltet.",
    "Du arbeitest an deiner eigenen, echten Aufgabe.",
  ],
  confirmLabel: "Passt alles, ich kann loslegen.",
} as const;

export const sessionStartStateItems = [
  {
    id: "restedAtStart",
    question: "Wie ausgeruht fühlst du dich jetzt gerade?",
    lowLabel: "gar nicht",
    highLabel: "sehr",
  },
  {
    id: "focusAtStart",
    question: "Wie konzentriert fühlst du dich jetzt gerade?",
    lowLabel: "gar nicht",
    highLabel: "sehr",
  },
] as const;
