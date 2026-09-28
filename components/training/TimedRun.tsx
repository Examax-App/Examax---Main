"use client";

import { useEffect, useState } from "react";
import { AlarmClock, Flag, ListChecks } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";
import { useInView, useReducedMotion } from "@/lib/hooks";
import { SECTION_H2 } from "@/lib/type";

type TaskState = "done" | "flagged" | "current" | "todo";

/* PLACEHOLDER RUN — a 19-task arkusz: eleven answered, two answered and
   flagged for a second look, task 14 open, five to go. The summary below
   counts off this array, so the two stay in step. */
const run: TaskState[] = [
  "done", "done", "done", "done", "flagged", "done", "done", "done", "done",
  "done", "flagged", "done", "done", "current", "todo", "todo", "todo", "todo",
  "todo",
];

const legend: Array<{ state: TaskState; label: string }> = [
  { state: "done", label: "Rozwiązane" },
  { state: "flagged", label: "Oflagowane" },
  { state: "todo", label: "Do zrobienia" },
];

const chipStyles: Record<TaskState, string> = {
  done: "border-charcoal bg-charcoal text-white",
  flagged: "border-tangerine bg-soft-peach text-[#7c2d12]",
  current: "border-vivid-green bg-white text-charcoal ring-2 ring-vivid-green/25",
  todo: "border-ash bg-white text-fog",
};

const START_SECONDS = 45 * 60;

