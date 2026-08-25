import { CalendarDays, ChevronDown, Lock, ScanSearch } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/app/PageHeader";
import { Toggle } from "@/components/ui/Toggle";

function ProviderRow({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof Lock;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-cards border border-ash p-4">
      <div className="flex items-center gap-3">
        <span
          aria-hidden
          className="grid size-10 place-items-center rounded-full border border-ash bg-white text-charcoal"
        >
          <Icon className="size-4.5" strokeWidth={1.7} />
        </span>
        <div>
          <p className="text-body-lg font-semibold text-charcoal">{title}</p>
          <p className="text-body text-fog">{description}</p>
        </div>
      </div>
      <button
        type="button"
        disabled
        className="rounded-buttons border border-ash bg-paper-mist px-4 py-2 text-body font-medium text-silver"
      >
        Konfiguruj
      </button>
    </div>
  );
}

/** The reference "Security" page: SSO, directory sync, audit logs. */
export default function BezpieczenstwoPage() {
  return (
    <>
      <PageHeader title="Bezpieczeństwo" />
      <div className="flex-1 space-y-6 px-6 pb-16 pt-6">
        <section className="rounded-cards border border-ash bg-white">
          <div className="p-6">
            <h2 className="text-body-xl font-semibold text-charcoal">
              Logowanie jednokrotne (SSO)
            </h2>
            <p className="mt-1.5 text-body text-steel">
              Skonfiguruj logowanie SSO, aby uczniowie mogli wchodzić do
              Examax przez konto swojej szkoły.
            </p>
            <div className="mt-4">
              <ProviderRow
                icon={Lock}
                title="SAML"
                description="Wybierz dostawcę tożsamości, aby zacząć."
              />
            </div>
            <div className="mt-3 flex items-center justify-between gap-4 rounded-cards border border-ash p-4">
              <p className="text-body text-charcoal">
                Wymagaj logowania SSO, aby korzystać z tego profilu
              </p>
              <Toggle label="Wymagaj logowania SSO" />
            </div>
          </div>
          <div className="rounded-b-cards border-t border-ash bg-[#fafafa] px-6 py-3.5">
            <a href="#" className="link-underline text-body text-steel">
              Dowiedz się więcej o logowaniu SSO
            </a>
          </div>
        </section>

        <section className="rounded-cards border border-ash bg-white">
          <div className="p-6">
            <h2 className="text-body-xl font-semibold text-charcoal">
              Synchronizacja kont
            </h2>
            <p className="mt-1.5 text-body text-steel">
              Automatycznie dodawaj i usuwaj konta uczniów z systemu szkoły.
            </p>
            <div className="mt-4">
              <ProviderRow
                icon={ScanSearch}
                title="SCIM"
                description="Wybierz dostawcę tożsamości, aby zacząć."
              />
            </div>
          </div>
          <div className="rounded-b-cards border-t border-ash bg-[#fafafa] px-6 py-3.5">
            <a href="#" className="link-underline text-body text-steel">
              Dowiedz się więcej o synchronizacji kont
            </a>
          </div>
        </section>

        <section className="rounded-cards border border-ash bg-white">
          <div className="p-6">
            <h2 className="text-body-xl font-semibold text-charcoal">
              Dziennik zdarzeń
            </h2>
            <p className="mt-1.5 text-body text-steel">
              Historia logowań i zmian w Twoim profilu.
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-cards border border-ash p-3">
              <button
                type="button"
                disabled
                className="inline-flex h-10 items-center gap-2 rounded-inputs border border-ash bg-paper-mist px-3 text-body text-silver"
              >
                <CalendarDays className="size-4" aria-hidden />
                Ostatnie 12 miesięcy
                <ChevronDown className="size-3.5" aria-hidden />
              </button>
              <button
                type="button"
                disabled
                className="rounded-buttons border border-ash bg-paper-mist px-4 py-2 text-body font-medium text-silver"
              >
                Eksportuj CSV
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between gap-4 rounded-b-cards border-t border-ash bg-[#fafafa] px-6 py-3">
            <p className="text-body text-steel">
              Dziennik zdarzeń jest dostępny w planie{" "}
              <Link href="/#cennik" className="underline">
                Premium
              </Link>
            </p>
            <button
              type="button"
              className="rounded-buttons bg-primary-action-fill px-4 py-2 text-body font-medium text-white shadow-subtle transition-colors hover:bg-graphite"
            >
              Ulepsz
            </button>
          </div>
        </section>
      </div>
    </>
  );
}
