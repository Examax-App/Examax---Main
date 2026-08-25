import { useId } from "react";
import { cn } from "@/lib/cn";

const FLAT = "M0 150 L720 150";
const TREND =
  "M0 138 C40 132 60 120 100 118 S170 124 210 112 S290 84 330 88 S400 96 440 78 S520 44 560 50 S650 30 720 22";

/**
 * Decorative analytics chart — electric-blue line over a fading fill, dashed
 * gridlines, muted axis labels. `flat` renders the zero-state line from the
 * reference's empty dashboard.
 */
export function AreaChart({
  flat = false,
  xLabels = ["19:00", "0:00", "5:00", "10:00", "15:00"],
  className,
}: {
  flat?: boolean;
  xLabels?: string[];
  className?: string;
}) {
  const id = useId();

  return (
    <div className={cn("relative", className)}>
      <svg
        viewBox="0 0 720 160"
        preserveAspectRatio="none"
        aria-hidden
        className="h-full min-h-40 w-full"
      >
        <defs>
          <linearGradient id={`${id}-fill`} x1="0" y1="0" x2="0" y2="160" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#2563eb" stopOpacity="0.16" />
            <stop offset="1" stopColor="#2563eb" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[10, 45, 80, 115, 150].map((y) => (
          <line
            key={y}
            x1="0"
            x2="720"
            y1={y}
            y2={y}
            stroke="#e5e5e5"
            strokeWidth="1"
            strokeDasharray="3 5"
          />
        ))}
        {!flat ? (
          <path d={`${TREND} L720 160 L0 160 Z`} fill={`url(#${id}-fill)`} />
        ) : null}
        <path
          d={flat ? FLAT : TREND}
          fill="none"
          stroke="#2563eb"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
        <circle
          cx="720"
          cy={flat ? 150 : 22}
          r="3.5"
          fill="#2563eb"
          stroke="#ffffff"
          strokeWidth="1.5"
        />
      </svg>
      <div
        aria-hidden
        className="mt-2 flex justify-between font-inter text-[11px] text-fog"
      >
        {xLabels.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
    </div>
  );
}
