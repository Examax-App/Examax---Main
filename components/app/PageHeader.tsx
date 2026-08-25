import { CircleHelp } from "lucide-react";

/** Sheet header row: page title, optional help bubble, right-hand actions. */
export function PageHeader({
  title,
  help = false,
  actions,
}: {
  title: string;
  help?: boolean;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex min-h-16 shrink-0 items-center justify-between gap-4 border-b border-ash px-6">
      <h1 className="flex items-center gap-2 text-subheading font-semibold text-charcoal">
        {title}
        {help ? (
          <CircleHelp className="size-4 text-fog" strokeWidth={1.8} aria-hidden />
        ) : null}
      </h1>
      {actions}
    </div>
  );
}
