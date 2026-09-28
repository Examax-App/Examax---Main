import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { IconComponent } from "@/lib/icon";

/**
 * The shell every not-yet-written marketing page renders.
 *
 * The four "Materiały" destinations are real routes with no content behind
 * them yet, so they share one scaffold rather than four near-identical files:
 * a route supplies its icon, its heading and the list of what will eventually
 * live there, and nothing else. When a page is actually built it stops calling
 * this and becomes a page of its own — this is a stand-in, not a base class.
 *
 * Structure is the marketing-page convention already set by /contact and
 * /help: the 1200px column with its `border-x` edges, a centred icon over a
 * Satoshi display headline, and hairline-divided sections beneath. Nothing
 * here is new design — every value is a token and every block has a precedent.
 */
export function PlaceholderPage({
  icon: Icon,
  title,
  description,
  planned,
}: {
  icon: IconComponent;
  title: string;
  description: string;
  /** What this page will hold once it is written — one line per block. */
  planned: string[];
}) {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-buttons focus:bg-midnight-ink focus:px-4 focus:py-2 focus:text-white"
      >
        Przejdź do treści
      </a>
      <Navbar />
      <main id="main" className="flex-1">
        <div className="mx-auto w-full max-w-[1200px] border-x border-ash/60 bg-white">
          <section className="border-b border-ash px-5 py-16 text-center sm:py-20">
            <span
              aria-hidden
              className="mx-auto grid size-12 place-items-center rounded-cards text-charcoal"
            >
              <Icon className="size-8" strokeWidth={1.5} />
            </span>
            <h1 className="mx-auto mt-4 max-w-xl font-satoshi text-heading-lg font-medium leading-[1.11] text-charcoal sm:text-display sm:leading-none">
              {title}
            </h1>
            <p className="mx-auto mt-5 max-w-md text-body-xl text-steel">
              {description}
            </p>
          </section>

          <section className="px-5 py-12 sm:px-16 sm:py-16">
            {/* Muted alt card on the white canvas, held by a hairline rather
                than elevation — DESIGN.md's border-first rule. */}
            <div className="mx-auto max-w-2xl rounded-largecards border border-ash bg-canvas-muted p-6 sm:p-8">
              <StatusBadge status="pending" label="Wkrótce" />

              <h2 className="mt-4 text-subheading font-medium text-charcoal">
                Ta sekcja jest w przygotowaniu
              </h2>
              <p className="mt-2 text-body-lg text-steel">
                Pracujemy nad treścią. Docelowo znajdziesz tutaj:
              </p>

              <ul className="mt-6 border-t border-ash">
                {planned.map((item) => (
                  <li
                    key={item}
                    className="border-b border-ash py-3 text-body text-steel last:border-b-0 last:pb-0"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
