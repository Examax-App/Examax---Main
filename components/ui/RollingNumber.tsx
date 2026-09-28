import { cn } from "@/lib/cn";

const DIGITS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

/** Polish grouping with a narrow no-break space, as CountUp formats it. */
const groupPl = (value: number) => value.toLocaleString("pl-PL").replace(/ /g, " ");

/**
 * A figure whose digits roll to their new value, the reference's live
 * counters (dub.co uses NumberFlow). Each digit is a 0–9 strip in a one-line
 * window, so a change slides the strip rather than swapping the text.
 *
 * Digits are keyed from the right, so the units stay the units when the
 * figure gains a digit. `lineHeight` must match the text's line height in
 * pixels. Reduced motion drops the slide and shows the new figure at once.
 */
export function RollingNumber({
  value,
  lineHeight,
  className,
}: {
  value: number;
  lineHeight: number;
  className?: string;
}) {
  const text = groupPl(value);
  const chars = [...text];
  return (
    <span className={cn("inline-flex tabular-nums", className)} style={{ lineHeight: `${lineHeight}px` }}>
      <span className="sr-only">{text}</span>
      {chars.map((char, index) => {
        const key = chars.length - index;
        if (!DIGITS.includes(char)) {
          return (
            <span key={`s${key}`} aria-hidden>
              {char}
            </span>
          );
        }
        return (
          <span key={`d${key}`} aria-hidden className="relative inline-block overflow-hidden" style={{ height: lineHeight }}>
            <span
              className="flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none"
              style={{ transform: `translateY(${-Number(char) * lineHeight}px)` }}
            >
              {DIGITS.map((digit) => (
                <span key={digit} style={{ height: lineHeight }}>
                  {digit}
                </span>
              ))}
            </span>
          </span>
        );
      })}
    </span>
  );
}