function formatClock(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

/** The task navigator — the reference's product panel, in Examax's terms. */
function Navigator() {
  return (
    <div className="p-5 sm:p-6">
      <div className="flex items-center gap-2">
        <ListChecks className="size-4 text-steel" strokeWidth={1.8} />
        <p className="text-[13px] font-semibold text-charcoal">
          Nawigator zadań
        </p>
      </div>

      <ul className="mt-4 grid grid-cols-7 gap-2 sm:grid-cols-10">
        {run.map((state, index) => (
          <li key={index}>
            {/* Every chip keeps its number: the navigator is how a student
                finds task 14 again, so the number is the content and colour
                is the state. */}
            <span
              className={cn(
                "grid h-8 w-full place-items-center rounded-buttons border font-geist-mono text-[11px] tabular-nums transition-colors duration-200",
                chipStyles[state],
              )}
            >
              {index + 1}
            </span>
          </li>
        ))}
      </ul>

      <ul className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
        {legend.map((item) => (
          <li key={item.label} className="flex items-center gap-2 text-[11px] text-fog">
            <span
              className={cn(
                "size-3 rounded-[3px] border",
                chipStyles[item.state],
              )}
            />
            {item.label}
          </li>
        ))}
      </ul>

      {/* The one ringed chip needs a caption, or the ring is decoration. This
          also fills the column: the summary beside it is the taller of the
          two, and a half-empty navigator would read as a layout accident. */}
      <div className="mt-5 flex items-center gap-3 rounded-cards border border-ash bg-canvas-muted px-3 py-2.5">
        <span className="grid size-7 shrink-0 place-items-center rounded-buttons border border-vivid-green bg-white font-geist-mono text-[11px] text-charcoal tabular-nums">
          14
        </span>
        <span className="min-w-0">
          <span className="block truncate text-[12px] font-medium text-charcoal">
            Procenty · zadanie otwarte
          </span>
          <span className="block text-[11px] text-fog">
            Teraz rozwiązujesz
          </span>
        </span>
        <span className="ml-auto shrink-0 rounded-full border border-ash bg-white px-2 py-0.5 font-geist-mono text-[10px] text-steel">
          0–2 pkt
        </span>
      </div>
    </div>
  );
}

/** The run summary that closes the panel. */
function Summary() {
  return (
    <div className="border-t border-ash p-5 sm:p-6 lg:border-l lg:border-t-0">
      <p className="text-[13px] font-semibold text-charcoal">Postęp serii</p>

      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-paper-mist">
        <span className="block h-full w-[68%] rounded-full bg-vivid-green" />
      </div>

      <dl className="mt-4 space-y-2.5">
        {[
          { label: "Rozwiązane", value: "13 / 19" },
          { label: "Oflagowane", value: "2" },
          { label: "Średni czas", value: "1:12" },
        ].map((row) => (
          <div key={row.label} className="flex items-center justify-between">
            <dt className="text-[12px] text-fog">{row.label}</dt>
            <dd className="font-geist-mono text-[12px] font-medium text-charcoal tabular-nums">
              {row.value}
            </dd>
          </div>
        ))}
      </dl>

      <span className="mt-5 block rounded-buttons bg-midnight-ink py-2.5 text-center text-body font-medium text-white">
        Zakończ i sprawdź
      </span>
      <p className="mt-3 text-[11px] leading-snug text-fog">
        Po zakończeniu dostajesz punktację według zasad CKE i listę tematów do
        powtórki.
      </p>
    </div>
  );
}

const perks = [
  { icon: ListChecks, label: "Nawigator zadań" },
  { icon: Flag, label: "Flagowanie na później" },
  { icon: AlarmClock, label: "Raport po ostatnim kliknięciu" },
];

/**
 * The page's one moving visual: a timed arkusz run with a live clock.
 *
 * The clock is the whole point of the section, so it actually runs — gated on
 * `useInView` so it costs nothing while scrolled away, and on
 * `prefers-reduced-motion` so it holds still for anyone who asked for that.
 * Everything else on /training is static and server-rendered.
 */
export function TimedRun() {
  const { ref, inView } = useInView<HTMLDivElement>(0.25);
  const reducedMotion = useReducedMotion();
  const [seconds, setSeconds] = useState(START_SECONDS);

  useEffect(() => {
    if (!inView || reducedMotion) return;
    const timer = window.setInterval(() => {
      setSeconds((current) =>
        current <= 40 * 60 ? START_SECONDS : current - 1,
      );
    }, 1000);
    return () => window.clearInterval(timer);
  }, [inView, reducedMotion]);

  return (
    <section
      id="timed"
      aria-labelledby="timed-heading"
      className="border-t border-ash bg-white"
    >
      <div className="col-rules">
        <Container className="py-20 text-center">
          <Reveal>
            <h2 id="timed-heading" className={cn("mx-auto max-w-2xl text-charcoal", SECTION_H2)}>
              Trenuj z zegarem, nie ze stoperem w telefonie
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-pretty text-body-xl text-fog">
              Włącz limit czasu i rozwiąż serię tak, jak na sali — z
              nawigatorem zadań i flagowaniem.
            </p>
            <Button href="/signup" variant="outline" size="lg" className="mt-8">
              Wypróbuj tryb na czas
            </Button>
          </Reveal>
        </Container>
      </div>

      <div className="col-rules border-t border-ash bg-canvas-muted">
        <div className="mx-auto w-full max-w-[var(--page-max-width)] px-5 py-14 sm:px-10">
          <Reveal>
            <div
              ref={ref}
              role="img"
              aria-label="Podgląd trybu na czas: nawigator dziewiętnastu zadań, dwa oflagowane, zegar odliczający do końca serii"
              className="mx-auto max-w-4xl overflow-hidden rounded-largecards border border-ash bg-white [box-shadow:var(--shadow-ring),var(--shadow-lg)]"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ash px-5 py-3.5 sm:px-6">
                <p className="text-body font-semibold text-charcoal">
                  Matematyka · Arkusz CKE 2024
                </p>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-ash px-3 py-1.5 text-[12px] font-medium text-charcoal">
                  <AlarmClock className="size-3.5 text-vivid-green" aria-hidden />
                  <span className="font-geist-mono tabular-nums">
                    {formatClock(seconds)}
                  </span>{" "}
                  do końca
                </span>
              </div>

              <div className="grid lg:grid-cols-[1fr_18rem]">
                <Navigator />
                <Summary />
              </div>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <p className="mt-12 text-center text-[11px] font-medium text-fog">
              W trybie na czas dostajesz
            </p>
            <ul className="mt-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
              {perks.map((perk) => (
                <li
                  key={perk.label}
                  className="flex items-center gap-2 text-body font-medium text-steel"
                >
                  <perk.icon className="size-4 text-silver" strokeWidth={1.7} aria-hidden />
                  {perk.label}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
