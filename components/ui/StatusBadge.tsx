import { cn } from "@/lib/cn";

const styles = {
  completed: "bg-soft-mint text-[#166534]",
  pending: "bg-[#fef3c7] text-[#92400e]",
  active: "bg-sidebar-active text-deep-sapphire",
} as const;

const dots = {
  completed: "bg-vivid-green",
  pending: "bg-[#d97706]",
  active: "bg-electric-blue",
} as const;

/** Row-level state pill — tinted wash, colored dot, 9999px radius. */
export function StatusBadge({
  status,
  label,
}: {
  status: keyof typeof styles;
  label: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium leading-none",
        styles[status],
      )}
    >
      <span className={cn("size-1.5 rounded-full", dots[status])} aria-hidden />
      {label}
    </span>
  );
}
