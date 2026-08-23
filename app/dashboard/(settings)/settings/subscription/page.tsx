import {
  BookOpen,
  CalendarDays,
  FolderOpen,
  ListFilter,
  MousePointerClick,
  PencilLine,
  Tag,
  Users,
} from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { Segmented } from "@/components/ui/Tabs";
import { ToolbarButton } from "@/components/ui/ToolbarButton";

const quotas = [
  { icon: BookOpen, label: "Przedmioty", used: 0, limit: 3 },
  { icon: FolderOpen, label: "Foldery", used: 0, limit: 0 },
  { icon: Tag, label: "Etykiety", used: 0, limit: 5 },
  { icon: Users, label: "Opiekunowie", used: 1, limit: 1 },
];

/** The reference "Billing" page: plan header, usage meters, quota strip. */
export default function SubscriptionPage() {
  return (
    <>
      <PageHeader title="Subskrypcja" />
      <div className="flex-1 px-6 pb-16 pt-6">
        <div className="rounded-cards border border-ash bg-white">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-ash p-6">
            <div>
              <h2 className="text-heading-sm font-semibold text-charcoal">
                Plan Darmowy
              </h2>
              <p className="mt-1 text-body text-steel">
                Obecny cykl rozliczeniowy: 22 sie 2026 – 21 wrz 2026
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                className="rounded-buttons bg-primary-action-fill px-4 py-2 text-body font-medium text-white shadow-subtle transition-colors hover:bg-graphite"
              >
                Ulepsz
              </button>
              <button
                type="button"
                className="rounded-buttons border border-ash bg-white px-4 py-2 text-body font-medium text-charcoal transition-colors hover:border-smoke hover:bg-paper-mist"
              >
                Zobacz faktury
              </button>
            </div>
          </div>

          <div className="grid gap-4 p-6 sm:grid-cols-2">
            <div className="rounded-cards border border-charcoal bg-white p-5">
              <p className="flex items-center gap-2 text-body text-steel">
                <PencilLine className="size-4" aria-hidden />
                Rozwiązane zadania
              </p>
              <p className="mt-2 font-satoshi text-heading font-medium leading-none text-charcoal">
                0
              </p>
              <div className="mt-4 h-0.5 w-full rounded-full bg-charcoal" />
              <p className="mt-2 text-body text-steel">Pozostało 200 z 200</p>
            </div>
            <div className="rounded-cards border border-ash bg-white p-5">
              <p className="flex items-center gap-2 text-body text-steel">
                <MousePointerClick className="size-4" aria-hidden />
                Pytania do agenta
              </p>
              <p className="mt-2 font-satoshi text-heading font-medium leading-none text-charcoal">
                0
              </p>
              <div className="mt-4 h-0.5 w-full rounded-full bg-charcoal" />
              <p className="mt-2 text-body text-steel">Pozostało 50 z 50</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 px-6">
            <div className="flex gap-2">
              <ToolbarButton icon={ListFilter} label="Filtruj" />
              <ToolbarButton icon={CalendarDays} label="22 sie – 21 wrz 2026" />
            </div>
            <Segmented options={["Przedmiot", "Folder"]} />
          </div>

          <div className="mx-6 mt-4 grid min-h-52 place-items-center rounded-cards text-center">
            <div>
              <span
                aria-hidden
                className="mx-auto grid size-12 place-items-center rounded-cards border border-ash bg-paper-mist text-charcoal"
              >
                <PencilLine className="size-5" strokeWidth={1.6} />
              </span>
              <p className="mt-4 text-body-lg font-semibold text-charcoal">
                Rozwiązane zadania
              </p>
              <p className="mt-1 text-body text-fog">
                Brak aktywności w wybranym zakresie dat.
              </p>
            </div>
          </div>

          <div className="mt-6 grid border-t border-ash sm:grid-cols-4">
            {quotas.map((quota, index) => (
              <div
                key={quota.label}
                className={
                  index > 0
                    ? "border-t border-ash p-5 sm:border-l sm:border-t-0"
                    : "p-5"
                }
              >
                <p className="flex items-center gap-2 text-body text-steel">
                  <quota.icon className="size-4" aria-hidden />
                  {quota.label}
                </p>
                <p className="mt-2 text-body-xl font-semibold text-charcoal">
                  {quota.used}{" "}
                  <span className="font-normal text-fog">/ {quota.limit}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
