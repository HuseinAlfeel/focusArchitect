"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const RATE = 0.9;

/**
 * Grobe Qualitaetsheuristik fuer die Stimmauswahl: manche vom Browser
 * angebotenen Stimmen ("Online"/"Natural"/"Google" im Namen, oft
 * Netzwerk-Stimmen statt lokal auf dem Betriebssystem installierter
 * SAPI-Stimmen) klingen deutlich natuerlicher als der Durchschnitt. Wir
 * koennen die eigentliche Sprachqualitaet nicht beeinflussen - die liefert
 * Browser/Betriebssystem -, nur unter den verfuegbaren Stimmen die
 * vermutlich beste waehlen. -1 heisst: keine deutsche Stimme, kommt nicht
 * in Frage.
 */
function scoreVoice(voice: SpeechSynthesisVoice): number {
  const lang = voice.lang.toLowerCase();
  if (lang !== "de-de" && !lang.startsWith("de")) return -1;

  let score = lang === "de-de" ? 10 : 5;
  const name = voice.name.toLowerCase();
  if (/natural|online|neural/.test(name)) score += 6;
  else if (/google/.test(name)) score += 4;
  if (!voice.localService) score += 2;
  if (voice.default) score += 1;
  return score;
}

function pickBestGermanVoice(
  voices: SpeechSynthesisVoice[]
): SpeechSynthesisVoice | null {
  let best: SpeechSynthesisVoice | null = null;
  let bestScore = -1;
  for (const voice of voices) {
    const score = scoreVoice(voice);
    if (score > bestScore) {
      bestScore = score;
      best = voice;
    }
  }
  return best;
}

/**
 * Duenner Wrapper um die Web Speech API (speechSynthesis) - keine externe
 * Bibliothek, kein Dienst. Nur fuer die Pausenanleitungen gedacht (siehe
 * ENTSCHEIDUNGEN.md), nicht fuer Arbeitsphase oder Pausenhinweis.
 */
export function useSpeech() {
  const [isSupported] = useState(
    () => typeof window !== "undefined" && "speechSynthesis" in window
  );
  // Erst wenn dies true ist, ist die Stimmauswahl verlaesslich - vorher
  // liefert getVoices() oft eine leere Liste, siehe Kommentar unten.
  const [voicesReady, setVoicesReady] = useState(false);
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    if (!isSupported) return;

    function loadVoices() {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length === 0) return;
      voiceRef.current = pickBestGermanVoice(voices);
      setVoicesReady(true);
    }
    loadVoices();
    // Chrome laedt Stimmen asynchron nach - beim ersten Aufruf direkt nach
    // dem Laden der Seite liefert getVoices() dort oft noch eine leere
    // Liste. Ohne dieses Warten wurde genau deshalb der allererste Satz mit
    // der Browser-Standardstimme gesprochen (oft eine andere, schlechter
    // klingende als die spaeter korrekt gewaehlte) - Husin ist genau das an
    // der Augenentlastung aufgefallen: erster Schritt klang anders/
    // roboterhafter als der zweite und dritte.
    window.speechSynthesis.addEventListener("voiceschanged", loadVoices);
    // Fallback: manche Browser/Systeme liefern die Liste synchron und
    // feuern "voiceschanged" nie - nach kurzer Wartezeit trotzdem
    // freigeben, damit die Anleitung nicht stumm bleibt.
    const timeoutId = window.setTimeout(() => setVoicesReady(true), 300);
    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
      window.clearTimeout(timeoutId);
    };
  }, [isSupported]);

  const speak = useCallback(
    (text: string) => {
      if (!isSupported) return;
      // Cancel zuerst, nicht nur beim Schrittwechsel von aussen erwartet -
      // verhindert ueberlappende Ausgabe, falls speak() zweimal kurz
      // hintereinander aufgerufen wird.
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "de-DE";
      utterance.rate = RATE;
      if (voiceRef.current) utterance.voice = voiceRef.current;
      window.speechSynthesis.speak(utterance);
    },
    [isSupported]
  );

  const cancel = useCallback(() => {
    if (!isSupported) return;
    window.speechSynthesis.cancel();
  }, [isSupported]);

  return { isSupported, voicesReady, speak, cancel };
}
