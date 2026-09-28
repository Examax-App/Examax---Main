import { Tag } from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { SetupPill } from "@/components/app/SetupPill";
import { EmptyState } from "@/components/ui/EmptyState";
import { Kbd } from "@/components/ui/Kbd";
import { SearchInput } from "@/components/ui/SearchInput";

/** The reference "Tags" list — search + empty state. */
export default function LabelsPage() {
  return (
    <>
      <PageHeader
        title="Etykiety"
        help
        actions={
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-buttons bg-primary-action-fill px-3.5 py-1.5 text-body-sm font-medium text-white shadow-subtle transition-colors hover:bg-graphite"
          >
            Nowa etykieta
            <Kbd tone="dark">E</Kbd>
          </button>
        }
      />

      <div className="flex-1 px-6 pb-16 pt-5">
        <SearchInput className="w-64" />

        <div className="mt-4 rounded-cards border border-ash bg-white">
          <EmptyState
            icon={Tag}
            title="Nie znaleziono etykiet"
            description="Twórz etykiety, aby porządkować zadania między tematami i arkuszami."
          >
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-buttons bg-primary-action-fill px-3.5 py-1.5 text-body-sm font-medium text-white shadow-subtle transition-colors hover:bg-graphite"
            >
              Nowa etykieta
              <Kbd tone="dark">E</Kbd>
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
