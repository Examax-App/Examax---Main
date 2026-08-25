"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  mainNav,
  settingsNav,
  USAGE_RESET_NOTE,
  usageRows,
} from "@/lib/appNav";
import { cn } from "@/lib/cn";

/**
 * App sidebar on the gray canvas — quiet items, light-blue active fill
 * (reference: sidebar active state is a soft chromatic wash, not a border).
 * The nav config is resolved here (not passed in) so server layouts only
 * hand over serializable props.
 */
export function Sidebar({
  title,
  backHref,
  nav,
  showUsage = false,
}: {
  /** Product-area label, e.g. "Nauka" ("Short Links" in the reference). */
  title: string;
  /** Renders the settings-style back chevron before the title. */
  backHref?: string;
  nav: "main" | "settings";
  showUsage?: boolean;
}) {
  const pathname = usePathname();
  const groups = nav === "main" ? mainNav : settingsNav;

  return (
    <div className="flex h-full min-h-0 flex-col px-3 pb-3">
      <div className="flex items-center gap-2 px-2 pb-4 pt-5">
        {backHref ? (
          <Link
            href={backHref}
            aria-label="Wróć"
            className="grid size-7 place-items-center rounded-full bg-ash/70 text-steel transition-colors hover:bg-ash hover:text-charcoal"
          >
            <ChevronLeft className="size-4" />
          </Link>
        ) : null}
        <p
          className={cn(
            "font-medium",
            backHref
              ? "text-body-xl font-semibold text-charcoal"
              : "text-body-lg text-steel",
          )}
        >
          {title}
        </p>
      </div>

      <nav className="min-h-0 flex-1 space-y-6 overflow-y-auto">
        {groups.map((group, groupIndex) => (
          <div key={group.heading || groupIndex}>
            {group.heading ? (
              <p className="px-2 pb-2 text-body text-fog">{group.heading}</p>
            ) : null}
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const active = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex items-center gap-2.5 rounded-buttons px-2 py-2 text-body font-medium transition-colors",
                        active
                          ? "bg-sidebar-active text-electric-blue"
                          : "text-graphite hover:bg-ash/50",
                      )}
                    >
                      <item.icon
                        className={cn(
                          "size-4",
                          active ? "text-electric-blue" : "text-steel",
                        )}
                        strokeWidth={1.8}
                        aria-hidden
                      />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {showUsage ? (
        <div className="mt-4 border-t border-ash pt-4">
          <button
            type="button"
            className="flex items-center gap-1 px-1 text-body font-medium text-steel transition-colors hover:text-charcoal"
          >
            Zużycie
            <ChevronRight className="size-3.5" aria-hidden />
          </button>
          <ul className="mt-3 space-y-2.5 px-1">
            {usageRows.map((row) => (
              <li key={row.label}>
                <div className="flex items-center justify-between text-body">
                  <span className="flex items-center gap-2 text-graphite">
                    <row.icon className="size-3.5 text-steel" aria-hidden />
                    {row.label}
                  </span>
                  <span className="text-steel">
                    {row.used} z {row.limit}
                  </span>
                </div>
                <div className="mt-1.5 h-px w-full bg-ash" aria-hidden />
              </li>
            ))}
          </ul>
          <p className="mt-2 px-1 text-[12px] text-fog">{USAGE_RESET_NOTE}</p>
          <Link
            href="/#cennik"
            className="mt-3 block rounded-buttons bg-primary-action-fill py-2 text-center text-body font-medium text-white shadow-subtle transition-colors hover:bg-graphite"
          >
            Ulepsz plan
          </Link>
        </div>
      ) : null}
    </div>
  );
}
