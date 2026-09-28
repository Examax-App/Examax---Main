import { Layers } from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { SetupPill } from "@/components/app/SetupPill";
import { EmptyState } from "@/components/ui/EmptyState";
import { Kbd } from "@/components/ui/Kbd";

/** The reference "UTM Templates" page — a single empty-state card. */
export default function TemplatesPage() {
  return (
    <>
      <PageHeader
        title="Szablony"
        help
        actions={
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-buttons bg-primary-action-fill px-3.5 py-1.5 text-body-sm font-medium text-white shadow-subtle transition-colors hover:bg-graphite"
          >
            Nowy szablon
            <Kbd tone="dark">S</Kbd>
          </button>
        }
      />

      <div className="flex-1 px-6 pb-16 pt-5">
        <div className="rounded-cards border border-ash bg-white">
          <EmptyState
            icon={Layers}
            title="Brak szablonów"
            description="Twórz wspólne szablony powtórek, aby trzymać jeden format nauki dla wszystkich przedmiotów."
          >
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-buttons bg-primary-action-fill px-3.5 py-1.5 text-body-sm font-medium text-white shadow-subtle transition-colors hover:bg-graphite"
            >
              Nowy szablon
              <Kbd tone="dark">S</Kbd>
            </button>
            <button
              type="button"
              className="rounded-buttons border border-ash bg-white px-3.5 py-1.5 text-body-sm font-medium text-charcoal transition-colors hover:border-smoke hover:bg-paper-mist"
            >
              Dowiedz się więcej
            </button>
          </EmptyState>
        </div>
      </div>

      <SetupPill />
    </>
  );
}
