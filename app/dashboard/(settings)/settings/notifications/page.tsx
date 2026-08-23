import {
  Bell,
  CalendarDays,
  CreditCard,
  GraduationCap,
  RefreshCcw,
  Sparkles,
} from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { SettingToggleRow } from "@/components/ui/SettingsCard";

/** The reference "Notifications" preference groups. */
export default function NotificationsPage() {
  return (
    <>
      <PageHeader title="Powiadomienia" help />
      <div className="flex-1 space-y-6 px-6 pb-16 pt-6">
        <section className="rounded-cards border border-ash bg-white">
          <h2 className="border-b border-ash px-6 py-4 text-body-xl font-semibold text-charcoal">
            Nauka
          </h2>
          <SettingToggleRow
            icon={RefreshCcw}
            title="Przypomnienie o powtórce"
            description="Codzienna wiadomość, gdy czekają na Ciebie zaplanowane powtórki."
          />
          <SettingToggleRow
            icon={CalendarDays}
            title="Tygodniowe podsumowanie"
            description="Cotygodniowy e-mail z postępami i planem na kolejny tydzień."
          />
        </section>

        <section className="rounded-cards border border-ash bg-white">
          <h2 className="border-b border-ash px-6 py-4 text-body-xl font-semibold text-charcoal">
            Konto
          </h2>
          <SettingToggleRow
            icon={CreditCard}
            title="Płatności i faktury"
            description="Potwierdzenia płatności i przypomnienia o odnowieniu subskrypcji."
          />
          <SettingToggleRow
            icon={Sparkles}
            title="Nowości w Examax"
            description="Informacje o nowych funkcjach i aktualizacjach bazy zadań."
          />
          <SettingToggleRow
            icon={GraduationCap}
            title="Wskazówki przed egzaminem"
            description="Praktyczne porady w tygodniach poprzedzających sesję CKE."
            defaultChecked={false}
          />
          <SettingToggleRow
            icon={Bell}
            title="Podsumowanie aktywności"
            description="Dzienny e-mail z liczbą rozwiązanych zadań i skutecznością."
          />
        </section>
      </div>
    </>
  );
}
