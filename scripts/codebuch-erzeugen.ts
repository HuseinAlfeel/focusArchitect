import "dotenv/config";
import { writeFileSync } from "node:fs";
import path from "node:path";
import { preSurveyItems } from "@/content/pre-survey";
import {
  likertScaleLabels,
  postSurveyStateItems,
  postSurveyPersuasivenessItems,
  postSurveyIntrusivenessItems,
  postSurveyComparisonItem,
  postSurveyComparisonReasonItem,
  postSurveyClosingTextItems,
  requiredPostSurveyIds,
} from "@/content/post-survey";
import {
  CYCLES_COLUMNS,
  EVENTS_COLUMNS,
  PARTICIPANTS_COLUMNS,
  pruefeSpaltenlisten,
} from "@/lib/exportColumns";

// Erzeugt docs/CODEBUCH.md aus den Fragedefinitionen im Code (22.09.).
//
// Von Hand geschrieben waere dieses Dokument schon beim naechsten
// Wortlaut-Wechsel falsch, und ein Codebuch, das nicht zur Datei passt, ist
// schlimmer als keins - es fuehrt die Auswertung in die Irre, statt sie zu
// stuetzen. Deshalb kommen Fragetext, Format, Wertebereich und Bedingung
// direkt aus src/content/*, und die Spaltenreihenfolge aus derselben Liste,
// die auch der Export benutzt (src/lib/exportColumns.ts).
//
// Erneut erzeugen mit:  npm run codebuch

type Eintrag = {
  spalte: string;
  fragetext: string;
  block: string;
  format: string;
  wertebereich: string;
  bedingung: string;
  leer: string;
};

const LEER_NICHT_GEZEIGT = "nicht gezeigt";
const LEER_NICHT_BEANTWORTET = "nicht beantwortet";
const LEER_NICHT_ANWENDBAR = "nicht anwendbar";

function zelle(text: string): string {
  // Senkrechte Striche wuerden die Markdown-Tabelle zerlegen.
  return text.replace(/\|/g, "\\|").replace(/\s+/g, " ").trim();
}

function tabelle(eintraege: Eintrag[]): string {
  const kopf =
    "| Spalte | Fragetext / Inhalt | Seite / Block | Format | Wertebereich | Bedingung | Leere Zelle bedeutet |";
  const trenner = "|---|---|---|---|---|---|---|";
  const zeilen = eintraege.map(
    (e) =>
      `| \`${e.spalte}\` | ${zelle(e.fragetext)} | ${zelle(e.block)} | ${zelle(e.format)} | ${zelle(
        e.wertebereich
      )} | ${zelle(e.bedingung)} | ${zelle(e.leer)} |`
  );
  return [kopf, trenner, ...zeilen].join("\n");
}

// ---------------------------------------------------------------------------
// Vorbefragung
// ---------------------------------------------------------------------------

type InhaltsItem = {
  id: string;
  type?: string;
  question: string;
  options?: readonly { value: string; label: string }[];
  lowLabel?: string;
  highLabel?: string;
  showIf?: { id: string; yes: boolean };
  followUp?: { type: string; question: string };
};

function formatVon(typ: string | undefined): string {
  switch (typ) {
    case "choice":
      return "Auswahl";
    case "yesno":
      return "Auswahl (ja/nein)";
    case "scale":
      return "Skala 1–7";
    case "number":
      return "Zahl";
    case "textarea":
      return "Freitext (mehrzeilig)";
    case "text":
    default:
      return "Freitext";
  }
}

function wertebereichVon(item: InhaltsItem, typ?: string): string {
  const t = typ ?? item.type;
  if (t === "choice" && item.options) {
    return item.options.map((o) => `\`${o.value}\``).join(", ");
  }
  if (t === "yesno") return "`ja`, `nein`";
  if (t === "scale") {
    return `1–7 (1 = „${item.lowLabel}", 7 = „${item.highLabel}")`;
  }
  if (t === "number") return "ganze Zahl";
  return "freier Text";
}

