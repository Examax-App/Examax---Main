import { useId } from "react";

/**
 * Small decorative trend line with the brand-accent gradient used on the
 * stat cards. Purely presentational.
 */
export function Sparkline({ className }: { className?: string }) {
  const id = useId();
  return (
    <svg
      viewBox="0 0 96 32"
      fill="none"
      aria-hidden
      className={className}
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id={`${id}-stroke`} x1="0" y1="0" x2="96" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#6d28d9" />
          <stop offset="1" stopColor="#a78bfa" />
        </linearGradient>
        <linearGradient id={`${id}-fill`} x1="0" y1="0" x2="0" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#a78bfa" stopOpacity="0.25" />
          <stop offset="1" stopColor="#a78bfa" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d="M2 26C10 26 12 14 20 14s8 8 16 8 10-14 18-14 8 6 14 6 10-8 14-10 8-2 10-2"
        stroke={`url(#${id}-stroke)`}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M2 26C10 26 12 14 20 14s8 8 16 8 10-14 18-14 8 6 14 6 10-8 14-10 8-2 10-2V32H2Z"
        fill={`url(#${id}-fill)`}
      />
    </svg>
  );
}
