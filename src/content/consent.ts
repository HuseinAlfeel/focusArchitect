// Vorlaeufiger Stand, von Husein am 04.08.2026 freigegeben, um weiterzubauen.
// Holly hat den Studienaufbau noch nicht gegengelesen (CHECKLIST.md A1/A3) -
// falls sie Aenderungen verlangt, wird dieser Text danach angepasst.
// Einzig noch offen: Kontakt-E-Mail-Adresse unten eintragen.

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
      heading: "Welche Daten werden erhoben?",
      body: "Erhoben werden: deine Antworten aus Vor- und Nachbefragung, Zeitstempel und Ereignisse während der Sitzung (z. B. wann ein Pausenhinweis erschien und wie du reagiert hast, ob der Browser-Tab aktiv war), sowie eine kurze Freitext-Beschreibung deiner geplanten Tätigkeit. Der Inhalt deiner eigentlichen Arbeit wird nicht erfasst. Du wirst ausschließlich über deinen Teilnahme-Code (z. B. „P01“) identifiziert, nicht über deinen Namen.",
    },
    {
      heading: "Wo und wie lange werden die Daten gespeichert?",
      body: "Die Daten werden auf einem Server in Deutschland gespeichert und ausschließlich für die Zwecke dieser Bachelorarbeit verwendet. Sie werden bis zum 11.11.2026 aufbewahrt und danach gelöscht, sofern du nicht vorher eine frühere Löschung verlangst.",
    },
    {
      heading: "Freiwilligkeit",
      body: "Die Teilnahme ist freiwillig. Du kannst die Teilnahme jederzeit ohne Angabe von Gründen abbrechen, ohne dass dir daraus Nachteile entstehen.",
    },
    {
      heading: "Löschung deiner Daten",
      body: "Du kannst jederzeit, auch nach der Sitzung, die Löschung deiner Daten verlangen. Wende dich dazu formlos an die unten stehende Kontaktadresse und nenne deinen Teilnahme-Code.",
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
