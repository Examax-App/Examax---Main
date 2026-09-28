import { ChevronRight, LineChart } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";
import { SECTION_H2 } from "@/lib/type";

/**
 * The analytics block, in Examax's terms.
 *
 * Built from the "Design for Roadmap" set in the Figma file
 * (`wuO3Pq5OaVJb1pBWGznjAl`), whose reference is dub.co/analytics: an icon
 * eyebrow over a centred heading, two CTAs, a row of stat tiles divided by
 * hairlines with the active one underlined in ink, and a full-width line chart
 * carrying a floating tooltip, dashed gridlines and dated axis labels.
 *
 * The details are the point — the tile chevrons, the tooltip's own header row,
 * the y-axis labels sitting inside the plot rather than beside it — so they
 * are reproduced rather than summarised.
 */

/* PLACEHOLDER FIGURES — illustrative, like every other number on the page. */
const tiles = [
  { label: "Tematy opanowane", value: "24", dot: "bg-electric-blue", active: true },
  { label: "Tygodni do egzaminu", value: "38", dot: "bg-lavender" },
  { label: "Skuteczność", value: "78%", dot: "bg-vivid-green" },
];

/** Steps completed per day across three weeks — jagged, because real weeks are. */
const SERIES = [
  6, 11, 4, 9, 13, 7, 2, 8, 12, 5, 10, 14, 6, 3, 9, 13, 8, 11, 4, 7, 12, 15, 9,
  6, 11, 14,
];

const CHART_W = 720;
const CHART_H = 200;
const Y_MAX = 16;

const points = SERIES.map((value, index) => {
  const x = (index / (SERIES.length - 1)) * CHART_W;
  const y = CHART_H - (value / Y_MAX) * CHART_H;
  return `${x.toFixed(1)},${y.toFixed(1)}`;
}).join(" ");

const gridLines = [4, 8, 12].map((value) => ({
  value,
  y: CHART_H - (value / Y_MAX) * CHART_H,
}));

const xLabels = ["1 mar", "6 mar", "11 mar", "16 mar", "21 mar"];

export function ProgressGlance() {
  return (
    <section
      id="glance"
      aria-labelledby="glance-heading"
      className="col-rules border-t border-ash bg-white"
    >
      <Container className="py-20 text-center">
        <Reveal>
          <p className="flex items-center justify-center gap-2 text-[12px] font-medium text-steel">
            <LineChart className="size-3.5 text-electric-blue" strokeWidth={2} aria-hidden />
            Postęp w czasie
          </p>
          <h2
            id="glance-heading"
            className={cn("mx-auto mt-4 max-w-xl text-charcoal", SECTION_H2)}
          >
            Widać, że plan się posuwa
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-pretty text-body-xl text-fog">
            Każdy zaliczony krok trafia na wykres — nie musisz nikomu wierzyć na
            słowo, że idzie do przodu.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button href="/signup" variant="primary">
              Ułóż swoją roadmapę
            </Button>
            <Button href="#map" variant="outline">
              Zobacz roadmapę
            </Button>
          </div>
        </Reveal>
      </Container>

      <Reveal>
        <div
          role="img"
          aria-label="Podgląd postępu: 24 tematy opanowane, 38 tygodni do egzaminu, skuteczność 78 procent, oraz wykres kroków zaliczonych dzień po dniu"
          className="mx-auto w-full max-w-[var(--page-max-width)] border-t border-ash"
        >
          {/* Stat tiles: hairline-divided, the active one underlined in ink —
              the reference's own way of marking which series the chart shows. */}
          <ul className="grid divide-y divide-ash sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {tiles.map((tile) => (
              <li
                key={tile.label}
                className={cn(
                  "relative px-6 py-5",
                  tile.active && "border-b-2 border-b-charcoal",
                )}
              >
                <p className="flex items-center gap-2 text-[12px] text-fog">
                  <span className={cn("size-2 rounded-[3px]", tile.dot)} aria-hidden />
                  {tile.label}
                </p>
                <p className="mt-1.5 text-heading-sm font-medium leading-none text-charcoal tabular-nums">
                  {tile.value}
                </p>
                <ChevronRight
                  className="absolute right-4 top-1/2 size-4 -translate-y-1/2 text-silver"
                  aria-hidden
                />
              </li>
            ))}
          </ul>

          <div className="relative border-t border-ash px-5 pb-10 pt-6 sm:px-8">
            {/* Floating tooltip — a header row over one series line, exactly as
                the reference draws it. */}
            <div className="pointer-events-none absolute left-8 top-8 z-10 w-56 overflow-hidden rounded-cards border border-ash bg-white shadow-md">
              <p className="border-b border-ash px-3 py-2 text-[11px] text-steel">
                15 marca 2027
              </p>
              <p className="flex items-center justify-between px-3 py-2">
                <span className="flex items-center gap-2 text-[11px] text-steel">
                  <span className="size-2 rounded-[3px] bg-electric-blue" aria-hidden />
                  Kroki
                </span>
                <span className="font-geist-mono text-[11px] font-medium text-charcoal tabular-nums">
                  12
                </span>
              </p>
            </div>

            <div className="relative">
              <svg
                viewBox={`0 0 ${CHART_W} ${CHART_H}`}
                preserveAspectRatio="none"
                className="h-56 w-full sm:h-64"
                aria-hidden
              >
                {gridLines.map((line) => (
                  <line
                    key={line.value}
                    x1="0"
                    x2={CHART_W}
                    y1={line.y}
                    y2={line.y}
                    stroke="#e5e5e5"
                    strokeWidth="1"
                    strokeDasharray="3 5"
                    vectorEffect="non-scaling-stroke"
                  />
                ))}
                <polyline
                  points={points}
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>

              {/* Y labels sit inside the plot, left-aligned on the gridlines —
                  the reference keeps them off their own axis column. */}
              {gridLines.map((line) => (
                <span
                  key={line.value}
                  aria-hidden
                  className="pointer-events-none absolute left-0 -translate-y-1/2 bg-white pr-1.5 font-geist-mono text-[10px] text-silver tabular-nums"
                  style={{ top: `${(line.y / CHART_H) * 100}%` }}
                >
                  {line.value}
                </span>
              ))}
            </div>

            <div className="mt-2 flex justify-between font-geist-mono text-[10px] text-silver">
              {xLabels.map((label) => (
                <span key={label}>{label}</span>
              ))}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
