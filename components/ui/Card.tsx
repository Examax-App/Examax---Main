import { cn } from "@/lib/cn";

/**
 * Card vocabulary per DESIGN.md — border-first elevation:
 * - DashboardCard: white, 1px ash border, 12px radius, no shadow
 * - MutedCard: #fafafa, 16px radius, no border
 * - ElevatedCard: white, 16px radius, 4px outer-ring shadow
 * - MockupFrame: product-screenshot window with the floating-panel ring
 */
export function DashboardCard({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("rounded-cards border border-ash bg-white", className)}>
      {children}
    </div>
  );
}

export function MutedCard({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("rounded-largecards bg-[#fafafa] p-4", className)}>
      {children}
    </div>
  );
}

export function ElevatedCard({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn("rounded-largecards bg-white p-4 shadow-ring", className)}
    >
      {children}
    </div>
  );
}

export function MockupFrame({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-largecards border border-ash bg-white shadow-ring",
        className,
      )}
    >
      {children}
    </div>
  );
}
