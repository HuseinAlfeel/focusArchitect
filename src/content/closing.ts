// Text der Abschlussseite (SPEZIFIKATION.md [11]). Bewusst knapp: Dank,
// Kontaktadresse für Rückfragen und Löschwünsche - explizit KEINE
// Auswertung für Teilnehmende, das würde nachträglich ihre bereits
// abgegebenen Antworten beeinflussen.

export const closingContent = {
  title: "Danke für deine Teilnahme.",
  body: "Deine Antworten wurden gespeichert. Die Sitzung ist damit abgeschlossen.",
  contactLabel: "Fragen oder eine Löschanfrage?",
  contactEmail: "husin.alfil@student.hpi.uni-potsdam.de",
} as const;

// Die fuenf "Danke", die rund um die Karte einfliegen, eins pro
// Konfetti-Explosion (19.09.). Reihenfolge = Reihenfolge des Erscheinens.
// Franzoesisch mit schmalem geschuetztem Leerzeichen vor dem Ausrufezeichen,
// Spanisch mit dem umgedrehten am Anfang, wie es in der jeweiligen Sprache
// richtig ist. Arabisch wird von rechts nach links gesetzt.
export const closingThanks = [
  { text: "Danke!", lang: "de", dir: "ltr" },
  { text: "Thank you!", lang: "en", dir: "ltr" },
  { text: "شكراً!", lang: "ar", dir: "rtl" },
  { text: "Merci !", lang: "fr", dir: "ltr" },
  { text: "¡Gracias!", lang: "es", dir: "ltr" },
] as const;
