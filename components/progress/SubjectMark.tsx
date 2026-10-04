import { accentStyles } from "@/components/ui/FeaturePill";
import { SUBJECTS, type SubjectKey } from "@/components/progress/events";
import { cn } from "@/lib/cn";

/**
 * A subject's chip at 14px — the AccentTile treatment (400 tint, deep glyph,
 * black/5 hairline) one step under its `xs` size, for the pills and bar rows
 * where the reference sets a 12–14px flag.
 */
export function SubjectMark({ subject, className }: { subject: SubjectKey; className?: string }) {
  const { icon: Icon, accent } = SUBJECTS[subject];
  return (
    <span aria-hidden className={cn("grid size-3.5 shrink-0 place-items-center rounded-[3.5px] border border-black/5", accentStyles[accent].chip, className)}>
      <Icon className="size-2.5" strokeWidth={2.5} />
    </span>
  );
}
