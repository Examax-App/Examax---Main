import { Link2 } from "lucide-react";
import { cn } from "@/lib/cn";
import { GridSection } from "@/components/roadmap/sections";
import { LegalToc } from "@/components/legal/LegalToc";

/*
 * A legal page, as dub.co/legal/privacy sets one (read off its live DOM on
 * 2026-10-06; the full-page capture is `DesignRules/Privacy _ Dub.png`):
 *
 *   a ruled hero band — the title alone, Satoshi 48, in a 448px column whose
 *   edges fade in as they come down
 *   the document band — the text across three of four columns, the "On this
 *   page" rail in the fourth from 768px up, sticky under the navbar
 *   the numbered sections — a 32px ringed number on a 1px rail, the title
 *   (Satoshi 20) beside it, the body indented 48px; hovering the title swaps
 *   the number for a link mark, and the title links to its own section
 *   a short ruled band with the date of the last update, over the footer
 *
 * Shared by every page under /legal; each passes its own title, sections
 * and date.
 */

export type LegalSection = { id: string; title: string; body: React.ReactNode };

/**
 * dub's `prose prose-neutral`, measured: 16px on 28px in neutral-700, 20px
 * between paragraphs, bold runs semibold neutral-900, links medium
 * neutral-500 underlined 4px below and black on hover. Lists indent 32px
 * (numbered ones 26px) with 8px between items and neutral-300 bullets;
 * inline code is Geist Mono 13px in a hairline neutral-100 chip.
 */
const PROSE = cn(
  "text-[16px] leading-[28px] text-slate",
  "[&_p]:my-5",
  "[&_strong]:font-semibold [&_strong]:text-charcoal",
  "[&_a]:font-medium [&_a]:text-fog [&_a]:underline [&_a]:underline-offset-4 [&_a]:transition-colors [&_a:hover]:text-black",
  "[&_ul]:my-5 [&_ul]:list-disc [&_ul]:pl-8 [&_ol]:my-5 [&_ol]:list-decimal [&_ol]:pl-[26px] [&_li]:my-2 [&_ol>li]:pl-1.5",
  "[&_ul>li::marker]:text-smoke [&_ol>li::marker]:text-fog",
  "[&_code]:rounded-[5px] [&_code]:border [&_code]:border-ash [&_code]:bg-neutral-100 [&_code]:p-[3px] [&_code]:font-geist-mono [&_code]:text-[13px] [&_code]:text-charcoal",
);

/** "6 października 2026", from an ISO date. */
function formatDate(iso: string) {
  return new Intl.DateTimeFormat("pl-PL", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${iso}T00:00:00Z`));
}

/**
 * dub's table: a 12px-radius hairline frame that scrolls sideways if it
 * still cannot fit, 15.2px text, a neutral-50 header row in Satoshi semibold, and
 * hairlines between cells but none along the frame.
 */
export function LegalTable({ head, rows }: { head: [string, string]; rows: Array<[React.ReactNode, React.ReactNode]> }) {
  const CELL = "border-b border-r border-ash px-4 py-3 align-top last:border-r-0";
  /* Polish runs longer than dub's English: on a phone, body cells hyphenate so the table wraps rather than scrolls. Inline code never breaks. */
  const BODY = "text-steel max-sm:hyphens-auto [&_code]:hyphens-none [&_code]:whitespace-nowrap";
  return (
    <div className="my-6 max-w-full overflow-x-auto rounded-xl border border-ash">
      <table className="my-0 w-full border-separate border-spacing-0 text-left text-[0.95rem] leading-[1.7143]">
        <thead>
          <tr>
            {head.map((label) => (
              <th key={label} scope="col" className={cn(CELL, "bg-canvas-muted font-satoshi font-semibold text-charcoal")}>
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="[&>tr:last-child>td]:border-b-0">
          {rows.map(([term, definition], index) => (
            <tr key={index}>
              <td className={cn(CELL, BODY)}>{term}</td>
              <td className={cn(CELL, BODY)}>{definition}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function LegalDocument({
  title,
  intro,
  sections,
  updated,
}: {
  title: string;
  /** Text before the numbered sections; leave it out when the document opens on section 1. */
  intro?: React.ReactNode;
  sections: LegalSection[];
  /** ISO date of the last change, shown under the document. */
  updated: string;
}) {
  return (
    <>
      <section aria-labelledby="legal-heading" className="relative overflow-clip border-b border-ash bg-white px-4">
        <div className="relative z-0 mx-auto max-w-[var(--page-max-width)]">
          {/* The column's edges, fading in as they come down */}
          <div aria-hidden className="pointer-events-none absolute inset-0 border-x border-ash [mask-image:linear-gradient(transparent,black)]" />
          <div className="relative mx-auto flex max-w-md flex-col items-center px-4 py-16 text-center">
            <h1 id="legal-heading" className="mt-5 text-center font-satoshi text-4xl font-medium text-charcoal sm:whitespace-nowrap sm:text-5xl sm:leading-[1.15]">
              {title}
            </h1>
          </div>
        </div>
      </section>

      <GridSection>
        <div className="relative grid grid-cols-4 gap-10 bg-white p-8 sm:p-12 lg:gap-20">
          <article className="col-span-4 min-w-0 md:col-span-3">
            {intro ? <div className={cn(PROSE, "[&>p:first-child]:mt-0")}>{intro}</div> : null}
            <div className={cn("relative -mb-4", intro ? "pt-4" : null)}>
              {sections.map((section, index) => (
                <div key={section.id} className="relative">
                  {index < sections.length - 1 ? <div aria-hidden className="absolute bottom-0 left-4 top-0 w-px bg-gray-300" /> : null}
                  <a href={`#${section.id}`} className="focus-ring group relative flex items-center gap-4 rounded-[4px]">
                    <span className="flex size-8 flex-none items-center justify-center rounded-full border border-gray-200 bg-white">
                      <span className="font-satoshi font-bold text-gray-700 group-hover:hidden group-focus-visible:hidden">{index + 1}</span>
                      <Link2 className="hidden size-4 text-gray-600 group-hover:block group-focus-visible:block" aria-hidden />
                    </span>
                    <h2 id={section.id} className="scroll-mt-20! font-satoshi text-xl font-medium text-graphite">
                      {section.title}
                    </h2>
                  </a>
                  <div className={cn("ml-12 pb-4", PROSE)}>{section.body}</div>
                </div>
              ))}
            </div>
          </article>
          <aside className="hidden md:block">
            <LegalToc items={sections.map(({ id, title }) => ({ id, title }))} />
          </aside>
        </div>
      </GridSection>

      <GridSection>
        <p className="py-10 text-center text-sm text-fog">
          Ostatnia aktualizacja: <time dateTime={updated}>{formatDate(updated)}</time>
        </p>
      </GridSection>
    </>
  );
}
