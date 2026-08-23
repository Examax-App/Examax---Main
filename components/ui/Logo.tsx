import { cn } from "@/lib/cn";
import { BrandMark } from "@/components/ui/BrandMark";

/**
 * The Examax logo: the brand mark, optionally followed by the wordmark.
 * The navbar runs mark-only; every other surface shows both.
 */
export function Logo({
  inverted = false,
  /** Set false for the mark on its own (navbar). */
  wordmark = true,
  className,
}: {
  inverted?: boolean;
  wordmark?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2",
        inverted ? "text-white" : "text-midnight-ink",
        className,
      )}
    >
      <BrandMark className={wordmark ? "h-5" : "h-6"} />
      {wordmark ? (
        <span className="font-satoshi text-[20px] font-bold leading-none tracking-tight">
          examax
        </span>
      ) : null}
    </span>
  );
}
