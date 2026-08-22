"use client";

import { useEffect, useState } from "react";
import { Bot, Check, Paperclip, Send, Sparkles, X } from "lucide-react";
import { PlayDemoButton } from "@/components/ui/PlayDemoButton";
import { useInView, useReducedMotion } from "@/lib/hooks";
import { cn } from "@/lib/cn";

const agentSteps = [
  <>
    Zacznijmy od tego, co znaczy 15%. To po prostu{" "}
    <span className="font-geist-mono text-charcoal">15/100</span>, czyli{" "}
    <span className="font-geist-mono text-charcoal">0,15</span>.
  </>,
  <>
    Teraz mnożymy:{" "}
    <span className="font-geist-mono text-charcoal">0,15 × 240 = 36</span>. I to
    jest cały trik — procent zawsze zamieniamy najpierw na ułamek.
  </>,
  <>
    Twoja odpowiedź 24 to <span className="font-geist-mono text-charcoal">10%</span>{" "}
    z 240 — najczęstsza pomyłka przy szybkim liczeniu. Zrobimy jeszcze dwa
    podobne, żeby weszło w nawyk?
  </>,
];

const suggestions = ["Pokaż podobne zadanie", "Wytłumacz inaczej", "Dodaj do powtórek"];

/**
 * Agent showcase — a browser-framed conversation that plays out step by
 * step (typing indicator, explanation arriving in stages, suggestion chips),
 * with a floating context card showing the exercise being explained.
 */
