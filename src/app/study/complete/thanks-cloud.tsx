import type { CSSProperties } from "react";
import { Cairo } from "next/font/google";
import { closingThanks } from "@/content/closing";

// Geist hat keine arabischen Zeichen, شكراً wuerde sonst in irgendeiner
// Ersatzschrift landen. Cairo nur fuer dieses eine Wort.
const cairo = Cairo({ subsets: ["arabic"], weight: "700", display: "swap" });

// Positionen in Prozent der Seite, jeweils der Mittelpunkt des Wortes.
// xs/ys: bis 1024px Breite liegen die Woerter nur ueber und unter der Karte,
//        dort ist links und rechts kein Platz, bei einem Drittel
//        Bildschirmbreite (640px) wuerden sie sonst in die Karte ragen.
// xl/yl: ab 1024px verteilen sie sich frei um die Karte herum.
// Farben aus der App: Terrakotta, Arbeitsblau, Pausengruen, Bernstein.
const LAYOUT = [
  { xs: "22%", ys: "8%",  xl: "21%", yl: "19%", r: "-6deg", color: "#c2703d", float: "6.2s" },
  { xs: "70%", ys: "14%", xl: "77%", yl: "15%", r: "5deg",  color: "#5a78a0", float: "7s" },
  { xs: "30%", ys: "20%", xl: "85%", yl: "50%", r: "-3deg", color: "#6f8c5b", float: "5.6s" },
  { xs: "28%", ys: "88%", xl: "14%", yl: "55%", r: "4deg",  color: "#b07a2a", float: "6.6s" },
  { xs: "70%", ys: "93%", xl: "73%", yl: "84%", r: "-5deg", color: "#c9794f", float: "7.4s" },
];

// Das Konfetti knallt nach dem Laden bei 0, 1, 2, 3 und 4 Sekunden. Jedes
// Wort landet mit seiner Explosion, der kleine Vorlauf gleicht aus, dass
// das Konfetti erst nach dem Hydrieren startet, das CSS hier schon beim
// ersten Zeichnen.
const FIRST_DELAY_MS = 200;
const STEP_MS = 1000;

/**
 * "Danke" in fuenf Sprachen rund um die Abschlusskarte (19.09.). Jedes Wort
 * fliegt mit einer Konfetti-Explosion ein, federt kurz nach und schwebt dann
 * ruhig weiter, jedes in seinem eigenen Takt, damit es lebendig wirkt statt
 * im Gleichschritt.
 *
 * Rein dekorativ und fuer Screenreader ausgeblendet, der eigentliche Dank
 * steht in der Karte. Wie das Konfetti bewusst auch bei eingestellter
 * reduzierter Bewegung aktiv (siehe celebration.tsx): kurz, ohne Flackern,
 * und erst nachdem alles gespeichert ist.
 */
export function ThanksCloud() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      {closingThanks.map((word, i) => {
        const place = LAYOUT[i];
        const delay = FIRST_DELAY_MS + i * STEP_MS;
        const style = {
          "--xs": place.xs,
          "--ys": place.ys,
          "--xl": place.xl,
          "--yl": place.yl,
          "--r": place.r,
          "--delay": `${delay}ms`,
          "--float": place.float,
          color: place.color,
        } as CSSProperties;

        return (
          <span
            key={word.lang}
            style={style}
            className="thanks-word absolute left-[var(--xs)] top-[var(--ys)] whitespace-nowrap text-xl font-semibold tracking-tight sm:text-2xl lg:left-[var(--xl)] lg:top-[var(--yl)] lg:text-3xl"
          >
            <span className="thanks-float inline-block">
              <span
                lang={word.lang}
                dir={word.dir}
                className={word.lang === "ar" ? `${cairo.className} text-[1.1em]` : undefined}
              >
                {word.text}
              </span>
            </span>
          </span>
        );
      })}
    </div>
  );
}