const vorbefragung: Eintrag[] = [];
for (const rohItem of preSurveyItems as readonly unknown[]) {
  const item = rohItem as InhaltsItem;
  const block = item.id.startsWith("A")
    ? "Vorbefragung, Schritt 1 (Person und Tätigkeit)"
    : item.id.startsWith("B")
      ? "Vorbefragung, Schritt 2 (Pausenverhalten)"
      : item.id.startsWith("C")
        ? "Vorbefragung, Schritt 2 (Einstellung)"
        : "Vorbefragung, Schritt 2 (typisches Befinden)";

  const bedingung = item.showIf
    ? `nur wenn ${item.showIf.id} = ${item.showIf.yes ? "ja" : "nein"}`
    : "immer sichtbar";

  vorbefragung.push({
    spalte: item.id,
    fragetext: item.question,
    block,
    format: formatVon(item.type),
    wertebereich: wertebereichVon(item),
    bedingung,
    leer: item.showIf ? LEER_NICHT_GEZEIGT : LEER_NICHT_BEANTWORTET,
  });

  if (item.followUp) {
    const eigeneBedingung = item.showIf
      ? `nur wenn ${item.showIf.id} = ja UND ${item.id} = ja`
      : `nur wenn ${item.id} = ja`;
    vorbefragung.push({
      spalte: `${item.id}_followUp`,
      fragetext: item.followUp.question,
      block: `${block}, Anschlussfrage zu ${item.id}`,
      format: formatVon(item.followUp.type),
      wertebereich: wertebereichVon(item, item.followUp.type),
      bedingung: eigeneBedingung,
      leer: `${LEER_NICHT_GEZEIGT} (wenn ${item.id} = nein) oder ${LEER_NICHT_BEANTWORTET} (wenn ${item.id} = ja und das Feld leer blieb)`,
    });
  }
}

// ---------------------------------------------------------------------------
// Nachbefragung
// ---------------------------------------------------------------------------

const PFLICHT = new Set<string>(requiredPostSurveyIds as readonly string[]);
const likertBereich = `1–7 (1 = „${likertScaleLabels[0]}", 7 = „${likertScaleLabels[6]}")`;

const nachbefragung: Eintrag[] = [];

for (const rohItem of postSurveyStateItems as readonly unknown[]) {
  const item = rohItem as InhaltsItem;
  nachbefragung.push({
    spalte: item.id,
    fragetext: item.question,
    block: "Nachbefragung, Seite 1 (Zustand nach der Sitzung)",
    format: "Skala 1–7",
    wertebereich: wertebereichVon(item, "scale"),
    bedingung: "immer sichtbar, Pflichtfeld",
    leer: `${LEER_NICHT_BEANTWORTET} (Pflichtfeld, sollte nicht vorkommen)`,
  });
}

for (const [items, skala] of [
  [postSurveyPersuasivenessItems, "Überzeugungskraft"],
  [postSurveyIntrusivenessItems, "Aufdringlichkeit"],
] as const) {
  for (const rohItem of items as readonly unknown[]) {
    const item = rohItem as InhaltsItem;
    nachbefragung.push({
      spalte: item.id,
      fragetext: item.question,
      block: `Nachbefragung, Seite 2 (Skala ${skala})`,
      format: "Skala 1–7 (Likert)",
      wertebereich: likertBereich,
      bedingung: "immer sichtbar, Pflichtfeld",
      leer: `${LEER_NICHT_BEANTWORTET} (Pflichtfeld, sollte nicht vorkommen)`,
    });
  }
}

nachbefragung.push({
  spalte: postSurveyComparisonItem.id,
  fragetext: postSurveyComparisonItem.question,
  block: "Nachbefragung, Seite 1 (Vergleich)",
  format: "Auswahl",
  wertebereich: postSurveyComparisonItem.options.map((o) => `\`${o.value}\``).join(", "),
  bedingung: "immer sichtbar, Pflichtfeld",
  leer: `${LEER_NICHT_BEANTWORTET} (Pflichtfeld, sollte nicht vorkommen)`,
});

