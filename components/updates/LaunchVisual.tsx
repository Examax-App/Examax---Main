import { BadgePercent, Check, PencilLine, Route, Sparkles, Timer, Zap } from "lucide-react";
import { BrandMark } from "@/components/ui/BrandMark";
import { AccentTile, type Accent } from "@/components/ui/FeaturePill";
import { cn } from "@/lib/cn";
import type { IconComponent } from "@/lib/icon";

/*
 * The launch post's picture, built the way dub's changelog images are: a
 * 16:9 board, a faint grid, soft pastel light in two corners, and the
 * product's own UI laid on it in white cards. It is drawn at 1280 × 720 and
 * scaled to its frame through an SVG viewBox, so it reads as one picture at
 * every width — as dub's (raster) images do.
 *
 *   left   the app's welcome: the five parts of Examax, each coming soon
 *   right  the preview card: the thanks, and what is open so far
 */

const W = 1280;
const H = 720;

const PARTS: Array<{ label: string; icon: IconComponent; accent: Accent }> = [
  { label: "Trening", icon: PencilLine, accent: "green" },
  { label: "Roadmapa", icon: Route, accent: "blue" },
  { label: "Postępy", icon: BadgePercent, accent: "tangerine" },
  { label: "Symulacja egzaminu", icon: Timer, accent: "lavender" },
  { label: "Korepetytor AI", icon: Zap, accent: "yellow" },
];

const STEPS = [
  { label: "Podgląd logowania", done: true },
  { label: "Zakładanie kont", done: false },
  { label: "Cała platforma", done: false },
];

const CARD = "absolute rounded-[20px] border border-ash bg-white shadow-[0_24px_48px_-12px_rgba(0,0,0,0.12),0_2px_6px_rgba(0,0,0,0.04)]";

function Board() {
  return (
    <div className="relative overflow-hidden bg-white font-inter text-charcoal antialiased" style={{ width: W, height: H }}>
      {/* Grid, fading towards the middle; pastel light in two corners */}
      <div className="absolute inset-0 opacity-80 [background-image:linear-gradient(to_right,#ededed_1px,transparent_1px),linear-gradient(to_bottom,#ededed_1px,transparent_1px)] [background-size:96px_96px]" />
      <div className="absolute -right-40 -top-48 size-[620px] rounded-full bg-[#fbcfe8] opacity-50 blur-[110px]" />
      <div className="absolute -bottom-56 -left-40 size-[620px] rounded-full bg-[#bbf7d0] opacity-50 blur-[110px]" />
      <div className="absolute right-40 top-1/2 size-[420px] -translate-y-1/2 rounded-full bg-[#ddd6fe] opacity-40 blur-[110px]" />

      {/* The app's welcome */}
      <div className={CARD} style={{ left: 130, top: 104, width: 520 }}>
        <div className="flex items-center gap-4 border-b border-ash px-7 py-6">
          <span className="grid size-[52px] place-items-center rounded-full bg-charcoal">
            <BrandMark className="h-[22px] text-white" />
          </span>
          <div>
            <p className="text-[26px] font-semibold leading-8">Witaj w Examaxie</p>
            <p className="text-[19px] leading-7 text-fog">Platforma startuje wkrótce</p>
          </div>
        </div>
        <ul className="divide-y divide-ash px-7 py-2">
          {PARTS.map((part) => (
            <li key={part.label} className="flex h-[66px] items-center gap-4">
              <AccentTile icon={part.icon} accent={part.accent} size="lg" className="!size-[34px]" />
              <span className="flex-1 text-[21px] font-medium">{part.label}</span>
              <span className="inline-flex items-center gap-1.5 rounded-[8px] bg-[#eff6ff] px-2.5 py-1 text-[16px] font-medium text-[#1d63d8]">
                <span className="size-[9px] rounded-full border-2 border-[#3b82f6]" />
                Wkrótce
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Early access */}
      <div className={CARD} style={{ left: 706, top: 200, width: 450 }}>
        <div className="px-7 pb-6 pt-7">
          <span className="inline-flex items-center gap-2 rounded-[8px] border border-ash bg-canvas-muted px-3 py-1.5 text-[16px] font-medium text-steel">
            <Sparkles className="size-[17px] text-[#ca8a04]" strokeWidth={2} />
            Podgląd
          </span>
          <p className="mt-5 text-[24px] font-semibold leading-8">Dziękujemy, że jesteś z nami od początku.</p>
        </div>
        <ul className="space-y-3 border-t border-ash px-7 py-6">
          {STEPS.map((step) => (
            <li key={step.label} className="flex items-center gap-3 text-[19px]">
              <span
                className={cn(
                  "grid size-[26px] place-items-center rounded-full border-2",
                  step.done ? "border-charcoal bg-charcoal text-white" : "border-smoke text-transparent",
                )}
              >
                <Check className="size-[14px]" strokeWidth={3} />
              </span>
              <span className={step.done ? "text-charcoal" : "text-fog"}>{step.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function LaunchVisual() {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="block size-full" role="img" aria-label="Podgląd Examaxu: pięć części aplikacji oznaczonych jako wkrótce i karta podglądu z podziękowaniem">
      <foreignObject width={W} height={H}>
        <Board />
      </foreignObject>
    </svg>
  );
}
