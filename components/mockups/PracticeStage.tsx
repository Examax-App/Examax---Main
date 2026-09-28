import {
  Axis3d,
  Brackets,
  ChartColumn,
  ChartNoAxesColumnIncreasing,
  ChartPie,
  ChartSpline,
  CircleHelp,
  Copy,
  CornerDownRight,
  Cylinder,
  Circle,
  Cone,
  Download,
  Equal,
  ExternalLink,
  FileText,
  Gauge,
  Grid2x2,
  Hexagon,
  ListChecks,
  Network,
  Pentagon,
  Plus,
  Pyramid,
  Ruler,
  Sigma,
  Square,
  SquareSplitVertical,
  Triangle,
  TriangleRight,
  X,
} from "lucide-react";
import { BrandMark } from "@/components/ui/BrandMark";
import { E8Icon } from "@/components/ui/E8Icon";
import { MaturaIcon } from "@/components/ui/MaturaIcon";
import { cn } from "@/lib/cn";
import type { IconComponent } from "@/lib/icon";

/**
 * The Trening section's three pictures, one per sub-feature below the band,
 * each a template copy of the reference's own component (dub.co, read off
 * its live DOM and the captures in `DesignRules/`):
 *
 *  - QuestionRows ← the custom-domains cascade
 *  - TopicTiles   ← the advanced-link-features tile grid and entrance, untinted
 *  - NewSet       ← the QR-codes panel: the set's page and its sharing card
 *
 * All drawn on an 800×440 stage; FeatureStage scales it on narrow screens.
 * PLACEHOLDER DATA — the questions, counts and links are illustrative.
 */

/* ------------------------------------------------------------------------ */
/* Difficulty — one scale for the whole section                              */
/* ------------------------------------------------------------------------ */

export type Difficulty = "easy" | "medium" | "hard" | "extreme";

/** Łatwe green, Średnie beige-orange, Trudne red, Bardzo trudne black. */
const DIFFICULTY: Record<Difficulty, { label: string; badge: string; swatch: string }> = {
  easy: { label: "Łatwe", badge: "bg-[#dcfce7] text-[#15803d]", swatch: "bg-[#22c55e]" },
  medium: { label: "Średnie", badge: "bg-[#fbecd5] text-[#b45309]", swatch: "bg-[#f5b35b]" },
  hard: { label: "Trudne", badge: "bg-[#fee2e2] text-[#dc2626]", swatch: "bg-[#ef4444]" },
  extreme: { label: "Bardzo trudne", badge: "bg-charcoal text-white", swatch: "bg-charcoal" },
};

function DifficultyBadge({ level }: { level: Difficulty }) {
  const d = DIFFICULTY[level];
  return (
    <span className={cn("flex items-center gap-1 whitespace-nowrap rounded-md px-2 py-1 text-xs", d.badge)}>
      <Gauge className="size-3.5" strokeWidth={2} />
      {d.label}
    </span>
  );
}

/* ------------------------------------------------------------------------ */
/* 1 · Question rows                                                         */
/* ------------------------------------------------------------------------ */

type Row = {
  title: string;
  source: string;
  solved: string;
  level: Difficulty;
  draft?: boolean;
};

const ROWS: Row[] = [
  { title: "Zadanie 7 · Procenty", source: "Arkusz CKE 2024 · Matematyka", solved: "12,4 tys. rozwiązań", level: "easy" },
  { title: "Zadanie 12 · Funkcja liniowa", source: "Arkusz CKE 2023 · Matematyka", solved: "3,1 tys. rozwiązań", level: "medium" },
  { title: "Twoje zadanie · Równania", source: "Własne pytanie · Matematyka", solved: "0 rozwiązań", level: "medium", draft: true },
];

const ANSWERS = [
  { key: "A", text: "x = 1 lub x = 6", points: "0", correct: false },
  { key: "B", text: "x = 2 lub x = 3", points: "1", correct: true },
  { key: "C", text: "x = −2 lub x = −3", points: "0", correct: false },
];

