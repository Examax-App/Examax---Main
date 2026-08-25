import type { Metadata } from "next";
import Link from "next/link";
import { CloudUpload } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { FieldLabel, Input, PrefixInput } from "@/components/ui/Input";

export const metadata: Metadata = {
  title: "Stwórz profil nauki",
  description: "Skonfiguruj swój profil nauki w Examax.",
};

/** The reference "Create your workspace" onboarding — centered single form. */
export default function StartPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <div className="flex justify-center pt-8">
        <Link href="/" aria-label="Examax — strona główna">
          <Logo />
        </Link>
      </div>

      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-5 py-12">
        <h1 className="text-center text-heading-sm font-semibold text-charcoal">
          Stwórz swój profil nauki
        </h1>
        <p className="mt-2 text-center text-body-lg text-steel">
          Miejsce, w którym planujesz naukę i śledzisz postępy do egzaminu.{" "}
          <Link href="/#metoda" className="underline">
            Dowiedz się więcej.
          </Link>
        </p>

        <form className="mt-8">
          <FieldLabel htmlFor="start-name">Nazwa profilu</FieldLabel>
          <Input id="start-name" emphasis placeholder="Np. Matura 2027" />
          <p className="mt-1.5 text-[13px] text-fog">
            To nazwa Twojego profilu w Examax.
          </p>

          <div className="mt-5">
            <FieldLabel htmlFor="start-slug">Adres profilu</FieldLabel>
            <PrefixInput
              id="start-slug"
              prefix="app.examax.pl"
              placeholder="matura-2027"
            />
            <p className="mt-1.5 text-[13px] text-fog">
              Używany w linkach do Twoich zadań i wyników.
            </p>
          </div>

          <div className="mt-5">
            <FieldLabel>Zdjęcie profilu</FieldLabel>
            <div className="flex items-center gap-4">
              <button
                type="button"
                aria-label="Prześlij zdjęcie"
                className="grid size-16 shrink-0 place-items-center rounded-full border border-ash text-fog transition-colors hover:border-smoke hover:text-charcoal"
              >
                <CloudUpload className="size-4.5" strokeWidth={1.6} />
              </button>
              <div>
                <button
                  type="button"
                  className="rounded-buttons border border-ash bg-white px-3.5 py-2 text-body font-medium text-charcoal transition-colors hover:border-smoke hover:bg-paper-mist"
                >
                  Prześlij zdjęcie
                </button>
                <p className="mt-1.5 text-[13px] text-fog">
                  Zalecany rozmiar: 160×160 px
                </p>
              </div>
            </div>
          </div>

          <Link
            href="/app"
            className="mt-8 flex h-11 w-full items-center justify-center rounded-buttons bg-primary-action-fill text-body font-medium text-white shadow-subtle transition-colors hover:bg-graphite"
          >
            Utwórz profil
          </Link>
        </form>
      </div>
    </div>
  );
}