nachbefragung.push({
  spalte: postSurveyComparisonReasonItem.id,
  fragetext: postSurveyComparisonReasonItem.question,
  block: "Nachbefragung, Seite 1 (Begründung zum Vergleich)",
  format: "Freitext",
  wertebereich: "freier Text",
  bedingung: "immer sichtbar, freiwillig",
  leer: LEER_NICHT_BEANTWORTET,
});

for (const rohItem of postSurveyClosingTextItems as readonly unknown[]) {
  const item = rohItem as InhaltsItem;
  nachbefragung.push({
    spalte: item.id,
    fragetext: item.question,
    block: "Nachbefragung, Seite 3 (abschließendes Feedback)",
    format: "Freitext (mehrzeilig)",
    wertebereich: "freier Text",
    bedingung: PFLICHT.has(item.id) ? "immer sichtbar, Pflichtfeld" : "immer sichtbar, freiwillig",
    leer: LEER_NICHT_BEANTWORTET,
  });
}

// Reihenfolge wie im Export, nicht wie im Fragebogen.
const nachbefragungSortiert = [...nachbefragung].sort(
  (a, b) => Number(a.spalte.slice(1)) - Number(b.spalte.slice(1))
);

// ---------------------------------------------------------------------------
// Technische Spalten. Die lassen sich nicht aus Fragedefinitionen ableiten,
// weil es keine Fragen sind - sie stehen hier, direkt neben dem Generator.
// Die Vollstaendigkeitspruefung weiter unten schlaegt Alarm, sobald im Export
// eine Spalte auftaucht, die hier fehlt.
// ---------------------------------------------------------------------------

const T = (
  fragetext: string,
  block: string,
  format: string,
  wertebereich: string,
  bedingung: string,
  leer: string
): Omit<Eintrag, "spalte"> => ({ fragetext, block, format, wertebereich, bedingung, leer });

const nichtAnwendbar = (grund: string) => `${LEER_NICHT_ANWENDBAR} (${grund})`;

