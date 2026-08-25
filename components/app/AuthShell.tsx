import Link from "next/link";
import { ChevronRight, Quote } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { Sparkline } from "@/components/ui/Sparkline";

/** Grayscale wordmark cloud standing in for the reference's customer logos. */
const cloudRows: string[][] = [
  ["Matematyka", "J. polski", "Angielski"],
  ["Fizyka", "Chemia", "Biologia"],
];

/**
 * The reference auth layout: form column with a soft spectrum-grid glow up
 * top, and a promo pane (case-study card + logo cloud) on the right.
 */
export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      {/* Form column */}
      <div className="relative flex flex-col">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-64"
        >
          <div
            className="absolute inset-0 opacity-60"
            style={{
              background:
                "radial-gradient(38% 90% at 40% 0%, rgba(58,139,253,0.14), transparent 70%), radial-gradient(38% 90% at 60% 0%, rgba(133,90,252,0.13), transparent 70%), radial-gradient(30% 80% at 80% 0%, rgba(255,95,95,0.10), transparent 70%)",
            }}
          />
          <div className="bg-grid mask-fade-bottom absolute inset-0" />
        </div>

        <div className="relative flex justify-center pt-8">
          <Link href="/" aria-label="Examax — strona główna">
            <Logo />
          </Link>
        </div>

        <div className="relative mx-auto flex w-full max-w-sm flex-1 flex-col justify-center px-5 py-12">
          {children}
        </div>

        <p className="relative pb-8 text-center text-body text-fog">
          Kontynuując, akceptujesz{" "}
          <a href="#" className="font-medium text-steel underline">
            Regulamin
          </a>{" "}
          i{" "}
          <a href="#" className="font-medium text-steel underline">
            Politykę prywatności
          </a>{" "}
          Examax.
        </p>
      </div>

      {/* Promo pane */}
      <div className="hidden flex-col justify-center border-l border-ash bg-[#fafafa] px-12 py-10 lg:flex">
        <div className="mx-auto w-full max-w-md">
          <div className="overflow-hidden rounded-largecards border border-ash bg-white shadow-ring">
            <div className="bg-dots relative bg-midnight-ink p-8">
              <Quote className="size-6 text-silver" aria-hidden />
              <p className="mt-4 text-body-xl font-medium leading-relaxed text-white">
                Otwieram Examax, widzę kolejny krok z roadmapy i po prostu go
                robię — bez godziny szukania materiałów.
              </p>
              <p className="mt-4 text-body text-silver">
                Uczennica klasy maturalnej · testy bety
              </p>
            </div>
            <div className="flex items-center justify-between gap-4 p-5">
              <div>
                <p className="text-body font-semibold text-charcoal">
                  Gotowość do egzaminu
                </p>
                <p className="text-[12px] text-fog">+9 p.p. w ostatnim miesiącu</p>
              </div>
              <Sparkline className="h-9 w-24" />
            </div>
          </div>

          <h2 className="mt-8 text-body-xl font-semibold leading-snug text-charcoal">
            Zobacz, jak uczniowie zamieniają plan w wyniki z Examax
          </h2>
          <Link
            href="/#metoda"
            className="mt-3 inline-flex items-center gap-1 rounded-buttons border border-ash bg-white px-4 py-2 text-body font-medium text-charcoal transition-colors hover:bg-paper-mist"
          >
            Czytaj więcej
            <ChevronRight className="size-3.5" aria-hidden />
          </Link>

          <div className="mt-10 space-y-4">
            {cloudRows.map((row, rowIndex) => (
              <div
                key={rowIndex}
                className="flex items-center justify-between gap-6"
              >
                {row.map((subject, index) => (
                  <span
                    key={subject}
                    className={
                      index === 1
                        ? "font-geist-mono text-body-lg font-medium text-steel"
                        : rowIndex === 0
                          ? "font-satoshi text-body-xl font-bold tracking-tight text-slate"
                          : "text-body-lg font-semibold uppercase tracking-[0.12em] text-fog"
                    }
                  >
                    {subject}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
