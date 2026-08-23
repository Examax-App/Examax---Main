import { KeyRound } from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";

/** The reference "API Keys" page — empty-state card. */
export default function ApiKeysPage() {
  return (
    <>
      <PageHeader
        title="Klucze API"
        help
        actions={
          <button
            type="button"
            className="rounded-buttons bg-primary-action-fill px-4 py-2 text-body font-medium text-white shadow-subtle transition-colors hover:bg-graphite"
          >
            Nowy klucz API
          </button>
        }
      />

      <div className="flex-1 px-6 pb-16 pt-6">
        <div className="rounded-cards border border-ash bg-white">
          <EmptyState
            icon={KeyRound}
            title="Brak kluczy"
            description="Dla tego profilu nie utworzono jeszcze żadnych kluczy API."
          >
            <button
              type="button"
              className="rounded-buttons bg-primary-action-fill px-4 py-2 text-body font-medium text-white shadow-subtle transition-colors hover:bg-graphite"
            >
              Nowy klucz API
            </button>
            <button
              type="button"
              className="rounded-buttons border border-ash bg-white px-4 py-2 text-body font-medium text-charcoal transition-colors hover:border-smoke hover:bg-paper-mist"
            >
              Dowiedz się więcej
            </button>
          </EmptyState>
        </div>
      </div>
    </>
  );
}
