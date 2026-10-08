import Link from "@/components/ui/Link";
import { ArrowUpRight } from "lucide-react";
import { ExamTags, TopicIcon } from "@/components/subjects/pieces";
import type { Accent } from "@/components/ui/FeaturePill";
import { cn } from "@/lib/cn";
import type { IconComponent } from "@/lib/icon";
import type { Topic } from "@/components/subjects/types";

/** The strip's slot: one card wide, snapping to its start. */
const SLOT = "flex w-[85%] shrink-0 snap-start sm:w-[318px]";

/**
 * dub's program card: the mark, the name, a few lines, and a labelled line
 * at the foot — "Rewards" there, the exams here.
 */
export function TopicCard({ topic, accent }: { topic: Topic; accent: Accent }) {
  return (
    <li className={SLOT}>
      <article className="flex w-full flex-col rounded-xl border border-ash bg-white p-6 sm:p-8">
        <TopicIcon icon={topic.icon} accent={accent} />
        <h4 className="mt-8 text-base font-medium text-charcoal">{topic.name}</h4>
        <p className="mt-1 line-clamp-3 min-h-[3lh] text-pretty text-body text-fog">{topic.description}</p>
        <p className="mt-6 text-xs text-fog">Na egzaminie</p>
        <ExamTags exams={topic.exams} className="mt-2" />
      </article>
    </li>
  );
}

/** The page's last card, as dub's "View all": a few marks stacked, and the way into the app. */
export function ClosingCard({ icons, accent }: { icons: IconComponent[]; accent: Accent }) {
  return (
    <li className={SLOT}>
      <Link
        href="/signup"
        className="focus-ring group flex w-full flex-col items-center justify-center gap-4 rounded-xl border border-ash bg-white p-8 transition-colors hover:bg-canvas-muted"
      >
        <span className="flex -space-x-3">
          {icons.map((icon, i) => (
            <span key={i} className={cn("rounded-full ring-2 ring-white", i === 1 && "-translate-y-2")}>
              <TopicIcon icon={icon} accent={accent} />
            </span>
          ))}
        </span>
        <span className="flex items-center gap-1 text-base font-medium text-charcoal">
          Wszystko w aplikacji
          <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-px group-hover:translate-x-px" strokeWidth={2} aria-hidden />
        </span>
      </Link>
    </li>
  );
}
