import { Check, Minus } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { AccentTile, type Accent } from "@/components/ui/FeaturePill";
import { cn } from "@/lib/cn";
import type { IconComponent } from "@/lib/icon";
import { SECTION_H2 } from "@/lib/type";

/** A cell is a yes, a no, or a short qualifier. */
export type CompareCell = boolean | string;

export type CompareRow = {
  label: string;
  cells: [CompareCell, CompareCell, CompareCell, CompareCell];
};

/** The soft wash behind the Examax column. Only the accents a product page
    actually leads on are listed; add one when a page needs it. */
const columnTint: Partial<Record<Accent, string>> = {
  green: "bg-soft-mint/40",
  blue: "bg-soft-blue/40",
  lavender: "bg-soft-violet/50",
  tangerine: "bg-soft-peach/50",
};

function CellValue({ value }: { value: CompareCell }) {
  if (value === true) {
    return (
      <span className="mx-auto grid size-5 place-items-center rounded-full bg-soft-mint text-[#166534]">
        <Check className="size-3" strokeWidth={3} aria-hidden />
        <span className="sr-only">tak</span>
      </span>
    );
  }
  if (value === false) {
    return (
      <span className="mx-auto grid size-5 place-items-center rounded-full bg-paper-mist text-silver">
        <Minus className="size-3" strokeWidth={3} aria-hidden />
        <span className="sr-only">nie</span>
      </span>
    );
  }
  return <span className="text-[12px] text-steel">{value}</span>;
}

/**
 * The honest comparison every product page closes its argument with.
 *
 * The alternatives are not straw men: whichever of them beats Examax at
 * something is allowed to say so, which is the only reason a reader believes
 * the rest of the column.
 *
 * The table scrolls inside its own container rather than reflowing — four
 * columns of qualifiers do not survive being stacked, and a scroll cue is
 * honest about there being more to the right.
 */
export function CompareGrid({
  id,
  icon,
  accent,
  heading,
  sub,
  columns,
  rows,
  caption,
}: {
  id: string;
  /** The glyph on the Examax column header — the product's own mark. */
  icon: IconComponent;
  accent: Accent;
  heading: string;
  sub: string;
  /** Four headers; the first is always Examax. */
  columns: [string, string, string, string];
  rows: CompareRow[];
  /** Screen-reader summary of what is being compared. */
  caption: string;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className="col-rules border-t border-ash bg-white"
    >
      <Container className="py-20">
        <Reveal>
          <div className="text-center">
            <h2
              id={`${id}-heading`}
              className={cn("mx-auto max-w-xl text-charcoal", SECTION_H2)}
            >
              {heading}
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-pretty text-body-xl text-fog">
              {sub}
            </p>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div className="mt-12 overflow-x-auto">
            <table className="w-full min-w-[46rem] border-collapse text-left">
              <caption className="sr-only">{caption}</caption>
              <thead>
                <tr>
                  <th scope="col" className="w-[34%] pb-4 pr-4" />
                  {columns.map((column, index) => (
                    <th
                      key={column}
                      scope="col"
                      className={cn(
                        "px-4 pb-4 text-center align-bottom",
                        index === 0 && cn("pt-4", columnTint[accent]),
                      )}
                    >
                      {index === 0 ? (
                        <span className="flex items-center justify-center gap-2">
                          <AccentTile icon={icon} accent={accent} />
                          <span className="text-body font-semibold text-charcoal">
                            {column}
                          </span>
                        </span>
                      ) : (
                        <span className="text-body font-medium text-fog">
                          {column}
                        </span>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.label} className="border-t border-ash">
                    <th
                      scope="row"
                      className="py-4 pr-4 text-body font-normal text-charcoal"
                    >
                      {row.label}
                    </th>
                    {row.cells.map((cell, index) => (
                      <td
                        key={index}
                        className={cn(
                          "px-4 py-4 text-center",
                          index === 0 && columnTint[accent],
                        )}
                      >
                        <CellValue value={cell} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
