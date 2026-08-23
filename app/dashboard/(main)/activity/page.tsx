import Link from "next/link";
import {
  CalendarDays,
  ChartNoAxesCombined,
  ListFilter,
  MousePointerClick,
} from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { SetupPill } from "@/components/app/SetupPill";
import { StatCard } from "@/components/ui/StatCard";
import { DataTable, TableRow } from "@/components/ui/Table";
import { ToolbarButton } from "@/components/ui/ToolbarButton";
import { UpsellPanel } from "@/components/ui/UpsellPanel";

/** The reference "Events" stream: stat cards, ghost table, plan upsell. */
export default function AktywnoscPage() {
  return (
    <>
      <PageHeader
        title="Aktywność"
        actions={
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-buttons border border-ash bg-white px-4 py-2 text-body font-medium text-charcoal transition-colors hover:border-smoke hover:bg-paper-mist"
          >
            <ChartNoAxesCombined className="size-4 text-steel" aria-hidden />
            Zobacz analitykę
          </button>
        }
      />

      <div className="flex-1 px-6 pb-16 pt-5">
        <div className="flex gap-2">
          <ToolbarButton icon={ListFilter} label="Filtruj" />
          <ToolbarButton icon={CalendarDays} label="Ostatnie 24 godziny" />
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <StatCard label="Rozwiązane" value="0" active />
          <StatCard label="Poprawne" value="0" />
          <StatCard label="Punkty" value="0" />
        </div>

        <div className="relative mt-4 overflow-hidden rounded-cards border border-ash bg-white">
          <DataTable
            columns={["Data", "Zadanie", "Temat", "Wynik", "Czas"]}
            className="rounded-none border-0"
          >
            <TableRow
              ghost
              cells={["22 sie, 15:38", "matura/procenty-01", "Procenty", "1/1 pkt", "0:42"]}
            />
            <TableRow
              ghost
              cells={["22 sie, 15:35", "matura/procenty-01", "Procenty", "0/1 pkt", "1:12"]}
              className="opacity-30"
            />
            <TableRow
              ghost
              cells={["22 sie, 15:31", "matura/rownania-02", "Równania", "2/2 pkt", "2:04"]}
              className="opacity-15"
            />
          </DataTable>
          <UpsellPanel
            icon={MousePointerClick}
            title="Strumień aktywności na żywo"
            description={
              <>
                Chcesz widzieć każdą odpowiedź i próbę na bieżąco? Przejdź na
                plan Premium, aby odblokować szczegółowy strumień aktywności.{" "}
                <Link href="/#pricing" className="underline">
                  Dowiedz się więcej
                </Link>
              </>
            }
            ctaLabel="Ulepsz do Premium"
            className="-mt-10"
          />
        </div>
      </div>

      <SetupPill />
    </>
  );
}
