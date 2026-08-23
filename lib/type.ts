/**
 * Shared type ramps that must stay identical across sections.
 *
 * `SECTION_H2` deliberately sets no line-height: Tailwind's own `text-5xl`
 * default (leading-none, i.e. 48px on a 48px font) is exactly what the
 * reference relies on for its section headings. The h1 is the only display
 * heading that overrides leading (1.15).
 */
export const SECTION_H2 =
  "font-satoshi text-3xl font-medium text-pretty sm:text-4xl md:text-5xl";
