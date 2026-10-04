import { cn } from "@/lib/cn";

/**
 * The figures that come with CKE tasks, drawn the way the sheets draw them:
 * a single ink line, hidden edges dashed, a few italic labels, no colour.
 * Language tasks have no figure on the sheet, so theirs is the task's own
 * shape: the answer page of an essay, a reading question's A/B/C options, a
 * sentence with its gap.
 *
 * They stand in for the reference's partner photos (dub.co/partners puts a
 * portrait in every card's thumbnail slot). A task's figure is the one image
 * every task already has, and it says "exam sheet" at a glance where a stock
 * portrait would only say "person". Straight, clean vectors — the icon rule
 * from the landing page's topic tiles applies here too.
 *
 * Drawn on a 64×64 box with `currentColor`, so the caller sets the ink.
 */
export type FigureName =
  | "percent"
  | "rightTriangle"
  | "linear"
  | "prism"
  | "circle"
  | "bars"
  | "numberLine"
  | "sequence"
  | "tree"
  | "parabola"
  | "trapezoid"
  | "pyramid"
  | "essay"
  | "choice"
  | "gapFill";

const LABEL = "fill-current stroke-none font-serif text-[8px] italic";

function Arrow({ d }: { d: string }) {
  return <path d={d} strokeWidth={1.25} />;
}

const FIGURES: Record<FigureName, React.ReactNode> = {
  essay: (
    <>
      <path d="M17 7H40L48 15V57H17Z" />
      <path d="M40 7V15H48" strokeWidth={1.1} />
      <path d="M22 22H35M22 28H43M22 33H43M22 38H38M26 45H43M22 50H40" strokeWidth={1.1} />
    </>
  ),
  choice: (
    <>
      <path d="M9 11H55M9 17H51M9 23H38" strokeWidth={1.1} />
      <circle cx="13" cy="34" r="3.2" />
      <circle cx="13" cy="44" r="3.2" className="fill-current" />
      <circle cx="13" cy="54" r="3.2" />
      <path d="M21 34H46M21 44H53M21 54H41" strokeWidth={1.1} />
    </>
  ),
  gapFill: (
    <>
      <path d="M7 24H21M45 24H57" />
      <rect x="24" y="16" width="18" height="12" rx="2" strokeDasharray="2.5 2" strokeWidth={1.1} />
      <path d="M30 19V25" strokeWidth={1.25} />
      <path d="M7 38H57M7 48H41" strokeWidth={1.1} />
    </>
  ),
  percent: (
    <>
      <circle cx="32" cy="32" r="19" />
      <path d="M32 32V13A19 19 0 0 1 50.1 26.1Z" className="fill-current/10" />
      <path d="M32 32L50.1 26.1" />
    </>
  ),
  rightTriangle: (
    <>
      <path d="M14 50H52L14 16Z" />
      <path d="M14 44H20V50" strokeWidth={1.1} />
      <text x="7" y="35" className={LABEL}>a</text>
      <text x="31" y="58" className={LABEL}>b</text>
      <text x="35" y="31" className={LABEL}>c</text>
    </>
  ),
  linear: (
    <>
      <Arrow d="M8 50H57M54 48l3 2-3 2" />
      <Arrow d="M14 57V7M12 10l2-3 2 3" />
      <path d="M8 55L54 13" />
      <circle cx="24" cy="40.4" r="1.8" className="fill-current" stroke="none" />
      <circle cx="41" cy="24.9" r="1.8" className="fill-current" stroke="none" />
    </>
  ),
  prism: (
    <>
      <path d="M12 26H38V50H12Z" />
      <path d="M12 26L24 16H50L38 26M50 16V40L38 50" />
      <path d="M24 16V40H50M24 40L12 50" strokeDasharray="2.5 2" strokeWidth={1.1} />
    </>
  ),
  circle: (
    <>
      <circle cx="32" cy="32" r="20" />
      <path d="M32 32L49.3 42M32 32L18 17.7" />
      <path d="M36.9 34.8A5.6 5.6 0 0 1 28.1 28" strokeWidth={1.1} />
      <circle cx="32" cy="32" r="1.6" className="fill-current" stroke="none" />
      <text x="33" y="30" className={LABEL}>O</text>
    </>
  ),
  bars: (
    <>
      <Arrow d="M9 52H57" />
      <Arrow d="M12 55V8" />
      <path d="M17 52V38H24V52M28 52V26H35V52M39 52V32H46V52M50 52V18H55V52" className="fill-current/10" />
    </>
  ),
  numberLine: (
    <>
      <Arrow d="M5 38H58M55 36l3 2-3 2" />
      <path d="M12 35V41M22 35V41M32 35V41M42 35V41M52 35V41" strokeWidth={1.1} />
      <path d="M22 30H46" strokeWidth={2.5} />
      <circle cx="22" cy="30" r="2.2" className="fill-current" />
      <circle cx="46" cy="30" r="2.2" className="fill-white" />
      <text x="30" y="50" className={LABEL}>0</text>
    </>
  ),
  sequence: (
    <>
      <Arrow d="M8 54H57" />
      <Arrow d="M12 57V7" />
      <path d="M18 48L27 41L36 32L45 22L54 10" strokeDasharray="2.5 2" strokeWidth={1.1} />
      {[
        [18, 48],
        [27, 41],
        [36, 32],
        [45, 22],
        [54, 10],
      ].map(([x, y]) => (
        <circle key={x} cx={x} cy={y} r="2" className="fill-current" stroke="none" />
      ))}
    </>
  ),
  tree: (
    <>
      <path d="M9 32L30 18M9 32L30 46M30 18L53 10M30 18L53 25M30 46L53 39M30 46L53 54" />
      {[
        [9, 32],
        [30, 18],
        [30, 46],
        [53, 10],
        [53, 25],
        [53, 39],
        [53, 54],
      ].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="1.9" className="fill-current" stroke="none" />
      ))}
    </>
  ),
  parabola: (
    <>
      <Arrow d="M6 46H58M55 44l3 2-3 2" />
      <Arrow d="M32 58V6M30 9l2-3 2 3" />
      <path d="M13 10Q32 78 51 10" />
      <circle cx="32" cy="44" r="1.8" className="fill-current" stroke="none" />
    </>
  ),
  trapezoid: (
    <>
      <path d="M10 46H54L43 20H21Z" />
      <path d="M21 20V46" strokeDasharray="2.5 2" strokeWidth={1.1} />
      <path d="M21 41H26V46" strokeWidth={1.1} />
      <text x="23" y="36" className={LABEL}>h</text>
    </>
  ),
  pyramid: (
    <>
      <path d="M12 46L40 53L54 42M33 9L12 46M33 9L40 53M33 9L54 42" />
      <path d="M12 46L26 36L54 42M33 9L26 36" strokeDasharray="2.5 2" strokeWidth={1.1} />
    </>
  ),
};

export function TaskFigure({
  name,
  className,
}: {
  name: FigureName;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={cn("shrink-0", className)}
    >
      {FIGURES[name]}
    </svg>
  );
}
