/*
 * Shared by the landing's simulation film, the /simulation walkthrough film
 * and the hero's finished sheet.
 */

/*
 * Printed maths, typeset the way CKE's sheets set it: variables slanted,
 * fractions stacked on the math axis, roots with their bar over the
 * radicand, relations spaced. Everything scales in em, so the same pieces
 * serve the tasks (15px) and the formula sheet (13px).
 */

/**
 * A variable, slanted as a math italic (Inter's own italic is a 10° oblique).
 * The slant leans the letter into its right-hand neighbour, so it gets a
 * hair of room on that side, as an italic correction would.
 */
export function V({ children }: { children: React.ReactNode }) {
  return <span className="mr-[0.06em] inline-block -skew-x-[10deg]">{children}</span>;
}

/** A stacked fraction; its bar sits on the math axis, level with a minus sign. */
export function Frac({ n, d }: { n: React.ReactNode; d: React.ReactNode }) {
  return (
    <span className="mx-[0.12em] inline-flex flex-col text-center align-middle text-[0.8em] leading-[1.3]">
      <span className="px-[0.2em]">{n}</span>
      <span className="border-t border-current px-[0.2em]">{d}</span>
    </span>
  );
}

/** A square root as it is printed: one stroke runs into the bar over the radicand. */
export function Radical({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex h-[1.3em] items-stretch align-middle">
      <svg viewBox="0 0 9 20" fill="none" preserveAspectRatio="none" className="h-full w-[0.58em] shrink-0 overflow-visible">
        <path d="M0.75 12.5L2.5 11.5L4.75 19L8.25 0.75H9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      </svg>
      <span className="flex items-end border-t-[0.08em] border-current pl-[0.05em] pr-[0.12em] leading-[1.15]">{children}</span>
    </span>
  );
}

/** A bracket grown to hold a root or a fraction. */
export function Tall({ children }: { children: string }) {
  return <span className="inline-block scale-y-[1.3] font-light">{children}</span>;
}
