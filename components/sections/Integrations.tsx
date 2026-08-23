import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";

/** Subject glyphs — drawn, not iconified, so they read as product marks. */
const marks: Record<string, React.ReactNode> = {
  mat: <span className="font-satoshi text-body-xl font-medium">Σ</span>,
  pol: <span className="font-satoshi text-body-lg font-medium">Ab</span>,
  ang: <span className="font-satoshi text-body-lg font-medium">EN</span>,
  cke: <span className="font-geist-mono text-[10px] font-medium">CKE</span>,
};

/* Tile map — `null` cells are the "more on the way" ghosts of the reference.
   Row offsets stagger the grid so it reads as a field, not a table. */
const rows: Array<{ offset: boolean; cells: Array<keyof typeof marks | null> }> =
  [
    { offset: false, cells: [null, "cke", null] },
    { offset: true, cells: [null, "pol", "mat", "ang", null] },
    { offset: false, cells: [null, null, null, null, null] },
    { offset: true, cells: [null, null, null] },
  ];

/**
 * The reference's integrations field: an editorial column beside a staggered
 * grid of hairline tiles, most of them empty, a few carrying live marks.
 */
export function Integrations() {
  return (
    <section
      id="przedmioty"
      aria-labelledby="przedmioty-heading"
      className="col-rules relative overflow-hidden border-t border-ash bg-[#fafafa]"
    >
      <Container className="relative grid items-center gap-12 py-24 lg:grid-cols-2">
        <Reveal>
          <h2
            id="przedmioty-heading"
            className="max-w-sm font-satoshi text-heading-lg font-medium leading-[1.1] text-charcoal"
          >
            Wszystkie przedmioty w jednym miejscu
          </h2>
          <p className="mt-4 max-w-sm text-body-lg text-steel">
            Matematyka, polski i angielski są gotowe — z roadmapą, arkuszami i
            agentem. Kolejne przedmioty dokładamy przed każdą sesją.
          </p>
          <Button href="#cennik" variant="outline" size="lg" className="mt-8">
            Zobacz przedmioty
          </Button>
        </Reveal>

        <Reveal delay={100} aria-hidden>
          <div className="flex flex-col items-center gap-3">
            {rows.map((row, rowIndex) => (
              <div
                key={rowIndex}
                className={cn("flex gap-3", row.offset && "-translate-x-0")}
              >
                {row.cells.map((cell, cellIndex) => (
                  <span
                    key={cellIndex}
                    className={cn(
                      "grid size-14 place-items-center rounded-cards border transition-colors duration-200",
                      cell
                        ? "border-ash bg-white text-charcoal shadow-subtle"
                        : "border-ash/70 bg-white/40 text-transparent",
                    )}
                  >
                    {cell ? marks[cell] : null}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