const TECHNISCHE_SPALTEN: Record<string, Omit<Eintrag, "spalte">> = {
  code: T("Teilnahme-Code", "Sitzung", "Text", "`P01`–`P20`, `PILOT`, `ADMIN`", "immer", LEER_NICHT_ANWENDBAR),
  sessionId: T("Technische Kennung der Sitzung", "Sitzung", "Text", "cuid", "immer", LEER_NICHT_ANWENDBAR),
  consentAt: T("Zeitpunkt der Einwilligung", "Sitzung", "Zeitstempel", "ISO 8601, UTC", "immer", "keine Einwilligung erteilt – dann dürfen auch keine Studiendaten vorliegen"),
  startedAt: T("Zeitpunkt des Sitzungsstarts", "Sitzung", "Zeitstempel", "ISO 8601, UTC", "nach der Vorbefragung", "Sitzung nie gestartet"),
  endedAt: T("Zeitpunkt des Sitzungsendes", "Sitzung", "Zeitstempel", "ISO 8601, UTC", "beim Beenden über den Knopf", "Sitzung nicht beendet (abgebrochen oder noch offen)"),
  durationMin: T("Sitzungsdauer, berechnet aus endedAt minus startedAt", "Sitzung", "Zahl (Minuten)", "ganze Minuten", "nur wenn startedAt und endedAt vorliegen", LEER_NICHT_ANWENDBAR),
  finalizedAt: T("Zeitpunkt der endgültigen Abgabe, danach kein Wiedereröffnen", "Sitzung", "Zeitstempel", "ISO 8601, UTC", "nach der Nachbefragung", "noch nicht endgültig abgegeben"),
  initialWorkMin: T("Rundenlänge zu Beginn der Sitzung", "Sitzung", "Zahl (Minuten)", "Standard 25", "immer", LEER_NICHT_ANWENDBAR),
  initialBreakMin: T("Geplante Pausenlänge, über die ganze Sitzung unverändert", "Sitzung", "Zahl (Minuten)", "Standard 5", "immer", LEER_NICHT_ANWENDBAR),
  taskDescription: T("„Woran arbeitest du?“, frei beschrieben beim Sitzungsstart", "Sitzungsstart", "Freitext", "freier Text", "immer sichtbar", LEER_NICHT_BEANTWORTET),
  restedAtStart: T("„Wie ausgeruht fühlst du dich jetzt gerade?“, unmittelbar vor Sitzungsstart", "Sitzungsstart", "Skala 1–7", "1–7 (1 = gar nicht, 7 = sehr)", "immer sichtbar", LEER_NICHT_BEANTWORTET),
  focusAtStart: T("„Wie konzentriert fühlst du dich jetzt gerade?“, unmittelbar vor Sitzungsstart", "Sitzungsstart", "Skala 1–7", "1–7 (1 = gar nicht, 7 = sehr)", "immer sichtbar", LEER_NICHT_BEANTWORTET),
  postPage1Seconds: T("Bearbeitungsdauer Seite 1 der Nachbefragung", "Nachbefragung, abgeleitet", "Zahl (Sekunden)", "ganze Sekunden", "nur wenn Lade- und Absendezeitpunkt vorliegen", LEER_NICHT_ANWENDBAR),
  postPage2Seconds: T("Bearbeitungsdauer Seite 2 der Nachbefragung (13 Aussagen). Richtwert für Blindklicken: unter 20 Sekunden", "Nachbefragung, abgeleitet", "Zahl (Sekunden)", "ganze Sekunden", "nur wenn Lade- und Absendezeitpunkt vorliegen", LEER_NICHT_ANWENDBAR),
  postPage3Seconds: T("Bearbeitungsdauer Seite 3 der Nachbefragung", "Nachbefragung, abgeleitet", "Zahl (Sekunden)", "ganze Sekunden", "nur wenn Lade- und Absendezeitpunkt vorliegen", LEER_NICHT_ANWENDBAR),

  cycle: T("Rundennummer innerhalb der Sitzung", "Runde", "Zahl", "ab 1 aufsteigend", "immer", "Ereignis gehört zu keiner Runde (z. B. Einwilligung, Vorbefragung)"),
  cycleCompleted: T("Ist die Runde vollständig durchlaufen worden? `true`, sobald die **nächste** Runde begonnen hat (`CYCLE_STARTED`). Das erfasst beide Wege – Pause genommen wie Pause übersprungen – und ist `false` genau für die abgebrochene letzte Runde einer Sitzung. Bei Zählungen zu Pausenannahme und Intervallanpassung nur Runden mit `true` einbeziehen", "Runde", "Wahrheitswert", "`true` = nächste Runde hat begonnen, `false` = Sitzung endete in dieser Runde", "immer", LEER_NICHT_ANWENDBAR),
  workMin: T("Rundenlänge dieser Runde", "Runde", "Zahl (Minuten)", "mindestens 5", "immer", LEER_NICHT_ANWENDBAR),
  workStartedAt: T("Beginn der Arbeitsphase dieser Runde", "Runde", "Zeitstempel", "ISO 8601, UTC", "immer", "kein WORK_STARTED protokolliert"),
  reactionType: T("Art der Reaktion, die die Runde beendet hat", "Runde", "Auswahl", "`BREAK_ACCEPTED`, `BREAK_SKIPPED`, `SELF_INITIATED`", "immer", "Runde wurde nicht beendet (letzte Runde bei Sitzungsende)"),
  reactionStage: T("Stufe des Hinweises zum Zeitpunkt der Reaktion – die Kernkennzahl der Arbeit", "Runde", "Zahl", "0–3", "nur bei Reaktion auf einen Systemhinweis", nichtAnwendbar("selbst gestartete Pause, kein Hinweis im Spiel")),
  reactionSecondsAfterEnd: T("Sekunden zwischen Rundenende und Reaktion. **Achtung bei `snoozeCount` über 0:** Der Wert zählt weiter ab dem ursprünglichen Rundenende, die Eskalation beginnt nach einem Snooze aber von vorn. Eine Zeile mit `reactionStage` = 1 und über 300 Sekunden ist deshalb kein Widerspruch, sondern eine Reaktion auf den **zweiten** Anlauf – immer zusammen mit `snoozeCount` lesen", "Runde", "Zahl (Sekunden)", "kann negativ sein, wenn vor 0:00 reagiert wurde", "nur bei Reaktion auf einen Systemhinweis", LEER_NICHT_ANWENDBAR),
  reactionSecondsIntoWork: T("Sekunden seit Beginn der Arbeitsphase bei selbst gestarteter Pause", "Runde", "Zahl (Sekunden)", "ab 0", "nur bei `SELF_INITIATED`", LEER_NICHT_ANWENDBAR),
  reactionAt: T("Zeitpunkt der Reaktion", "Runde", "Zeitstempel", "ISO 8601, UTC", "immer bei Reaktion", "Runde wurde nicht beendet"),
  nudgeStage1At: T("Zeitpunkt, zu dem Stufe 1 erreicht wurde (Rundenende, 0:00)", "Runde", "Zeitstempel", "ISO 8601, UTC", "nur wenn der Hinweis Stufe 1 erreicht hat", nichtAnwendbar("Pause vorher selbst gestartet")),
  tabVisibleAtNudge: T("War der Browser-Tab sichtbar, als Stufe 1 ausgelöst wurde?", "Runde", "Wahrheitswert", "`true`, `false`", "nur wenn Stufe 1 erreicht wurde", LEER_NICHT_ANWENDBAR),
  firstTabVisibleAfterNudge: T("Erste Rückkehr zum Tab nach Stufe 1, gesucht nur bis zur Reaktion", "Runde", "Zeitstempel", "ISO 8601, UTC", "nur wenn der Tab bei Stufe 1 unsichtbar war UND eine Reaktion erfolgte", nichtAnwendbar("Tab war sichtbar, es gab nichts zum Zurückkommen")),
  latencyToTabReturnSeconds: T("Reaktionslatenz: Sekunden von Stufe 1 bis zur Rückkehr zum Tab", "Runde", "Zahl (Sekunden)", "ab 0", "nur wenn der Tab bei Stufe 1 unsichtbar war UND eine Reaktion erfolgte", nichtAnwendbar("siehe tabVisibleAtNudge – bei `true` gab es nichts zum Zurückkommen")),
  snoozeCount: T("Wie oft in dieser Runde „Noch 5 Minuten“ gewählt wurde", "Runde", "Zahl", "ab 0, keine Obergrenze", "immer", LEER_NICHT_ANWENDBAR),
  activity: T("Gewählte Pausenaktivität", "Pause", "Auswahl", "`eyes`, `neck`, `move`, `keine`", "nur wenn eine Pause stattfand", nichtAnwendbar("Pause übersprungen")),
  breakStartedAt: T("Beginn der Pause", "Pause", "Zeitstempel", "ISO 8601, UTC", "nur wenn eine Pause stattfand", nichtAnwendbar("Pause übersprungen")),
  breakEndedAt: T("Ende der Pause – erst wenn „Sitzung starten“ gedrückt wird, nicht wenn der Timer abläuft", "Pause", "Zeitstempel", "ISO 8601, UTC", "nur wenn die Pause beendet wurde", nichtAnwendbar("Pause übersprungen oder Sitzung endete während der Pause")),
  breakPlannedMin: T("Geplante Pausenlänge (entspricht initialBreakMin)", "Pause", "Zahl (Minuten)", "Standard 5", "nur wenn eine Pause stattfand", nichtAnwendbar("Pause übersprungen")),
  breakActualMin: T("Tatsächliche Pausendauer, breakEndedAt minus breakStartedAt – kann die geplante Dauer deutlich überschreiten", "Pause", "Zahl (Minuten)", "ganze Minuten", "nur wenn Beginn und Ende vorliegen", LEER_NICHT_ANWENDBAR),
  timing: T("Kurzfeedback: „War der Zeitpunkt der Pause passend?“ – getrennt nach reactionType auswerten", "Kurzfeedback", "Auswahl", "`TOO_EARLY` = „zu früh (ich hätte gern länger gearbeitet)“, `OK` = „passend“, `TOO_LATE` = „zu spät (ich hätte gern früher Pause gemacht)“", "nach jeder Runde, auch nach selbst gestarteter Pause", "kein Kurzfeedback abgegeben (Runde nicht beendet)"),
  adjustmentMin: T("GEWÜNSCHTE Änderung der Rundenlänge in Minuten", "Kurzfeedback", "Zahl (Minuten)", "Vielfaches von 5, positiv oder negativ", "nur bei „zu früh“ oder „zu spät“", "kein Kurzfeedback abgegeben"),
  effectiveAdjustmentMin: T("WIRKSAME Änderung: newWorkMin minus workMin. Weicht von adjustmentMin ab, wenn die Untergrenze von 5 Minuten greift", "Kurzfeedback", "Zahl (Minuten)", "Vielfaches von 5", "nur wenn ein Kurzfeedback vorliegt", "kein Kurzfeedback abgegeben"),
  newWorkMin: T("Rundenlänge der nächsten Runde", "Kurzfeedback", "Zahl (Minuten)", "mindestens 5", "nur wenn ein Kurzfeedback vorliegt", "kein Kurzfeedback abgegeben"),
  comment: T("„Kurz in eigenen Worten?“ im Kurzfeedback", "Kurzfeedback", "Freitext", "freier Text", "immer sichtbar, freiwillig", LEER_NICHT_BEANTWORTET),

  type: T("Ereignistyp", "Ereignis", "Auswahl", "siehe Ereignisliste in SPEZIFIKATION.md, Abschnitt [11]", "immer", LEER_NICHT_ANWENDBAR),
  clientAt: T("Zeitpunkt im Browser – **für die zeitliche Sortierung diese Spalte verwenden**", "Ereignis", "Zeitstempel", "ISO 8601, UTC", "immer", LEER_NICHT_ANWENDBAR),
  at: T("Zeitpunkt des Eintreffens auf dem Server – kann durch Stapelversand deutlich später liegen", "Ereignis", "Zeitstempel", "ISO 8601, UTC", "immer", LEER_NICHT_ANWENDBAR),
  payload: T("Zusatzangaben des Ereignisses als JSON", "Ereignis", "JSON", "je nach Ereignistyp, siehe SPEZIFIKATION.md [11]", "je nach Ereignistyp", "dieser Ereignistyp führt keine Zusatzangaben"),
};

