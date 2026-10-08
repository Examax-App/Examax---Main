import { BookMarked, Languages, Sigma } from "lucide-react";
import { AccentTile, type Accent } from "@/components/ui/FeaturePill";
import { cn } from "@/lib/cn";
import type { IconComponent } from "@/lib/icon";

/**
 * The band under the hero — dub.co/partners' logo band: columns on a 1px
 * grid, each headed by a grey label and holding marks in a 48px-tall grid,
 * some with a tiny pill hanging off them.
 *
 * The reference fills it with the customers it migrated. Examax has no
 * customers to name yet, so the band answers the question a visitor brings
 * to this page instead: which exams, and which subjects. One column per exam,
 * each carrying all three subjects the training covers (at the basic or the
 * extended level, as the column says), drawn as the footer draws them — chip
 * and name. The pills carry the first year the sheet archive goes back to.
 * Only what is available today is listed.
 *
 * PLACEHOLDER DATA — the archive years are illustrative.
 */

type Subject = { name: string; icon: IconComponent; accent: Accent; since?: string };

const SUBJECTS: Subject[] = [
  { name: "Matematyka", icon: Sigma, accent: "blue" },
  { name: "Język polski", icon: BookMarked, accent: "green" },
  { name: "Język angielski", icon: Languages, accent: "lavender" },
];

const COLUMNS: Array<{ label: string; since: string }> = [
  { label: "Egzamin ósmoklasisty", since: "Od 2019" },
  { label: "Matura podstawowa", since: "Od 2015" },
  { label: "Matura rozszerzona", since: "Od 2015" },
];

function SubjectMark({ subject, since }: { subject: Subject; since?: string }) {
  return (
    <div
      className={cn(
        "relative flex min-h-[48px] items-center justify-center",
        since && "-translate-y-1.5",
        // Three marks per column: the third sits centred under the pair
        // wherever the grid runs two across.
        "last:col-span-2 md:last:col-span-1 lg:last:col-span-2",
      )}
    >
      <span className="flex items-center gap-2">
        <AccentTile icon={subject.icon} accent={subject.accent} />
        <span className="whitespace-nowrap font-satoshi text-[17px] font-bold tracking-tight text-charcoal">
          {subject.name}
        </span>
      </span>
      {since ? (
        <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-paper-mist px-1 py-0.5 text-[8px] font-semibold uppercase leading-none text-steel">
          {since}
        </span>
      ) : null}
    </div>
  );
}

export function ExamCoverage() {
  return (
    <section aria-label="Egzaminy i przedmioty w treningu" className="relative overflow-clip border-b border-ash bg-white px-4">
      <div className="relative z-0 mx-auto max-w-[var(--page-max-width)] border-x border-ash">
        <div className="grid grid-cols-1 gap-px bg-ash md:grid-cols-3">
          {COLUMNS.map((column) => (
            <div key={column.label} className="flex flex-col items-center gap-6 bg-white px-2 pb-4 pt-2">
              <div className="w-full rounded-md bg-paper-mist px-4 py-2 text-center text-xs font-medium text-steel">
                {column.label}
              </div>
              <div className="grid w-full grid-cols-2 gap-x-2 gap-y-4 md:grid-cols-1 lg:grid-cols-2">
                {SUBJECTS.map((subject, index) => (
                  <SubjectMark
                    key={subject.name}
                    subject={subject}
                    since={index === 0 ? column.since : undefined}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