export function QuestionRows() {
  return (
    <div
      aria-hidden
      className="mx-auto size-full overflow-hidden px-5 pt-12 [mask-composite:intersect] [mask-image:linear-gradient(black_70%,transparent),linear-gradient(90deg,black_70%,transparent)]"
    >
      <div className="flex w-full max-w-2xl flex-col gap-2.5">
        {ROWS.map((row, idx) => (
          <div
            key={row.title}
            className="w-full cursor-default rounded-xl border border-ash bg-white shadow-sm transition-transform duration-300 hover:-translate-x-3"
            style={{ marginLeft: `${idx * 8}%` }}
          >
            <div className="flex items-center justify-between gap-8 rounded-[inherit] bg-white px-4 py-5">
              <div className="flex items-center gap-3">
                <div className="flex-none rounded-full border border-ash bg-gradient-to-t from-paper-mist p-2">
                  {row.draft ? (
                    <FileText className="size-5 text-charcoal" strokeWidth={2} />
                  ) : (
                    <Sigma className="size-5 text-charcoal" strokeWidth={2} />
                  )}
                </div>
                <div className="flex flex-col text-sm">
                  <span className="font-medium leading-none text-charcoal">{row.title}</span>
                  <div className="mt-1 flex items-center gap-1">
                    <CornerDownRight className="size-3.5 text-silver" strokeWidth={1.75} />
                    <span className="truncate text-fog">{row.source}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 whitespace-nowrap rounded-md border border-ash px-2 py-1 text-xs text-steel">
                  <ListChecks className="size-3.5" strokeWidth={1.75} />
                  {row.solved}
                </span>
                <DifficultyBadge level={row.level} />
              </div>
            </div>

            {/* The draft, opened into the question editor */}
            {row.draft && (
              <div className="rounded-b-xl border-t border-ash bg-canvas-muted px-5 pb-5 pt-4">
                <p className="text-sm text-steel">
                  Aby opublikować <span className="font-semibold text-charcoal">Twoje zadanie</span>, uzupełnij odpowiedzi i punktację.
                </p>
                <div className="mt-3 flex gap-5 border-b border-ash text-sm">
                  <span className="border-b-2 border-charcoal pb-2 font-medium text-charcoal">Zamknięte</span>
                  <span className="pb-2 text-fog">Otwarte</span>
                </div>
                <div className="mt-3 grid grid-cols-[104px_1fr_72px_80px] text-sm font-medium text-charcoal">
                  <span>Odpowiedź</span>
                  <span>Treść</span>
                  <span>Punkty</span>
                  <span>Poprawna</span>
                </div>
                {ANSWERS.map((answer) => (
                  <div key={answer.key} className="mt-2.5 grid grid-cols-[104px_1fr_72px_80px] items-center text-sm text-steel">
                    <span className="font-medium text-charcoal">{answer.key}</span>
                    <span>{answer.text}</span>
                    <span className="tabular-nums">{answer.points}</span>
                    <span className="text-silver">{answer.correct ? "Tak" : "—"}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* 2 · Six years of sheets, one set — topic tiles                            */
/* ------------------------------------------------------------------------ */

type Tile = { icon?: IconComponent; label?: string; delay: number } | "centre";

/**
 * The reference's grid: rows of six and five, offset like brickwork, the
 * centre tile in the middle row. Delays are the reference's own, growing
 * with distance from the centre so the grid blooms outwards.
 */
const TILE_ROWS: Tile[][] = [
  [
    { delay: 0.32 },
    { icon: Pentagon, delay: 0.25 },
    { icon: SquareSplitVertical, label: "Ułamki", delay: 0.21 },
    { icon: ChartPie, label: "Procenty", delay: 0.21 },
    { icon: Ruler, delay: 0.25 },
    { delay: 0.32 },
  ],
  [
    { icon: Circle, delay: 0.22 },
    { icon: Grid2x2, label: "Potęgi", delay: 0.14 },
    { icon: Equal, label: "Równania", delay: 0.1 },
    { icon: ChartSpline, label: "Funkcje", delay: 0.14 },
    { icon: Hexagon, delay: 0.22 },
  ],
  [
    { icon: Axis3d, delay: 0.18 },
    { icon: Triangle, label: "Geometria", delay: 0.1 },
    "centre",
    { icon: ChartColumn, label: "Statystyka", delay: 0.1 },
    { icon: Square, delay: 0.18 },
  ],
  [
    { icon: Cone, delay: 0.22 },
    { icon: ChartNoAxesColumnIncreasing, label: "Ciągi", delay: 0.14 },
    { icon: Brackets, label: "Algebra", delay: 0.1 },
    { icon: Network, label: "Rachunek prawd.", delay: 0.14 },
    { icon: Cylinder, delay: 0.22 },
  ],
  [
    { delay: 0.32 },
    { icon: Ruler, delay: 0.25 },
    { icon: Pyramid, label: "Bryły", delay: 0.21 },
    { icon: TriangleRight, label: "Trygonometria", delay: 0.21 },
    { icon: Hexagon, delay: 0.25 },
    { delay: 0.32 },
  ],
];

/** Tiles replay their entrance each time the panel is shown again. */
const PULSE = "in-data-[current=true]:animate-pulse-in";

export function TopicTiles() {
  return (
    <div
      aria-hidden
      className="size-full [mask-composite:intersect] [mask-image:linear-gradient(black_70%,transparent),linear-gradient(90deg,transparent,black_20%,black_80%,transparent)]"
    >
      <div className="relative isolate flex size-full items-center justify-center bg-canvas-muted pt-6">
        <div className="flex size-fit flex-col items-center gap-4">
          {TILE_ROWS.map((row, r) => (
            <div key={r} className="flex items-center gap-4 [transform:translateZ(0)]">
              {row.map((tile, i) =>
                tile === "centre" ? (
                  <div
                    key={i}
                    className={cn(
                      "flex h-[72px] w-[196px] items-center justify-center rounded-xl border border-ash bg-white ring-4 ring-black/5 will-change-transform",
                      PULSE,
                    )}
                    style={{ animationDelay: "0s" }}
                  >
                    <div className="flex items-center gap-1.5">
                      <div className="flex-none rounded-full border border-ash bg-gradient-to-t from-paper-mist p-2">
                        <BrandMark className="size-4 text-charcoal" />
                      </div>
                      <span className="text-base font-semibold text-charcoal">Examax</span>
                    </div>
                  </div>
                ) : (
                  <div
                    key={i}
                    className={cn(
                      "flex h-[72px] w-[144px] flex-col items-center justify-center gap-2 rounded-xl border border-ash will-change-transform",
                      PULSE,
                    )}
                    // Inline, so the animation shorthand cannot reset it.
                    style={{ animationDelay: `${tile.delay}s` }}
                  >
                    {tile.icon && (
                      <tile.icon className="size-4 text-graphite" strokeWidth={2} />
                    )}
                    {tile.label && <span className="text-xs font-semibold text-steel">{tile.label}</span>}
                  </div>
                ),
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* 3 · New set — the reference's QR-code layout, one to one                  */
/* ------------------------------------------------------------------------ */

/**
 * A real, scannable code for https://examax.app: version 3 (29×29, the
 * reference's own size) at error-correction level H, which recovers up to
 * 30% of the symbol, so the logo over its centre does not stop a phone
 * reading it. Generated once with the `qrcode` package and kept as data,
 * so no QR library ships to the browser. Regenerate if the URL changes.
 */
const QR_ROWS = [
  "11111110011000011111001111111",
  "10000010011010010010101000001",
  "10111010100110100000101011101",
  "10111010110001100101101011101",
  "10111010001011000111001011101",
  "10000010011011011110001000001",
  "11111110101010101010101111111",
  "00000000010111001001100000000",
  "00011011010011110010100001100",
  "11110101011000101000101010010",
  "01101111000000101110011110100",
  "10000100101000111010000110001",
  "00101011111101010001011001010",
  "11101101011110101000001010111",
  "00010111011001101011100101001",
  "00101101011011000100000011111",
  "11011011010001001110101001010",
  "11000101010010101110101011100",
  "11111011011110101100100111001",
  "11111101000111100100011010101",
  "11011011110011100100111111111",
  "00000000100010010110100011100",
  "11111110110010011101101010100",
  "10000010001010011011100011011",
  "10111010100001101011111110000",
  "10111010110000001010000101110",
  "10111010000110000100110110011",
  "10000010000001111101101011101",
  "11111110001001010010100111000",
];

const QR = QR_ROWS.map((row) => [...row].map((bit) => bit === "1"));

function QrCode({ className }: { className?: string }) {
  const n = QR.length;
  return (
    <span className={cn("relative inline-block", className)}>
      <svg viewBox={`0 0 ${n} ${n}`} className="size-full" shapeRendering="crispEdges">
        {QR.flatMap((row, r) => row.map((on, c) => (on ? <rect key={`${r}-${c}`} x={c} y={r} width="1" height="1" fill="#0a0a0a" /> : null)))}
      </svg>
      <span className="absolute left-1/2 top-1/2 grid size-[24%] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-charcoal ring-2 ring-white">
        <BrandMark className="size-[58%] text-white" />
      </span>
    </span>
  );
}

/** The reference's form label: 14px medium grey, with a help mark. */
function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-slate">{children}</span>
      <CircleHelp className="size-4 text-silver" strokeWidth={1.75} />
    </div>
  );
}

/** The set's link, shown in the page's address bar and the sharing card. */
const SET_LINK = { domain: "examax.app/zestaw", slug: "powtorka" };

/** The set's topics, previewed on its page as mini cards. */
const SET_CARDS: Array<{ exam: "matura" | "e8"; option: string; title: string }> = [
  { exam: "matura", option: "Podstawa", title: "Procenty" },
  { exam: "e8", option: "Matematyka", title: "Ułamki" },
  { exam: "matura", option: "Rozszerzenie", title: "Funkcja kwadratowa" },
  { exam: "e8", option: "Matematyka", title: "Równania" },
];

/** Replays each time the panel is shown, like the reference's stage. */
const RISE = "in-data-[current=true]:animate-rise";

export function NewSet() {
  return (
    <div aria-hidden className="size-full pt-12 [mask-image:linear-gradient(black_80%,transparent)]">
      <div className="relative mx-auto flex size-full max-w-[650px]">
        {/* The set's own page, as a student opens it from the link. Type
            sizes and gaps are measured off the reference's page mock. */}
        <div
          className={cn("relative size-full [mask-image:linear-gradient(black_78%,transparent)]", RISE)}
          style={{ "--offset": "20px", animationDelay: "150ms" } as React.CSSProperties}
        >
          <div className="h-[392px] w-[335px] overflow-hidden rounded-t-lg border border-b-0 border-ash bg-white">
            <div className="flex h-[23px] items-center border-b border-ash px-2">
              <span className="flex gap-[2.5px]">
                {[0, 1, 2].map((i) => (
                  <span key={i} className="size-[5px] rounded-full border border-smoke" />
                ))}
              </span>
              <span className="mx-auto flex h-[14px] w-[159px] items-center justify-center rounded-[3px] bg-paper-mist text-[6px] text-charcoal">
                {SET_LINK.domain}/{SET_LINK.slug}
              </span>
            </div>
            <div className="px-8 pt-8">
              <div className="flex items-center gap-2.5">
                <BrandMark className="size-6 text-charcoal" />
                <span className="text-lg font-semibold leading-6 text-charcoal">Examax</span>
              </div>
              <p className="mt-6 text-[15px] font-semibold leading-5 text-charcoal">Powtórka z matematyki</p>
              <p className="mt-2.5 text-[11.5px] leading-[18px] text-fog">
                Cztery tematy z arkuszy CKE, 15 minut.
                <br />
                Wynik zobaczysz od razu po oddaniu.
              </p>
              <div className="mt-4 flex items-center gap-1">
                {["Matura", "Powtórka"].map((tag) => (
                  <span key={tag} className="rounded-md border border-ash bg-white px-1.5 text-[10px] leading-4 text-charcoal">
                    {tag}
                  </span>
                ))}
                <span className="flex size-[18px] items-center justify-center rounded-md border border-ash bg-white text-steel">
                  <Plus className="size-2.5" strokeWidth={2} />
                </span>
              </div>
              {/* The set's topics in place of the reference's code; the
                  bottom pair falls into the page's fade. */}
              <div className="mt-5 grid grid-cols-2 gap-2">
                {SET_CARDS.map((card) => {
                  const ExamMark = card.exam === "matura" ? MaturaIcon : E8Icon;
                  return (
                    <div key={card.title} className="rounded-lg border border-ash bg-white p-2.5">
                      <div className="flex items-center gap-1.5">
                        <span className="flex size-5 flex-none items-center justify-center rounded-full border border-ash bg-linear-to-t from-paper-mist">
                          <ExamMark className="h-2.5 w-3" />
                        </span>
                        <span className="truncate text-[9px] font-medium text-fog">{card.option}</span>
                      </div>
                      <p className="mt-2.5 truncate text-[11px] font-medium leading-4 text-charcoal">{card.title}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* The sharing card — the reference's QR Code Design card */}
        <div className="absolute right-0 top-1/2 w-[500px] origin-right -translate-y-1/2 scale-75">
          <div className={RISE} style={{ "--offset": "20px", animationDelay: "250ms" } as React.CSSProperties}>
            <div className="flex cursor-default flex-col gap-6 rounded-xl border border-ash bg-white p-4 shadow-[0_20px_20px_0_#00000017]">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-medium text-charcoal">Nowy zestaw</h3>
                <span className="flex size-6 items-center justify-center rounded-md border border-ash text-charcoal">
                  <X className="size-3.5" strokeWidth={1.75} />
                </span>
              </div>

              <div>
                <div className="flex items-center justify-between gap-2">
                  <FieldLabel>Podgląd kodu QR</FieldLabel>
                  <div className="flex h-6 items-center gap-3 px-1 text-fog">
                    <Download className="size-4" strokeWidth={1.75} />
                    <Copy className="size-4" strokeWidth={1.75} />
                  </div>
                </div>
                <div className="relative mt-2 flex h-40 items-center justify-center overflow-hidden rounded-md border border-smoke">
                  <div className="absolute inset-0 bg-[radial-gradient(#d4d4d4_1px,transparent_1px)] opacity-60 [background-size:4px_4px] [mask-image:radial-gradient(40%_80%,transparent_50%,black)]" />
                  <QrCode className="relative size-[112px]" />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <FieldLabel>Sprawdzaj od razu</FieldLabel>
                {/* The kit's Toggle, drawn static: the picture is aria-hidden */}
                <span className="relative inline-flex h-5 w-9 items-center rounded-full bg-electric-blue">
                  <span className="absolute size-4 translate-x-[18px] rounded-full bg-white shadow-subtle" />
                </span>
              </div>

              {/* The reference's short-link field: fixed domain, slug, copy */}
              <div>
                <div className="flex items-center justify-between gap-2">
                  <FieldLabel>Link do zestawu</FieldLabel>
                  <div className="flex h-6 items-center px-1 text-fog">
                    <ExternalLink className="size-4" strokeWidth={1.75} />
                  </div>
                </div>
                <div className="mt-2 flex h-9 overflow-hidden rounded-md border border-smoke shadow-sm">
                  <span className="flex items-center border-r border-smoke bg-paper-mist px-3 text-sm text-steel">{SET_LINK.domain}</span>
                  <span className="flex flex-1 items-center px-3 text-sm text-charcoal">{SET_LINK.slug}</span>
                  <span className="my-auto mr-1 flex size-7 items-center justify-center rounded-md border border-ash bg-white text-steel">
                    <Copy className="size-3.5" strokeWidth={1.75} />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