// ---------------------------------------------------------------------------
// Zusammensetzen, in genau der Reihenfolge des Exports
// ---------------------------------------------------------------------------

const FRAGE_EINTRAEGE = new Map<string, Eintrag>(
  [...vorbefragung, ...nachbefragungSortiert].map((e) => [e.spalte, e])
);

const fehlendeBeschreibungen: string[] = [];

function eintragFuer(spalte: string): Eintrag {
  const frage = FRAGE_EINTRAEGE.get(spalte);
  if (frage) return frage;
  const technisch = TECHNISCHE_SPALTEN[spalte];
  if (technisch) return { spalte, ...technisch };
  fehlendeBeschreibungen.push(spalte);
  return {
    spalte,
    fragetext: "**FEHLT – bitte in scripts/codebuch-erzeugen.ts ergänzen**",
    block: "?",
    format: "?",
    wertebereich: "?",
    bedingung: "?",
    leer: "?",
  };
}

const dateien = [
  {
    name: "participants.csv",
    beschreibung:
      "Eine Zeile je Sitzung, in der Praxis je teilnehmende Person. Vor- und Nachbefragung stehen nebeneinander.",
    spalten: PARTICIPANTS_COLUMNS,
  },
  {
    name: "cycles.csv",
    beschreibung:
      "Eine Zeile je Runde. Hier stehen die Kernkennzahlen der Arbeit: bei welcher Stufe reagiert wurde, wie lange Pausen tatsächlich dauerten, wie die Rundenlänge angepasst wurde.",
    spalten: CYCLES_COLUMNS,
  },
  {
    name: "events.csv",
    beschreibung:
      "Eine Zeile je Ereignis, der vollständige Rohlog. Für alles, was die beiden anderen Dateien nicht abdecken.",
    spalten: EVENTS_COLUMNS,
  },
];

