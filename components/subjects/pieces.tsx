import { E8Icon } from "@/components/ui/E8Icon";
import { MaturaIcon } from "@/components/ui/MaturaIcon";
import { accentStyles, type Accent } from "@/components/ui/FeaturePill";
import { cn } from "@/lib/cn";
import type { IconComponent } from "@/lib/icon";
import type { Exam } from "@/components/subjects/types";

/*
 * The small parts every subject page repeats: a topic's mark, and the row of
 * exams it is on.
 */

/** A topic's mark — dub's round program logo, drawn as the topic's icon in the subject's chip. */
export function TopicIcon({ icon: Icon, accent, size = "md" }: { icon: IconComponent; accent: Accent; size?: "md" | "lg" }) {
  return (
    <span
      aria-hidden
      className={cn(
        "grid shrink-0 place-items-center rounded-full border border-black/5",
        accentStyles[accent].chip,
        size === "lg" ? "size-14" : "size-12",
      )}
    >
      <Icon className={size === "lg" ? "size-6" : "size-5"} strokeWidth={2} />
    </span>
  );
}

const EXAM_LABEL: Record<Exam, string> = {
  e8: "E8",
  mp: "Podstawa",
  mr: "Rozszerzenie",
  mu: "Ustna",
};

/** Spelt out for screen readers. */
const EXAM_NAME: Record<Exam, string> = {
  e8: "egzamin ósmoklasisty",
  mp: "matura, poziom podstawowy",
  mr: "matura, poziom rozszerzony",
  mu: "matura ustna",
};

/** The exams a topic is on, each with its official mark. */
export function ExamTags({ exams, className }: { exams: Exam[]; className?: string }) {
  return (
    <ul className={cn("flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm text-charcoal", className)} aria-label="Na egzaminie">
      {exams.map((exam) => (
        <li key={exam} className="flex items-center gap-1.5">
          {exam === "e8" ? <E8Icon className="h-3 w-[17px]" /> : <MaturaIcon className="h-3 w-[16px]" />}
          <span aria-hidden>{EXAM_LABEL[exam]}</span>
          <span className="sr-only">{EXAM_NAME[exam]}</span>
        </li>
      ))}
    </ul>
  );
}

/** "1 temat", "3 tematy", "12 tematów". */
export function topicsLabel(count: number) {
  const tens = count % 100;
  const ones = count % 10;
  if (count === 1) return "1 temat";
  if (ones >= 2 && ones <= 4 && (tens < 12 || tens > 14)) return `${count} tematy`;
  return `${count} tematów`;
}
