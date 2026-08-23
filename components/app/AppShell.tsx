import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { IconRail } from "@/components/app/IconRail";

/**
 * The two-column app frame from the reference: gray canvas, icon rail +
 * sidebar on the left, and the page as a white, border-framed sheet with a
 * rounded left edge.
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
        <main className="relative flex h-full flex-col overflow-y-auto rounded-largecards border border-ash bg-white shadow-subtle">
          {/* Compact bar for viewports without the sidebar */}
          <div className="flex items-center justify-between border-b border-ash px-4 py-3 lg:hidden">
            <Link href="/dashboard" aria-label="Panel Examax">
              <Logo />
            </Link>
            <Link
              href="/"
              className="rounded-buttons border border-ash px-3 py-1.5 text-body font-medium text-charcoal"
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
