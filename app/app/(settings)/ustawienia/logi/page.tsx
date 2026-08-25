import { CalendarDays, FileClock, ListFilter } from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { SearchInput } from "@/components/ui/SearchInput";
import { ToolbarButton } from "@/components/ui/ToolbarButton";

/** The reference "Logs" page: toolbar + range note + empty state. */
export default function LogiPage() {
  return (
    <>
      <PageHeader title="Logi" help />

      <div className="flex-1 px-6 pb-16 pt-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-2">
            <ToolbarButton icon={ListFilter} label="Filtruj" />
            <ToolbarButton icon={CalendarDays} label="Ostatnie 30 dni" />
          </div>
          <SearchInput placeholder="Szukaj po ID zapytania" className="w-64" />
        </div>

        <p className="py-10 text-center text-body text-fog">
          Brak zapytań w tym zakresie
        </p>

        <div className="rounded-cards border border-ash bg-white">
          <EmptyState
            icon={FileClock}
            title="Brak logów"
            description="Dla tego profilu nie zarejestrowano jeszcze żadnych zapytań API."
          />
        </div>
      </div>
    </>
  );
}
