import type { Metadata } from "next";
import Link from "next/link";
import { prefetchFor } from "@/lib/routes";
import { Bug, FileText, MessagesSquare, ShieldUser } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ContactHero, SystemsPill } from "@/components/contact/pieces";
import type { IconComponent } from "@/lib/icon";

export const metadata: Metadata = {
  title: "Kontakt",
  description: "Porozmawiaj z zespołem Examax, uzyskaj pomoc, zadaj pytanie albo zgłoś problem.",
  openGraph: { title: "Kontakt — Examax", description: "W czym możemy pomóc?", url: "https://examax.app/contact" },
};

type Option = { icon: IconComponent; title: string; description: string; cta: string; href: string };

/** dub's four, in its order: Sales, Support, Questions (to the documentation, as dub's goes to its help articles), and — in Developer Docs' place — reporting a problem. */
const OPTIONS: Option[] = [
  {
    icon: ShieldUser,
    title: "Sprzedaż",
    description: "Porozmawiaj z nami o dostępie dla szkoły lub klasy, cenach dla grup i wdrożeniu.",
    cta: "Porozmawiaj z nami",
    href: "/contact/sales",
  },
  {
    icon: MessagesSquare,
    title: "Wsparcie",
    description: "Napisz do nas w sprawie konta, logowania lub płatności albo podziel się opinią.",
    cta: "Uzyskaj pomoc",
    href: "/contact/support",
  },
  {
    icon: FileText,
    title: "Pytania",
    description: "Masz pytania o Examax? Zajrzyj do naszej dokumentacji — znajdziesz tam przewodniki po platformie.",
    cta: "Przejdź do dokumentacji",
    href: "/docs",
  },
  {
    icon: Bug,
    title: "Zgłoś problem",
    description: "Znalazłeś błąd w zadaniu, rozwiązaniu albo w aplikacji? Daj znać, a poprawimy go w pierwszej kolejności.",
    cta: "Zgłoś problem",
    href: "/contact/support?temat=problem",
  },
];

/**
 * /contact — a one-to-one of dub.co/contact (read off its live DOM on
 * 2026-10-03; the capture is `DesignRules/Contact _ Dub.png`): a ruled hero
 * — the question, a line, the status pill — then a two-by-two of cells on
 * 1px rules, each with a 40px stroke-1 icon, a 20px title, a muted line and
 * a black button. Sales and Support open their own pages, as dub's do;
 * Questions points to the documentation (/docs, not built yet, so the 404
 * for now); the problem report opens Support with that topic picked.
 */
export default function ContactPage() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-buttons focus:bg-midnight-ink focus:px-4 focus:py-2 focus:text-white"
      >
        Przejdź do treści
      </a>
      <Navbar />
      <main id="main" className="flex-1 bg-white">
        <ContactHero title="W czym możemy pomóc?" sub="Napisz do zespołu Examax w sprawie współpracy, wsparcia albo zadaj nam pytanie.">
          <SystemsPill />
        </ContactHero>

        <section aria-label="Sposoby kontaktu" className="relative overflow-clip border-b border-ash bg-white px-4">
          <div className="relative z-0 mx-auto max-w-[var(--page-max-width)] border-x border-ash">
            <ul className="grid grid-cols-1 gap-px bg-ash md:grid-cols-2">
              {OPTIONS.map((option) => (
                <li key={option.title} className="relative space-y-8 bg-white p-8 sm:p-12">
                  <option.icon className="size-10 text-charcoal" strokeWidth={1} aria-hidden />
                  <div>
                    <h2 className="text-xl font-semibold text-charcoal">{option.title}</h2>
                    <p className="mt-2 max-w-sm text-pretty text-base text-fog">{option.description}</p>
                  </div>
                  <Link
                    href={option.href}
                    prefetch={prefetchFor(option.href)}
                    className="focus-ring inline-flex h-9 w-fit items-center justify-center whitespace-nowrap rounded-lg border border-black bg-black px-4 text-sm font-medium text-white transition-all hover:ring-4 hover:ring-ash"
                  >
                    {option.cta}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
