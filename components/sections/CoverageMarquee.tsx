import { Container } from "@/components/ui/Container";

const rowA = [
  "Egzamin ósmoklasisty",
  "Matura podstawowa",
  "Matura rozszerzona",
  "Arkusze CKE",
];

const rowB = [
  "Matematyka",
  "Język polski",
  "Język angielski",
  "Więcej przedmiotów wkrótce",
];

function MarqueeRow({
  items,
  direction,
}: {
  items: string[];
  direction: "left" | "right";
}) {
  const track = (ariaHidden: boolean) => (
    <ul
      aria-hidden={ariaHidden || undefined}
      className="flex shrink-0 items-center"
    >
      {items.map((label) => (
        <li key={label} className="flex shrink-0 items-center">
          <span className="px-6 font-satoshi text-[19px] font-bold leading-none tracking-tight text-graphite/70 transition-colors duration-200 hover:text-graphite sm:px-9 sm:text-[21px]">
            {label}
          </span>
          <span aria-hidden className="size-1 rounded-full bg-pebble" />
        </li>
      ))}
    </ul>
  );
  return (
    <div className="mask-fade-x flex overflow-hidden">
      <div
        className={
          direction === "left"
            ? "animate-marquee-left flex w-max"
            : "animate-marquee-right flex w-max"
        }
      >
        {track(false)}
        {track(true)}
        {track(true)}
        {track(true)}
      </div>
    </div>
  );
}

/**
 * Coverage marquee — two counter-scrolling rows of exams and subjects.
 * Content is limited to what is truthful today; no invented coverage.
 * Static (single pass, no scroll) under prefers-reduced-motion.
 */
export function CoverageMarquee() {
  return (
    <section
      aria-label="Egzaminy i przedmioty w Examax"
      className="border-y border-ash bg-white"
    >
      <Container className="py-10">
        <p className="text-center text-[12px] font-medium uppercase tracking-[0.14em] text-fog">
          Jedna platforma, oba egzaminy CKE
        </p>
        <div className="mt-7 space-y-5">
          <MarqueeRow items={rowA} direction="left" />
          <MarqueeRow items={rowB} direction="right" />
        </div>
      </Container>
    </section>
  );
}
