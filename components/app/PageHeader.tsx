import { CircleHelp } from "lucide-react";

/**
 * Sheet header row: page title, optional help bubble, right-hand actions.
 * No bottom rule — the body's top padding provides the separation.
 */
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
    <div className="flex min-h-14 shrink-0 items-center justify-between gap-4 px-5">
      <h1 className="flex items-center gap-2 text-body-xl font-semibold text-charcoal">
        {title}
        {help ? (
          <CircleHelp className="size-3.5 text-fog" strokeWidth={1.8} aria-hidden />
        ) : null}
      </h1>
      {actions}
    </div>
  );
}
