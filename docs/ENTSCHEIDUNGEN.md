# Gestaltungsentscheidungen

## 04.08.2026 Next.js 16

**Entscheidung:** Next.js 16 statt Version 15 aus der Spezifikation.
**Begründung:** War die aktuelle Version, kein Grund veraltet anzufangen.
**Alternative:** Bei 15 bleiben. Verworfen.

## 04.08.2026 Ethikvotum

**Entscheidung:** Erstmal ohne förmliches Ethikvotum weiterbauen.
**Begründung:** Einwilligung der Teilnehmenden brauche ich so oder so. Ob ein Votum nötig ist, kläre ich noch mit Holly.
**Alternative:** Warten bis geklärt. Verworfen, hätte nur aufgehalten.

## 04.08.2026 Zweites Häkchen Einwilligung

**Entscheidung:** Zwei Häkchen statt einem: "gelesen und nehme teil" und "weiß, dass ich jederzeit abbrechen kann".
**Begründung:** Wollte den Abbruch-Punkt extra absichern.
**Alternative:** Ein kombiniertes Häkchen wie ursprünglich geplant. Verworfen.

## 04.08.2026 Keine E-Mail von Teilnehmenden

**Entscheidung:** Kein E-Mail-Feld für Teilnehmende.
**Begründung:** Würde die Pseudonymisierung über die Codes aushebeln. Ich kenne die Leute eh persönlich, für Löschanfragen reicht meine eigene Adresse im Einwilligungstext.
**Alternative:** E-Mail-Feld trotzdem einbauen. Verworfen.

## 04.08.2026 Löschdatum

**Entscheidung:** Konkretes Löschdatum 11.11.2026 im Einwilligungstext.
**Begründung:** Klarer als eine vage Formulierung.
**Alternative:** Vage lassen ("nach Abschluss der Arbeit"). Verworfen.

## 04.08.2026 Passwörter neutral

**Entscheidung:** Zugangscodes wie "Wolke-71B" statt thematischer Wörter wie "HandyWeg!01".
**Begründung:** Thematische Passwörter könnten schon vor der Vorbefragung aufs Studienthema hindeuten und die Antworten beeinflussen.
**Alternative:** Bei der thematischen Idee bleiben. Verworfen.

## 04.08.2026 Sounds selbst gebaut

**Entscheidung:** Töne für den Pausenhinweis per Web Audio API selbst erzeugt, keine fertigen Dateien.
**Begründung:** Lautstärke genau einstellbar, keine Lizenzfragen.
**Alternative:** Fertige Sounds z. B. von freesound.org. Als Rückfallplan im Hinterkopf behalten.

## 04.08.2026 Glocke statt Holzklopfen

**Entscheidung:** Ton geht Richtung weiche Glocke, nicht Holzklopfen.
**Begründung:** Holzklopfen klang beim Testen einfach nicht gut. Zehn Varianten gebaut und verglichen.
**Alternative:** Holzklopfen. Verworfen nach dem Hörtest.

## 04.08.2026 Ton-Zeitplan Arbeitsphase

**Entscheidung:** Eskalation ab Ablauf: -30s leise, 0:00 etwas lauter, +1min und +2min wieder, ab +3min pulsierend jede Minute.
**Begründung:** In einem Hintergrund-Tab sieht man die visuellen Stufen nicht, nur Ton fällt auf.
**Alternative:** Nur der eine leise Ton aus der Spezifikation. Verworfen, zu wenig für unsichtbare Tabs. Läuft zusätzlich zu den visuellen Stufen.

## 05.08.2026 Kein Verschieben um 5 Minuten

**Entscheidung:** Option "Pause um 5 Min verschieben" raus. Bleibt: Pause starten, überspringen.
**Begründung:** Blindes Verschieben ohne genaue Minutenangabe ist ungenau, das übernimmt jetzt das Kurzfeedback.
**Alternative:** Aus Spezifikation übernehmen. Verworfen.

