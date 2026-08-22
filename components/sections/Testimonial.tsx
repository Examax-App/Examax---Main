import { BookOpen } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";

function HoryzontMark() {
  return (
    <span className="inline-flex items-center border-2 border-electric-blue px-3 py-1.5 font-geist-mono text-body-lg font-medium uppercase tracking-[0.2em] text-electric-blue">
      LO Horyzont
    </span>
  );
}

function StrefaMark() {
  return (
    <span className="inline-flex items-center gap-2">
      <svg viewBox="0 0 24 24" className="size-6" aria-hidden>
        <path
          d="M4 15a8 8 0 0 1 16 0"
          fill="none"
          stroke="#171717"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        <path d="M2.5 18.5h19" stroke="#171717" strokeWidth="2.4" strokeLinecap="round" />
      </svg>
      <span className="font-satoshi text-heading-sm font-bold tracking-tight text-charcoal">
        strefa nauki
      </span>
    </span>
  );
}

const orgMarks = {
  horyzont: HoryzontMark,
  strefa: StrefaMark,
} as const;

/**
 * Full-width quote band over the dotted texture — quote left with a
 * "Read the story" chip, attribution (logomark, name, role, portrait tile)
 * right, matching the reference's testimonial breaks.
 */
export function Testimonial({
  quote,
  name,
  role,
  org,
  avatarClassName,
}: {
  quote: React.ReactNode;
  name: string;
  role: string;
  org: keyof typeof orgMarks;
  avatarClassName?: string;
}) {
  const OrgMark = orgMarks[org];
  return (
    <section
      aria-label={`Opinia: ${name}`}
      className="relative overflow-hidden border-t border-ash bg-white"
    >
      <div className="bg-dots mask-fade-edges absolute inset-0" aria-hidden />
      <Container className="relative py-16 sm:py-20">
        <div className="grid items-start gap-10 lg:grid-cols-[1.7fr_1fr]">
          <Reveal>
            <blockquote className="max-w-2xl text-heading-sm font-normal leading-[1.38] text-graphite sm:text-heading">
              &ldquo;{quote}&rdquo;
            </blockquote>
            <a
              href="#faq"
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-ash bg-white px-3.5 py-2 text-body font-medium text-charcoal shadow-subtle transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm"
            >
              <BookOpen className="size-4 text-steel" aria-hidden />
              Przeczytaj historię
            </a>
          </Reveal>
          <Reveal delay={100}>
            <div className="flex flex-col items-start gap-3 lg:items-end lg:text-right">
              <OrgMark />
              <div className="mt-2">
                <p className="text-body-lg font-semibold text-charcoal">{name}</p>
                <p className="text-body text-fog">{role}</p>
              </div>
              {/* Stylised portrait tile — photography is out of scope for the
                  design system, so this reads as a designed mark, not a bug */}
              <span
                aria-hidden
                className={cn(
                  "relative grid size-14 place-items-center overflow-hidden rounded-cards shadow-subtle",
                  avatarClassName ?? "bg-gradient-to-br from-[#dbeaff] to-[#ece2fb]",
                )}
              >
                <svg viewBox="0 0 56 56" className="size-14">
                  <circle cx="28" cy="21" r="9" fill="rgba(23,23,23,0.55)" />
                  <path
                    d="M10 50c2.5-10 9.5-15 18-15s15.5 5 18 15"
                    fill="rgba(23,23,23,0.55)"
                  />
                </svg>
              </span>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
