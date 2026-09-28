import {
  CalendarDays,
  ChartLine,
  ChartNoAxesColumn,
  EllipsisVertical,
  Grid2x2,
  ListFilter,
  MousePointerClick,
} from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { SetupPill } from "@/components/app/SetupPill";
import { AreaChart } from "@/components/ui/AreaChart";
import { StatTabs } from "@/components/ui/StatCard";
import { ToolbarButton } from "@/components/ui/ToolbarButton";
import { cn } from "@/lib/cn";

/** Breakdown panel from the reference's lower analytics grid. */
function BreakdownCard({
  tabs,
  chips,
  metric,
}: {
  tabs: string[];
  chips?: string[];
  metric: string;
}) {
  return (
    <div className="rounded-cards border border-ash bg-white">
      <div className="flex items-center justify-between gap-4 border-b border-ash px-4 py-3">
        <div className="flex gap-5">
          {tabs.map((tab, index) => (
            <button
              key={tab}
              type="button"
              className={cn(
                "-mb-3 border-b-2 pb-3 text-body font-medium",
                index === 0
                  ? "border-midnight-ink text-charcoal"
                  : "border-transparent text-fog hover:text-charcoal",
              )}
            >
              {tab}
            </button>
          ))}
        </div>
        <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-fog">
          <MousePointerClick className="size-3.5" aria-hidden />
          Rozwiązania
        </p>
      </div>
      {chips ? (
        <div className="flex gap-1.5 border-b border-ash/70 px-4 py-2.5">
          {chips.map((chip, index) => (
            <span
              key={chip}
              className={cn(
                "rounded-[6px] px-2 py-1 text-[12px] font-medium",
                index === 0
                  ? "bg-paper-mist text-charcoal"
                  : "text-fog hover:text-charcoal",
              )}
            >
              {chip}
            </span>
          ))}
        </div>
      ) : null}
      <div className="grid min-h-44 place-items-center px-4 py-6 text-center">
        <p className="text-body text-fog">{metric}</p>
      </div>
    </div>
  );
}

/** The reference "Analytics" dashboard: stat tabs, time-series, breakdowns. */
export default function AnalitykaPage() {
  return (
    <>
      <PageHeader
        title="Analityka"
        actions={
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-buttons border border-ash bg-white px-3.5 py-1.5 text-body-sm font-medium text-charcoal transition-colors hover:border-smoke hover:bg-paper-mist"
          >
            <Grid2x2 className="size-4 text-steel" aria-hidden />
            Zobacz aktywność
          </button>
        }
      />

      <div className="flex-1 px-6 pb-16 pt-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-2">
            <ToolbarButton icon={ListFilter} label="Filtruj" />
            <ToolbarButton icon={CalendarDays} label="Ostatnie 24 godziny" />
          </div>
          <button
            type="button"
            aria-label="Więcej opcji"
            className="grid size-10 place-items-center rounded-buttons border border-ash bg-white text-steel transition-colors hover:bg-paper-mist hover:text-charcoal"
          >
            <EllipsisVertical className="size-4" />
          </button>
        </div>

        <div className="mt-4">
          <StatTabs
            stats={[
              { dotClass: "bg-electric-blue", label: "Rozwiązane", value: "0" },
              { dotClass: "bg-lavender", label: "Poprawne", value: "0" },
              { dotClass: "bg-[#2dd4bf]", label: "Punkty", value: "0" },
            ]}
          />
          <div className="relative rounded-b-cards border border-ash bg-white p-5">
            <div className="absolute right-4 top-4 flex overflow-hidden rounded-buttons border border-ash">
              <button
                type="button"
                aria-label="Wykres liniowy"
                className="grid size-8 place-items-center bg-paper-mist text-charcoal"
              >
                <ChartLine className="size-4" />
              </button>
              <button
                type="button"
                aria-label="Wykres słupkowy"
                className="grid size-8 place-items-center border-l border-ash bg-white text-steel hover:text-charcoal"
              >
                <ChartNoAxesColumn className="size-4" />
              </button>
            </div>
            <AreaChart flat className="pt-8" />
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <BreakdownCard
            tabs={["Zadania", "Materiały"]}
            chips={["Tematy", "Foldery", "Etykiety"]}
            metric="Brak danych w wybranym zakresie"
          />
          <BreakdownCard
            tabs={["Przedmioty", "Typy zadań"]}
            chips={["Przedmiot", "Dział"]}
            metric="Brak danych w wybranym zakresie"
          />
        </div>
      </div>

      <SetupPill />
    </>
  );
}