// ---------------------------------------------------------------------------
// Markdown erzeugen
// ---------------------------------------------------------------------------

const heute = new Date().toISOString().slice(0, 10);

const abschnitte = dateien.map((datei) => {
  const eintraege = datei.spalten.map(eintragFuer);
  return `## ${datei.name}\n\n${datei.beschreibung}\n\n${tabelle(eintraege)}`;
});

const persuasivenessIds = postSurveyPersuasivenessItems.map((i) => i.id);
const intrusivenessIds = postSurveyIntrusivenessItems.map((i) => i.id);

const inhalt = `# Codebuch

Datenwörterbuch zu den drei Exportdateien von FocusArchitect. Erklärt jede Spalte:
Wortlaut der Frage, wo sie gestellt wird, welches Format und welcher Wertebereich gelten,
unter welcher Bedingung sie überhaupt erscheint und was eine leere Zelle bedeutet.

> **Diese Datei wird erzeugt, nicht von Hand geschrieben.** Sie entsteht aus den
> Fragedefinitionen in \`src/content/\` und der Spaltenliste in \`src/lib/exportColumns.ts\` –
> also aus derselben Quelle, aus der auch der Export selbst gebaut wird. Damit kann sie nicht
> von der Anwendung abweichen. Änderungen am Wortlaut gehören in die Inhaltsdateien, danach:
>
> \`\`\`
> npm run codebuch
> \`\`\`
>
> Zuletzt erzeugt am ${heute}.

## Was eine leere Zelle bedeutet

Eine leere Zelle ist nicht immer dasselbe. Es gibt genau drei Fälle, und die Spalte
„Leere Zelle bedeutet“ nennt für jede Spalte den zutreffenden:

| Fall | Bedeutung |
|---|---|
| **${LEER_NICHT_GEZEIGT}** | Die Frage wurde aufgrund einer Bedingung gar nicht angezeigt. Es fehlt keine Antwort – die Frage gab es für diese Person nicht. |
| **${LEER_NICHT_BEANTWORTET}** | Die Frage wurde angezeigt, war freiwillig und blieb leer. |
| **${LEER_NICHT_ANWENDBAR}** | Die Kennzahl ist für diese Zeile nicht definiert, etwa die Reaktionslatenz bei durchgehend sichtbarem Tab. |

Für Pflichtfelder ist eine leere Zelle immer ein Hinweis auf ein Problem, nicht auf eine
Enthaltung – sie können ohne Antwort nicht abgeschickt werden.

## Die beiden Skalen der Nachbefragung

| Skala | Spalten | Anzahl | Auswertung |
|---|---|---|---|
| Wahrgenommene Überzeugungskraft (Persuasiveness) | ${persuasivenessIds.map((id) => `\`${id}\``).join(", ")} | ${persuasivenessIds.length} | Mittelwert je Person über alle ${persuasivenessIds.length} Aussagen |
| Wahrgenommene Aufdringlichkeit (Intrusiveness) | ${intrusivenessIds.map((id) => `\`${id}\``).join(", ")} | ${intrusivenessIds.length} | Mittelwert je Person über alle ${intrusivenessIds.length} Aussagen |

