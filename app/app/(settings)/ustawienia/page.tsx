import { ChevronDown, CloudUpload, Sigma } from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { Input } from "@/components/ui/Input";
import { SaveButton, SettingsCard } from "@/components/ui/SettingsCard";

/** Workspace "General" settings from the reference. */
export default function UstawieniaOgolnePage() {
  return (
    <>
      <PageHeader title="Ogólne" />
      <div className="flex-1 space-y-6 px-6 pb-16 pt-6">
        <SettingsCard
          title="Nazwa profilu"
          description="Tak nazywa się Twój profil nauki w Examax."
          footerHint="Maks. 32 znaki."
          footerAction={<SaveButton />}
        >
          <Input defaultValue="Matura 2027" className="max-w-md" />
        </SettingsCard>

        <SettingsCard
          title="Adres profilu"
          description="Unikalny adres Twojego profilu w Examax."
          footerHint="Tylko małe litery, cyfry i myślniki. Maks. 48 znaków."
          footerAction={<SaveButton />}
        >
          <Input defaultValue="matura-2027" className="max-w-md" />
        </SettingsCard>

        <SettingsCard
          title="Logo profilu"
          description={
            <>
              Logo Twojego profilu w Examax.
              <br />
              Kliknij, aby przesłać nowy obraz.
            </>
          }
          footerHint="Zalecany kwadrat. Formaty: .png, .jpg. Maks. 2 MB."
          footerAction={<SaveButton label="Zapisz zmiany" />}
          aside={
            <button
              type="button"
              aria-label="Prześlij logo"
              className="grid size-24 shrink-0 place-items-center rounded-full border border-ash text-fog transition-colors hover:border-smoke hover:text-charcoal"
            >
              <CloudUpload className="size-5" strokeWidth={1.6} />
            </button>
          }
        />

        <SettingsCard
          title="Domyślny przedmiot"
          description="Wybierz, który przedmiot otwiera się po wejściu do profilu."
          footerHint="Możesz to zmienić w każdej chwili."
          footerAction={<SaveButton />}
        >
          <button
            type="button"
            className="flex h-10 w-full max-w-md items-center justify-between rounded-inputs border border-ash bg-white px-3 text-body text-charcoal hover:border-smoke"
          >
            <span className="inline-flex items-center gap-2">
              <span
                aria-hidden
                className="grid size-5 place-items-center rounded-[5px] bg-soft-peach text-tangerine"
              >
                <Sigma className="size-3" />
              </span>
              Matematyka
            </span>
            <ChevronDown className="size-3.5 text-fog" aria-hidden />
          </button>
        </SettingsCard>
      </div>
    </>
  );
}
