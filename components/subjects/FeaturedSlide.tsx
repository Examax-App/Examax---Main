import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { DIAGRAMS } from "@/components/subjects/diagrams";
import { ExamTags, TopicIcon } from "@/components/subjects/pieces";
import { accentStyles, type Accent } from "@/components/ui/FeaturePill";
import { cn } from "@/lib/cn";
import type { FeaturedTopic } from "@/components/subjects/types";

/**
 * One slide of the featured carousel, after dub's featured program card:
 * the mark, the name, a line, "Rewards" with a count and its rows ("W
 * Examaxie" here), "Website" ("Na egzaminie" here) and the way in. dub
 * leaves the right half for the program's picture; here it holds the
 * topic's diagram on a faint grid in the subject's colour.
 */
export function FeaturedSlide({ topic, accent }: { topic: FeaturedTopic; accent: Accent }) {
  const Diagram = DIAGRAMS[topic.diagram];
  return (
    <article className="grid h-full grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
      <div className="flex flex-col p-6 sm:p-8">
        <TopicIcon icon={topic.icon} accent={accent} size="lg" />
        <h2 className="mt-10 font-satoshi text-2xl font-medium text-charcoal">{topic.name}</h2>
        <p className="mt-1.5 max-w-md text-pretty text-body leading-relaxed text-fog">{topic.description}</p>

        <p className="mt-6 flex items-center gap-1.5 text-xs text-fog">
          W Examaxie
          <span className="rounded-[4px] bg-paper-mist px-1.5 py-px text-[11px] font-medium tabular-nums text-steel">{topic.inside.length}</span>
        </p>
        <ul className="mt-2 space-y-1.5">
          {topic.inside.map((line) => (
            <li key={line} className="flex items-start gap-2 text-body text-charcoal">
              <Check className={cn("mt-[3px] size-3.5 shrink-0", accentStyles[accent].text)} strokeWidth={2.5} aria-hidden />
              {line}
            </li>
          ))}
        </ul>

        <p className="mt-6 text-xs text-fog">Na egzaminie</p>
        <ExamTags exams={topic.exams} className="mt-2" />

        <Link
          href="/signup"
          className="focus-ring mt-7 inline-flex w-fit items-center gap-1 rounded-md text-body font-medium text-charcoal transition-colors hover:text-steel"
        >
          Zacznij ten temat
          <ArrowUpRight className="size-4" strokeWidth={2} aria-hidden />
        </Link>
      </div>

      {/* The topic's diagram, on the subject's grid */}
      <div className="relative flex items-center justify-center overflow-hidden border-t border-ash bg-canvas-muted px-6 py-10 md:border-l md:border-t-0 md:px-10">
        <div aria-hidden className="absolute inset-0 opacity-70 [background-image:linear-gradient(to_right,var(--color-ash)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-ash)_1px,transparent_1px)] [background-size:40px_40px] [mask-image:radial-gradient(closest-side,black,transparent)]" />
        <div aria-hidden className={cn("absolute left-1/2 top-1/2 size-64 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 blur-3xl", accentStyles[accent].tile)} />
        <div className="relative flex w-full justify-center">
          <Diagram />
        </div>
      </div>
    </article>
  );
}
