import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";
import { Toggle } from "@/components/ui/Toggle";

/**
 * Settings form card from the reference: title + description, a control
 * area, and a gray footer strip with a hint on the left and the action on
 * the right.
 */
export function SettingsCard({
  title,
  description,
  footerHint,
  footerAction,
  aside,
  className,
  children,
}: {
  title: string;
  description?: React.ReactNode;
  footerHint?: React.ReactNode;
  footerAction?: React.ReactNode;
  /** Right-hand slot in the body (avatar circle, logo uploader). */
  aside?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className={cn("rounded-cards border border-ash bg-white", className)}>
      <div className="flex items-start justify-between gap-5 p-5">
        <div className="min-w-0 max-w-lg flex-1">
          <h2 className="text-body-lg font-semibold text-charcoal">{title}</h2>
          {description ? (
            <p className="mt-1.5 text-body-sm text-steel">{description}</p>
          ) : null}
          {children ? <div className="mt-3.5">{children}</div> : null}
        </div>
        {aside}
      </div>
      {footerHint || footerAction ? (
        <div className="flex min-h-12 items-center justify-between gap-4 rounded-b-cards border-t border-ash bg-canvas-muted px-5 py-2.5">
          <p className="text-body-sm text-steel">{footerHint}</p>
          {footerAction}
        </div>
      ) : null}
    </section>
  );
}

/** Disabled-looking gray "Save" button used across the settings forms. */
export function SaveButton({
  label = "Zapisz zmiany",
  enabled = false,
}: {
  label?: string;
  enabled?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={!enabled}
      className={cn(
        "shrink-0 rounded-buttons px-3.5 py-1.5 text-body-sm font-medium transition-all duration-200",
        enabled
          ? "bg-primary-action-fill text-white shadow-subtle hover:bg-graphite"
          : "border border-ash bg-paper-mist text-silver",
      )}
    >
      {label}
    </button>
  );
}

/**
 * Notification-preference row: outlined icon disc, title + helper text, and
 * a blue switch on the right.
 */
export function SettingToggleRow({
  icon: Icon,
  title,
  description,
  defaultChecked = true,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  defaultChecked?: boolean;
}) {
  return (
    <div className="flex items-center gap-3.5 border-b border-ash/70 px-5 py-4 last:border-b-0">
      <span
        aria-hidden
        className="grid size-9 shrink-0 place-items-center rounded-full border border-ash bg-white text-charcoal"
      >
        <Icon className="size-4" strokeWidth={1.7} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-body font-medium text-charcoal">{title}</p>
        <p className="text-body-sm text-fog">{description}</p>
      </div>
      <Toggle label={title} defaultChecked={defaultChecked} />
    </div>
  );
}