## 05.08.2026 Kurzfeedback vor Aktivität und Pause

**Entscheidung:** Kurzfeedback direkt nach Reaktion auf den Pausenhinweis, vor Aktivität und Pause.
**Begründung:** Frage bezieht sich auf die gerade beendete Arbeitsphase, das beantwortet man direkt danach ehrlicher als nach einer Pause.
**Alternative:** Reihenfolge aus Spezifikation behalten. Verworfen nach eigenem Test.

## 05.08.2026 Sitzung fortsetzen oder final abgeben

**Entscheidung:** Nach "Sitzung beenden" zwei Wege: fortsetzen (falls aus Versehen) oder final abgeben (endgültig).
**Begründung:** Ein Klick sollte nicht sofort unwiderruflich sein.
**Alternative:** Beenden bleibt endgültig wie ursprünglich gebaut. Verworfen.

## 09.08.2026 Überzeit-Anzeige

**Entscheidung:** Nach Ablauf der Arbeitszeit zeigt der Timer "+MM:SS" statt leer zu bleiben.
**Begründung:** Beim Testen verschwand die Anzeige einfach, wirkte kaputt.
**Alternative:** So lassen. Verworfen.

## 09.08.2026 Signal am Pausenende

**Entscheidung:** Letzte 10 Sekunden der Pause: leiser Countdown-Ton, bei 0 ein deutliches Signal.
**Begründung:** Vorher gab es am Pausenende gar kein Signal.
**Alternative:** Kein Signal, wie ursprünglich gebaut. Verworfen.

## 09.08.2026 Überspringen wirklich umsetzen

**Entscheidung:** "Überspringen" geht direkt in die nächste Arbeitsrunde, ganz ohne Aktivität und Pause.
**Begründung:** In der ersten Version lief Überspringen trotzdem durch Aktivität und Pause, nur der Name im Protokoll war anders. Ergab so keinen Sinn.
**Alternative:** So lassen. Verworfen.

## 10.08.2026 Nachbefragung erst nach Sitzungsende

**Entscheidung:** Nachbefragung nur erreichbar, wenn die Sitzung beendet ist, danach automatisch final.
**Begründung:** Die Fragen bewerten die ganze Sitzung im Rückblick, vorher ergibt das keinen Sinn.
**Alternative:** Jederzeit zugänglich machen. Verworfen.

## 11.08.2026 Minuten-Zähler statt fester Knöpfe beim Kurzfeedback

**Entscheidung:** Bei der Anpassung der Arbeitszeit gibt es jetzt einen Zähler in 5-Minuten-Schritten
(minus/plus), frei nach oben oder unten, statt der vier festen Knöpfe -10/-5/+5/+10.
**Begründung:** Die festen Sprünge waren zu grob, jemand der z.B. 15 Minuten mehr wollte, kam damit nicht
direkt hin.
**Alternative:** Bei den vier festen Knöpfen bleiben. Verworfen.

## 24.08.2026 Demografischer Block und finale Nachbefragung

**Entscheidung:** Vorbefragung um einen demografischen Block (D1-D5: Altersgruppe, Geschlecht, Tätigkeit,
Arbeitsstunden pro Tag, davon im Sitzen) ergänzt, ganz vorne vor V1. Die Nachbefragung komplett durch eine
neue Fassung ersetzt (N1-N19): Zustand nach der Sitzung, dazu zwei etablierte Skalen ("wahrgenommene
Überzeugungskraft" und "wahrgenommene Aufdringlichkeit", je 1-7 mit voll ausbeschrifteten Zustimmungsstufen),
danach Vergleichsfrage und Freitext.
**Begründung:** Mit Holly abgestimmt. Die etablierten Skalen sind wissenschaftlich stärker als die alten
selbst gebauten N3-N6-Fragen, weil sie geprüft und vergleichbar sind.
**Alternative:** Bei den alten N1-N10 bleiben. Verworfen, da nicht mehr die abgestimmte Fassung.
