import { EllipsisVertical, ListFilter, Users } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/app/PageHeader";
import { SetupPill } from "@/components/app/SetupPill";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { DataTable, TableRow } from "@/components/ui/Table";
import { SearchInput } from "@/components/ui/SearchInput";
import { ToolbarButton } from "@/components/ui/ToolbarButton";
import { UpsellPanel } from "@/components/ui/UpsellPanel";

/** The reference "Customers" table page with the plan-gated insight upsell. */
export default function ResultsPage() {
  return (
    <>
      <PageHeader
        title="Wyniki"
        help
        actions={
          <button
            type="button"
            aria-label="Więcej opcji"
            className="grid size-10 place-items-center rounded-buttons border border-ash bg-white text-steel transition-colors hover:bg-paper-mist hover:text-charcoal"
          >
            <EllipsisVertical className="size-4" />
          </button>
        }
      />

      <div className="flex-1 px-6 pb-16 pt-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <ToolbarButton icon={ListFilter} label="Filtruj" />
          <SearchInput placeholder="Szukaj po arkuszu lub temacie" className="w-72" />
        </div>

        <div className="relative mt-4 overflow-hidden rounded-cards border border-ash bg-white">
          <DataTable
            columns={["Arkusz", "Przedmiot", "Wynik", "Data", "Status"]}
            className="rounded-none border-0"
          >
            <TableRow
              ghost
              cells={[
                "Arkusz CKE — maj 2025",
                "Matematyka",
                "82%",
                "8 sie 2026",
                <StatusBadge key="s" status="completed" label="Ukończony" />,
              ]}
            />
            <TableRow
              ghost
              cells={[
                "Arkusz próbny — procenty",
                "Matematyka",
                "64%",
                "2 sie 2026",
                <StatusBadge key="s" status="pending" label="W trakcie" />,
              ]}
              className="opacity-30"
            />
          </DataTable>
          <UpsellPanel
            icon={Users}
            title="Wgląd w wyniki"
            description={
              <>
                Chcesz widzieć pełną historię arkuszy, rozkład punktów i słabe
                punkty? Przejdź na plan Premium, aby odblokować szczegółowy
                wgląd w wyniki.{" "}
                <Link href="/pricing" className="underline">
                  Dowiedz się więcej
                </Link>
              </>
            }
            ctaLabel="Ulepsz do Premium"
            className="-mt-8"
          />
        </div>
      </div>

      <SetupPill />
    </>
  );
}