export function AgentShowcase() {
  const { ref, inView } = useInView<HTMLDivElement>(0.3);
  const reducedMotion = useReducedMotion();
  const [step, setStep] = useState(0);
  const [playKey, setPlayKey] = useState(0);

  // 0 typing → 1..3 explanation steps → 4 chips → hold → loop.
  useEffect(() => {
    if (!inView || reducedMotion) return;
    const timer = window.setInterval(() => {
      setStep((current) => (current >= agentSteps.length + 2 ? 0 : current + 1));
    }, 1500);
    return () => window.clearInterval(timer);
  }, [inView, reducedMotion, playKey]);

  const shownSteps = reducedMotion
    ? agentSteps.length
    : Math.min(step, agentSteps.length);
  const typing = !reducedMotion && step < agentSteps.length;
  const chipsVisible = reducedMotion || step > agentSteps.length;

  const replay = () => {
    setStep(0);
    setPlayKey((key) => key + 1);
  };

  return (
    <div ref={ref} className="relative mx-auto max-w-3xl lg:pr-40">
      <PlayDemoButton onClick={replay} />

      <div
        role="img"
        aria-label="Podgląd rozmowy z Agentem Examax: wyjaśnienie zadania z procentów krok po kroku, obok karta z zadaniem i zaznaczonym błędem"
      >
        {/* Browser frame */}
        <div
          key={`frame-${playKey}`}
          className="animate-view-swap overflow-hidden rounded-largecards border border-ash bg-white shadow-ring"
        >
          <div className="flex items-center gap-3 border-b border-ash px-4 py-2.5">
            <span className="flex gap-1.5" aria-hidden>
              <span className="size-2.5 rounded-full bg-[#f87171]" />
              <span className="size-2.5 rounded-full bg-[#fde047]" />
              <span className="size-2.5 rounded-full bg-[#86efac]" />
            </span>
            <span className="mx-auto rounded-inputs bg-paper-mist px-8 py-1 text-[12px] text-fog">
              examax.app/agent
            </span>
          </div>

          <div className="p-6 sm:p-8 lg:pr-44">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="flex items-center gap-2.5 text-body font-semibold text-charcoal">
                <span className="grid size-7 place-items-center rounded-full bg-electric-blue text-white">
                  <Bot className="size-4" aria-hidden />
                </span>
                Agent Examax
              </p>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-sidebar-active px-3 py-1.5 text-[12px] font-medium leading-none text-deep-sapphire">
                <Sparkles className="size-3.5" aria-hidden />
                Widzi Twoje odpowiedzi
              </span>
            </div>

            {/* Conversation */}
            <div className="mt-5 min-h-[380px] space-y-3 sm:min-h-[300px]">
              <div className="ml-auto w-fit max-w-[85%] rounded-cards rounded-br-[4px] bg-midnight-ink px-4 py-2.5 text-body text-white">
                Dlaczego wynik to 36, a nie 24?
              </div>

              {agentSteps.slice(0, shownSteps).map((content, index) => (
                <div
                  key={`${playKey}-${index}`}
                  className="animate-view-swap flex max-w-[92%] items-start gap-2.5"
                >
                  <span
                    className={cn(
                      "grid size-6 shrink-0 place-items-center rounded-full bg-electric-blue text-white",
                      index > 0 && "invisible",
                    )}
                    aria-hidden
                  >
                    <Bot className="size-3.5" />
                  </span>
                  <p className="rounded-cards rounded-tl-[4px] border border-ash bg-white px-4 py-2.5 text-body leading-relaxed text-slate shadow-subtle">
                    {content}
                  </p>
                </div>
              ))}

              {typing ? (
                <div className="flex max-w-[92%] items-start gap-2.5">
                  <span
                    className={cn(
                      "grid size-6 shrink-0 place-items-center rounded-full bg-electric-blue text-white",
                      shownSteps > 0 && "invisible",
                    )}
                    aria-hidden
                  >
                    <Bot className="size-3.5" />
                  </span>
                  <span className="flex items-center gap-1 rounded-cards rounded-tl-[4px] border border-ash bg-white px-4 py-3 shadow-subtle">
                    {[0, 1, 2].map((dot) => (
                      <span
                        key={dot}
                        className="size-1.5 animate-pulse rounded-full bg-silver"
                        style={{ animationDelay: `${dot * 200}ms` }}
                        aria-hidden
                      />
                    ))}
                  </span>
                </div>
              ) : null}
            </div>

            {/* Suggestion chips */}
            <div
              className={cn(
                "mt-4 flex flex-wrap gap-2 transition-opacity duration-500",
                chipsVisible ? "opacity-100" : "opacity-0",
              )}
            >
              {suggestions.map((chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-ash bg-white px-3 py-1.5 text-[12px] font-medium text-charcoal shadow-subtle"
                >
                  {chip}
                </span>
              ))}
            </div>

            {/* Composer */}
            <div className="mt-4 flex h-11 items-center gap-3 rounded-inputs border border-midnight-ink px-3.5 text-body text-fog">
              <Paperclip className="size-4" aria-hidden />
              Zapytaj o to zadanie…
              <span className="ml-auto grid size-7 place-items-center rounded-buttons bg-midnight-ink text-white">
                <Send className="size-3.5" aria-hidden />
              </span>
            </div>
          </div>
        </div>

        {/* Floating context card — the exercise the agent is explaining */}
        <div
          key={`panel-${playKey}`}
          className="animate-view-swap mt-6 lg:absolute lg:-right-2 lg:top-1/2 lg:mt-0 lg:w-80 lg:-translate-y-1/2"
          style={{ animationDelay: "120ms" }}
        >
          <div className="rounded-largecards border border-ash bg-white p-5 shadow-md transition-shadow duration-200 hover:shadow-lg">
            <div className="flex items-center justify-between">
              <p className="text-body-lg font-semibold text-charcoal">Kontekst</p>
              <span className="rounded-full bg-paper-mist px-2.5 py-1 text-[11px] font-medium text-steel">
                Zadanie 7 · Procenty
              </span>
            </div>

            <p className="mt-4 text-body font-medium text-charcoal">
              Ile wynosi 15% liczby 240?
            </p>

            <ul className="mt-3 space-y-2 text-[13px]">
              <li className="flex items-center gap-2.5 rounded-buttons border border-[#fca5a5] bg-[#fef2f2] px-3 py-2 text-[#991b1b]">
                <span
                  className="grid size-5 shrink-0 place-items-center rounded-full bg-[#dc2626] text-white"
                  aria-hidden
                >
                  <X className="size-3" />
                </span>
                24
                <span className="ml-auto text-[11px] font-medium">
                  Twoja odpowiedź
                </span>
              </li>
              <li className="flex items-center gap-2.5 rounded-buttons border border-vivid-green bg-soft-mint px-3 py-2 font-medium text-[#166534]">
                <span
                  className="grid size-5 shrink-0 place-items-center rounded-full bg-vivid-green text-white"
                  aria-hidden
                >
                  <Check className="size-3" />
                </span>
                36
                <span className="ml-auto text-[11px] font-medium">Poprawna</span>
              </li>
            </ul>

            <div className="mt-4 rounded-cards bg-paper-mist p-3.5 text-[12px] leading-relaxed text-steel">
              Agent zna to zadanie, Twoją odpowiedź i Twoje wcześniejsze błędy
              z procentów — dlatego tłumaczy dokładnie to, czego potrzebujesz.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
