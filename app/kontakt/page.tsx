import type { Metadata } from "next";
import { ShieldUser } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FieldLabel, Input, Textarea } from "@/components/ui/Input";

export const metadata: Metadata = {
  title: "Kontakt",
  description:
    "Porozmawiaj z zespołem Examax — dostęp dla szkół, cennik dla klas i integracje.",
};

const wordmarks: string[][] = [
  ["Matematyka", "J. polski", "Angielski", "Fizyka", "Chemia"],
  ["Biologia", "Geografia", "Historia", "WOS", "Informatyka"],
];

/** The reference "Contact sales" page: icon, headline, framed form, logo band. */
export default function KontaktPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 pt-[72px]">
        <div className="mx-auto w-full max-w-[1200px] border-x border-ash/60 bg-white">
          <section className="border-b border-ash px-5 py-16 text-center sm:py-20">
            <span
              aria-hidden
              className="mx-auto grid size-12 place-items-center rounded-cards text-charcoal"
            >
              <ShieldUser className="size-8" strokeWidth={1.5} />
            </span>
            <h1 className="mx-auto mt-4 max-w-xl font-satoshi text-heading-lg font-medium leading-[1.11] text-charcoal sm:text-display sm:leading-none">
              Porozmawiaj z zespołem Examax
            </h1>
            <p className="mx-auto mt-5 max-w-md text-body-xl text-steel">
              Umów prezentację i porozmawiaj o dostępie dla całej klasy lub
              szkoły oraz o integracjach, których potrzebujesz.
            </p>
          </section>

          <section className="border-b border-ash">
            <form className="mx-auto max-w-2xl border-x border-ash/60 px-6 py-12 sm:px-12">
              <FieldLabel htmlFor="contact-email" required>
                Adres e-mail
              </FieldLabel>
              <Input
                id="contact-email"
                type="email"
                placeholder="ty@szkola.edu.pl"
              />

              <div className="mt-6">
                <FieldLabel htmlFor="contact-message" required>
                  W czym możemy pomóc?
                </FieldLabel>
                <Textarea
                  id="contact-message"
                  rows={5}
                  placeholder="Opowiedz nam o potrzebach swojej klasy lub szkoły"
                />
              </div>

              <button
                type="button"
                className="mt-6 rounded-buttons border border-ash bg-paper-mist px-4 py-2 text-body font-medium text-steel transition-colors hover:bg-ash/60 hover:text-charcoal"
              >
                Wyślij wiadomość
              </button>
            </form>
          </section>

          <section aria-label="Przedmioty w Examax" className="px-5 py-12">
            <div className="mx-auto max-w-3xl space-y-7">
              {wordmarks.map((row, rowIndex) => (
                <div
                  key={rowIndex}
                  className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4"
                >
                  {row.map((subject, index) => (
                    <span
                      key={subject}
                      className={
                        index % 3 === 0
                          ? "font-satoshi text-body-xl font-bold tracking-tight text-slate"
                          : index % 3 === 1
                            ? "font-geist-mono text-body-lg font-medium text-steel"
                            : "text-body font-semibold uppercase tracking-[0.14em] text-fog"
                      }
                    >
                      {subject}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
