import { PageHeader } from "@/components/app/PageHeader";
import { Input } from "@/components/ui/Input";
import { SaveButton, SettingsCard } from "@/components/ui/SettingsCard";

/** The reference account "General" page: name, e-mail, avatar, user ID. */
export default function KontoPage() {
  return (
    <>
      <PageHeader title="Twoje konto" />
      <div className="flex-1 space-y-6 px-6 pb-16 pt-6">
        <SettingsCard
          title="Twoje imię"
          description="Tak wyświetla się Twoje imię w Examax."
          footerHint="Maks. 32 znaki."
          footerAction={<SaveButton />}
        >
          <Input defaultValue="Franciszek Kierzkiewicz" className="max-w-md" />
        </SettingsCard>

        <SettingsCard
          title="Twój e-mail"
          description="Na ten adres logujesz się do Examax i otrzymujesz powiadomienia. Zmiana wymaga potwierdzenia."
          footerHint={
            <a href="/dashboard/settings/notifications" className="link-underline">
              Zarządzaj preferencjami e-mail ›
            </a>
          }
          footerAction={<SaveButton />}
        >
          <Input defaultValue="uczen@przyklad.pl" className="max-w-md" />
        </SettingsCard>

        <SettingsCard
          title="Twój awatar"
          description={
            <>
              Twój awatar w Examax.
              <br />
              Kliknij, aby przesłać nowe zdjęcie.
            </>
          }
          footerHint="Zalecany kwadrat. Formaty: .png, .jpg. Maks. 2 MB."
          footerAction={<SaveButton label="Zapisz zmiany" enabled />}
          aside={
            <button
              type="button"
              aria-label="Prześlij awatar"
              className="size-24 shrink-0 rounded-full border border-ash transition-colors hover:border-smoke"
            />
          }
        />

        <SettingsCard
          title="Twoje ID"
          description="Unikalny identyfikator Twojego konta w Examax."
          footerHint="Przyda się przy kontakcie z pomocą."
        >
          <Input readOnly defaultValue="usr_k4mX92pQ7nT1" className="max-w-md font-geist-mono" />
        </SettingsCard>
      </div>
    </>
  );
}
