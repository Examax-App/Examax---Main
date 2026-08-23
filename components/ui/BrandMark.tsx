import { cn } from "@/lib/cn";

/**
 * The Examax brand mark — three offset slabs, the same glyph the favicon set
 * uses (app/icon.svg). The viewBox is cropped tight to the ink so the mark
 * fills whatever box it is given; padding is the caller's business.
 *
 * Fill is `currentColor`, so it inverts by setting a text colour.
 */
export function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 224 202"
      fill="currentColor"
      role="presentation"
      aria-hidden
      className={cn("shrink-0", className)}
    >
      <path d="M52 0h172l-52 54H0z" />
      <path d="M52 74h172l-52 54H0z" />
      <path d="M52 148h172l-52 54H0z" />
    </svg>
  );
}
