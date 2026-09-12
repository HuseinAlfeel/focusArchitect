// Zustand unmittelbar vor Sitzungsstart, siehe docs/SPEZIFIKATION.md [4]
// (ergaenzt 12.09., Prioritaet 2 aus der Betreuungsbesprechung). Ersetzt das
// alte V7 aus der Vorbefragung ("wie ausgeruht fuehlst du dich jetzt gerade,
// vor dieser Sitzung") - eine Messung direkt vor der Sitzung ist ein
// verlaesslicherer Vergleichswert fuer die Nachbefragung als eine
// Einschaetzung des typischen Zustands.
//
// Werte landen als eigene Felder auf Session (restedAtStart, focusAtStart),
// nicht in der Vorbefragung - siehe ENTSCHEIDUNGEN.md.

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
