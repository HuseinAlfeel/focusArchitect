// Kurzer Hinweis ans Trinken, der zu Beginn der freien Pausenzeit einmal
// erscheint und nach ein paar Sekunden von selbst wieder verschwindet
// (20.09.). Hier, damit sich Wortlaut und Anzeigedauer ändern lassen, ohne
// im JSX zu suchen - so wie bei den übrigen Studientexten.
//
// Bewusst ein Satz ohne Ausrufezeichen und ohne "nicht vergessen": Der
// Hinweis soll wie eine beiläufige Notiz wirken, nicht wie eine Ermahnung.
// Er ist kein Teil der gemessenen Intervention, sondern gehört zur
// Pausengestaltung.
export const waterHint = {
  text: "Trink einen Schluck Wasser.",
  /** Wie lange der Hinweis stehen bleibt, bevor er ausblendet. */
  visibleMs: 12_000,
  /** Dauer der Ausblendbewegung, muss zur CSS-Animation passen. */
  fadeOutMs: 600,
};
