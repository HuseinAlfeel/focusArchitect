// CSV-Erzeugung fuer den Admin-Export (PHASE H). Deutsches Excel erwartet
// Semikolon als Trennzeichen und eine UTF-8-BOM am Anfang - ohne die BOM
// interpretiert Excel Umlaute falsch oder zerlegt die Datei nicht richtig
// in Spalten.

const BOM = "﻿";

function escapeCsvValue(value: unknown): string {
  if (value === null || value === undefined) return "";

  let text: string;
  if (value instanceof Date) {
    text = value.toISOString();
  } else if (typeof value === "object") {
    text = JSON.stringify(value);
  } else {
    text = String(value);
  }

  if (/[;"\r\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

export function toCsv(columns: string[], rows: Record<string, unknown>[]): string {
  const lines = [columns.join(";")];
  for (const row of rows) {
    lines.push(columns.map((column) => escapeCsvValue(row[column])).join(";"));
  }
  return BOM + lines.join("\r\n") + "\r\n";
}
