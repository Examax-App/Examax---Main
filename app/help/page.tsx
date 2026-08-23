import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, MessagesSquare } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Pomoc",
  description:
    "Napisz do nas w sprawie produktu, płatności lub podziel się opinią o Examax.",
};

/** The reference "Support" page: icon, headline, chat panel, two link cells. */
export default function PomocPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto w-full max-w-[1200px] border-x border-ash/60 bg-white">
          <section className="border-b border-ash px-5 py-16 text-center sm:py-20">
            <span
              aria-hidden
              className="mx-auto grid size-12 place-items-center rounded-cards text-charcoal"
            >
              <MessagesSquare className="size-8" strokeWidth={1.5} />
            </span>
            <h1 className="mt-4 font-satoshi text-heading-lg font-medium leading-[1.11] text-charcoal sm:text-display sm:leading-none">
              Pomoc
            </h1>
            <p className="mx-auto mt-5 max-w-md text-body-xl text-steel">
              Napisz do nas w sprawie produktu, płatności lub podziel się
              opinią.
            </p>
          </section>

          <section className="border-b border-ash px-5 py-10 sm:px-16">
            <div className="mx-auto grid min-h-96 max-w-3xl place-items-center rounded-cards bg-paper-mist text-center">
              <p className="max-w-xs text-body text-fog">
                Tu pojawi się okno czatu.
                <br />
                Do tego czasu napisz na{" "}
                <a
                  href="mailto:pomoc@examax.app"
                  className="font-medium text-steel underline"
                >
                  pomoc@examax.app
                </a>
              </p>
            </div>
          </section>

          <section className="grid sm:grid-cols-2">
            <Link
              href="#"
              className="group flex items-center justify-center gap-1.5 border-b border-ash px-5 py-8 text-body-lg font-medium text-steel transition-colors hover:bg-[#fafafa] hover:text-charcoal sm:border-b-0 sm:border-r"
            >
              Przejdź do centrum pomocy
              <ChevronRight
                className="size-4 transition-transform group-hover:translate-x-0.5"
                aria-hidden
              />
            </Link>
            <Link
              href="/contact"
              className="group flex items-center justify-center gap-1.5 px-5 py-8 text-body-lg font-medium text-steel transition-colors hover:bg-[#fafafa] hover:text-charcoal"
            >
              Porozmawiaj z zespołem Examax
              <ChevronRight
                className="size-4 transition-transform group-hover:translate-x-0.5"
                aria-hidden
              />
            </Link>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
