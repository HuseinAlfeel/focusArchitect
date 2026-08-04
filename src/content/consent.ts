// PLATZHALTER — Wortlaut noch nicht mit Holly abgestimmt.
// Siehe CLAUDE.md, Abschnitt "Offen, noch nicht entschieden".
// Vor dem Probelauf (Phase J) muss dieser Text final freigegeben sein,
// insbesondere die Abschnitte "Welche Daten" und "Speicherung" sowie die Kontaktadresse.

export const consentContent = {
  title: "Einwilligung zur Teilnahme",
  intro:
    "Bevor die Sitzung beginnt, lies bitte die folgenden Informationen aufmerksam durch.",
  sections: [
    {
      heading: "Wer führt die Studie durch?",
      body: "Diese Studie wird im Rahmen der Bachelorarbeit von Husein Alfil am Hasso-Plattner-Institut, Fachgebiet Digital Health, durchgeführt (Betreuung: Holly Ambrozic McKee, Dr. Orhan Konak).",
    },
    {
      heading: "Worum geht es?",
      body: "Untersucht wird, wie Software zu gesunden Bildschirmpausen anregen kann, ohne die Arbeit dabei zu stören. Du arbeitest in dieser Sitzung an deiner eigenen, echten Tätigkeit.",
    },
    {
      heading: "Welche Daten werden erhoben? [PLATZHALTER — mit Holly abstimmen]",
      body: "Erhoben werden: deine Antworten aus Vor- und Nachbefragung, Zeitstempel und Ereignisse während der Sitzung (z. B. wann ein Pausenhinweis erschien und wie du reagiert hast, ob der Browser-Tab aktiv war), sowie eine kurze Freitext-Beschreibung deiner geplanten Tätigkeit. Der Inhalt deiner eigentlichen Arbeit wird nicht erfasst.",
    },
    {
      heading: "Wo und wie lange werden die Daten gespeichert? [PLATZHALTER]",
      body: "Die Daten werden auf einem Server in Deutschland gespeichert und ausschließlich für die Zwecke dieser Bachelorarbeit verwendet.",
    },
    {
      heading: "Freiwilligkeit",
      body: "Die Teilnahme ist freiwillig. Du kannst die Teilnahme jederzeit ohne Angabe von Gründen abbrechen, ohne dass dir daraus Nachteile entstehen.",
    },
    {
      heading: "Löschung deiner Daten",
      body: "Du kannst jederzeit, auch nach der Sitzung, die Löschung deiner Daten verlangen. Wende dich dazu an die unten stehende Kontaktadresse.",
    },
    {
      heading: "Kontakt",
      body: "[PLATZHALTER: Kontakt-E-Mail-Adresse einsetzen]",
    },
  ],
  checkboxLabel:
    "Ich habe die Informationen gelesen und nehme freiwillig teil.",
  submitLabel: "Einwilligen und fortfahren",
} as const;
