import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { IconRail } from "@/components/app/IconRail";

/**
 * The two-column app frame from the reference: gray canvas, icon rail +
 * sidebar on the left, and the page as a white sheet. The sheet is separated
 * from the canvas by tone and a soft lift rather than an outline — no hard
 * border on the container or the rail.
 */
export function AppShell({
  sidebar,
  children,
}: {
  sidebar: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-dvh w-full bg-[#f3f3f2] text-charcoal">
      <IconRail />
      <div className="hidden w-60 shrink-0 flex-col lg:flex">{sidebar}</div>
      <div className="min-w-0 flex-1 py-2 pr-2 pl-2 lg:pl-0">
        <main className="relative flex h-full flex-col overflow-y-auto rounded-largecards bg-white shadow-subtle">
          {/* Compact bar for viewports without the sidebar */}
          <div className="flex items-center justify-between px-4 py-2.5 lg:hidden">
            <Link href="/dashboard" aria-label="Panel Examax">
              <Logo />
            </Link>
            <Link
              href="/"
              className="rounded-buttons border border-ash px-2.5 py-1 text-body-sm font-medium text-charcoal"
            >
              Strona główna
            </Link>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