Beide Skalen sind siebenstufig (1 = „${likertScaleLabels[0]}“ bis 7 = „${likertScaleLabels[6]}“)
und wortgleich aus der Vorlage übernommen, einschließlich des Tippfehlers in N4
(„diesem Assistenzsystems“) – bei validierten Skalen wird der Wortlaut nicht korrigiert.

**Herkunft der Skalen.** Die neun Aussagen zur Überzeugungskraft (\`N3\` bis \`N11\`) stammen aus der
Perceived Persuasiveness Scale von Thomas, Masthoff und Oren (2019), veröffentlicht in
*Frontiers in Artificial Intelligence* unter dem Titel „Can I Influence You? Development of a
Scale to Measure Perceived Persuasiveness and Two Studies Showing the Use of the Scale“. Die
Skala besteht aus drei Unterskalen mit je drei Aussagen: Effectiveness, Quality und Capability.
Verwendet wird die deutsche Übersetzung aus Jung-Krenzer et al. (2024), in der der
Bezugsgegenstand von „message“ auf „Assistenzsystem“ angepasst wurde.

Die vier Aussagen zur Aufdringlichkeit (\`N12\` bis \`N15\`) wurden von Jung-Krenzer et al. (2024)
selbst entwickelt, da kein etabliertes Instrument vorlag.

Über alle Personen hinweg werden Mittelwert, Standardabweichung, Minimum und Maximum beider
Skalen berichtet.

${abschnitte.join("\n\n")}

## Hinweise für die Auswertung

Diese Punkte betreffen nicht einzelne Spalten, sondern den Umgang mit den Dateien insgesamt.

- **Sortierung:** Die Zeilen in \`events.csv\` stehen nicht in zeitlicher Reihenfolge, weil
  Ereignisse in Stapeln eintreffen. Immer nach \`clientAt\` sortieren – nie nach der
  Zeilenreihenfolge und nie nach \`at\`.
- **Ausschluss:** Die Zugänge \`PILOT\` und \`ADMIN\` vor jeder Auswertung herausfiltern.
- **Blindklicken:** Personen mit auffällig kurzer Bearbeitungszeit auf Seite 2 der
  Nachbefragung markieren, Richtwert unter 20 Sekunden für 13 Aussagen
  (\`postPage2Seconds\`). Im Ergebnisteil offenlegen, ob und wie viele Datensätze betroffen
  waren.
- **Kurzfeedback getrennt auswerten:** \`timing\` nach \`reactionType\` trennen. „Zu früh“ nach
  einem Systemhinweis bedeutet etwas anderes als „zu früh“ nach einer selbst gestarteten Pause.
- **Wunsch und Wirkung trennen:** \`adjustmentMin\` ist der Wunsch, \`effectiveAdjustmentMin\`
  die tatsächliche Änderung. Sie weichen voneinander ab, sobald die Untergrenze von 5 Minuten
  greift.
- **Stufe 0 und selbst gestartete Pausen:** Selbst gestartete Pausen, die in die letzten zwei
  Minuten vor Rundenende fallen, liegen im Zeitfenster von Stufe 0. Eine Häufung dort wäre ein
  Hinweis darauf, dass der Farbverlauf wahrgenommen wurde.
- **Unvollständige Runden ausschließen:** Bei Zählungen zu Pausenannahme und Intervallanpassung nur
  Runden mit \`cycleCompleted = true\` einbeziehen. Die Spalte ist \`true\`, sobald die nächste Runde begonnen
  hat – also sowohl bei genommener als auch bei übersprungener Pause – und \`false\` genau für die
  abgebrochene letzte Runde. Wo genau abgebrochen wurde, steht im Ereignis \`SESSION_ENDED\`: seine
  Rundennummer und im Payload die Phase (\`work\`, \`nudge\`, \`feedback\`, \`activity\`, \`break\`).
- **\`ACTIVITY_TICK\` gewichten:** Diese Ereignisse machen etwa zwei Drittel aller Zeilen in
  \`events.csv\` aus, erfassen aber nur Aktivität innerhalb des Anwendungsfensters, nicht die
  eigentliche Arbeitsaktivität. In der Auswertung als Nebeninformation behandeln.
`;

// ---------------------------------------------------------------------------
// Schreiben, aber nur wenn alles stimmt
// ---------------------------------------------------------------------------

const spaltenProblem = pruefeSpaltenlisten();
if (spaltenProblem) {
  console.error(`FEHLER: ${spaltenProblem}`);
  process.exit(1);
}

if (fehlendeBeschreibungen.length > 0) {
  console.error(
    `FEHLER: Für diese Exportspalten fehlt eine Beschreibung: ${fehlendeBeschreibungen.join(", ")}`
  );
  console.error("Ergänze sie in TECHNISCHE_SPALTEN in scripts/codebuch-erzeugen.ts.");
  process.exit(1);
}

const ziel = path.join(process.cwd(), "docs", "CODEBUCH.md");
writeFileSync(ziel, inhalt, "utf-8");

const anzahl = dateien.reduce((summe, d) => summe + d.spalten.length, 0);
console.log(`docs/CODEBUCH.md geschrieben: ${dateien.length} Dateien, ${anzahl} Spalten beschrieben.`);
