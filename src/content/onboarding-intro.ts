// Kurze Erklärung, wie die App funktioniert - ergänzt 14.09. Husins Befund:
// die Durchführung ist ortsunabhängig und nicht begleitet (Teilnehmende
// bekommen nur Link + Zugangsdaten), die Einwilligung erklärt WARUM
// (Studienzweck), aber nirgends steht WIE man die App bedient. Bewusst
// getrennt vom Einwilligungstext (der ist mit der Betreuung abgestimmt und
// bleibt unangetastet) - eigener, kurzer Schritt direkt davor in der
// Vorbefragung.

export const onboardingIntroContent = {
  title: "So funktioniert die App",
  paragraphs: [
    "Du arbeitest in Runden: eine Weile konzentriert, dann eine kurze Pause. Am Rundenende meldet sich die App leise - du kannst die Pause sofort starten, kurz verschieben oder überspringen. Du kannst eine Pause auch jederzeit selbst starten, ohne auf den Hinweis zu warten.",
    "Nach jeder Pause fragt dich die App kurz, ob der Zeitpunkt gepasst hat. Danach geht es automatisch weiter.",
    "Arbeite einfach ganz normal an deiner echten Aufgabe. Lass das Fenster mit der App dabei sichtbar - zum Beispiel auf einem Viertel bis einem Drittel des Bildschirms daneben, oder auf einem zweiten Bildschirm. Der Hintergrund verändert sich gegen Rundenende langsam, das bemerkst du nur, wenn du es im Augenwinkel sehen kannst.",
    "Du kannst die Sitzung jederzeit über „Sitzung beenden“ abschließen - danach kommen noch ein paar letzte Fragen, und du bist fertig.",
  ],
  buttonLabel: "Los geht's",
} as const;
