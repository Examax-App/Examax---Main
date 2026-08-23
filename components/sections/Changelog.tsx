import { Bot, FileText, Gauge, RefreshCcw, Route } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/cn";
import { SECTION_H2 } from "@/lib/type";
import { Reveal } from "@/components/ui/Reveal";

const releases = [
  { date: "18 sie 2026", title: "Agent Examax 2.0", icon: Bot },
  { date: "4 sie 2026", title: "Arkusze CKE 2026", icon: FileText },
  { date: "21 lip 2026", title: "Roadmapa matury rozszerzonej", icon: Route },
  { date: "8 lip 2026", title: "Wskaźnik gotowości", icon: Gauge },
  { date: "24 cze 2026", title: "Tryb powtórek", icon: RefreshCcw },
];

/**
 * Release timeline in the reference's two-column layout: heading + outline
 * button on the left, dated entries with 32px circled release icons on the
 * right, the last item fading out.
 */
export function Changelog() {
  return (
    <section
      id="changelog"
      aria-labelledby="changelog-heading"
      className="col-rules border-t border-ash bg-white"
    >
      <Container className="py-20">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr]">
          <Reveal>
            <h2
              id="changelog-heading"
              className={cn("max-w-md text-charcoal", SECTION_H2)}
            >
              Co nowego w Examax
            </h2>
            <p className="mt-4 max-w-sm text-body-xl text-fog">
              Nowe arkusze, mądrzejsza roadmapa i lepszy agent — co kilka
              tygodni, nie co semestr.
            </p>
            <Button href="#faq" variant="outline" className="mt-6">
              Pełny changelog
            </Button>
          </Reveal>

          <Reveal delay={100}>
            <ol className="mask-fade-bottom space-y-6">
              {releases.map((release) => (
                <li key={release.title} className="flex items-center gap-4">
                  <span
                    aria-hidden
                    className="grid size-8 shrink-0 place-items-center rounded-full border border-ash bg-white text-steel shadow-subtle"
                  >
                    <release.icon className="size-4" strokeWidth={1.6} />
                  </span>
                  <div>
                    <p className="text-body font-medium text-charcoal">
                      {release.title}
                    </p>
                    <p className="text-[13px] text-silver">{release.date}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
