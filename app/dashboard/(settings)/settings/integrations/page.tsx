import { Check, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  BookOpenCheck,
  CalendarDays,
  GraduationCap,
  MessagesSquare,
  NotebookPen,
  Presentation,
} from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { SearchInput } from "@/components/ui/SearchInput";
import { cn } from "@/lib/cn";
import { BrandMark } from "@/components/ui/BrandMark";

type Integration = {
  icon: LucideIcon;
  iconClass: string;
  name: string;
  description: string;
  comingSoon?: boolean;
};

const school: Integration[] = [
  {
    icon: BookOpenCheck,
    iconClass: "bg-soft-mint text-[#166534]",
    name: "Google Classroom",
    description: "Importuj zadania i oddawaj prace bez wychodzenia z Examax.",
  },
  {
    icon: MessagesSquare,
    iconClass: "bg-sidebar-active text-electric-blue",
    name: "Microsoft Teams",
    description: "Synchronizuj materiały z zajęć ze swoim planem nauki.",
  },
  {
    icon: NotebookPen,
    iconClass: "bg-soft-violet text-lavender",
    name: "Librus",
    description: "Zaciągaj sprawdziany i terminy prosto z dziennika.",
    comingSoon: true,
  },
];

const planning: Integration[] = [
  {
    icon: CalendarDays,
    iconClass: "bg-soft-peach text-tangerine",
    name: "Kalendarz Google",
    description: "Bloki nauki z roadmapy trafiają prosto do kalendarza.",
  },
  {
    icon: Presentation,
    iconClass: "bg-soft-amber text-[#92400e]",
    name: "Notion",
    description: "Eksportuj notatki i podsumowania powtórek do Notion.",
  },
  {
    icon: GraduationCap,
    iconClass: "bg-paper-mist text-charcoal",
    name: "USOS",
    description: "Śledź terminy rekrutacji na wybrane kierunki studiów.",
    comingSoon: true,
  },
];

function FeaturedCard({
  icon: Icon,
  iconClass,
  name,
  description,
}: Integration) {
  return (
    <div className="overflow-hidden rounded-largecards border border-ash bg-gradient-to-br from-soft-violet/40 via-white to-soft-peach/40 p-3">
      <div className="bg-grid relative grid h-44 place-items-center rounded-cards">
        <div className="flex items-center gap-5">
          <span
            aria-hidden
            className="grid size-16 place-items-center rounded-full bg-midnight-ink shadow-md"
          >
            <BrandMark className="size-7 text-white" />
          </span>
          <X className="size-4 text-fog" aria-hidden />
          <span
            aria-hidden
            className={cn(
              "grid size-16 place-items-center rounded-full shadow-md",
              iconClass,
            )}
          >
            <Icon className="size-7" strokeWidth={1.8} />
          </span>
        </div>
      </div>
      <div className="mt-3 flex items-start gap-3 rounded-cards border border-ash bg-white p-4">
        <span
          aria-hidden
          className={cn(
            "grid size-9 shrink-0 place-items-center rounded-cards",
            iconClass,
          )}
        >
          <Icon className="size-4.5" strokeWidth={1.8} />
        </span>
        <div>
          <p className="text-body-lg font-semibold text-charcoal">{name}</p>
          <p className="text-body text-steel">{description}</p>
        </div>
      </div>
    </div>
  );
}

function IntegrationCard({
  icon: Icon,
  iconClass,
  name,
  description,
  comingSoon,
}: Integration) {
  return (
    <div className="relative rounded-cards border border-ash bg-white p-4 transition-shadow hover:shadow-subtle">
      {comingSoon ? (
        <span className="absolute right-3 top-3 rounded-[6px] bg-soft-violet px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.06em] text-lavender">
          Wkrótce
        </span>
      ) : null}
      <span
        aria-hidden
        className={cn(
          "grid size-10 place-items-center rounded-cards",
          iconClass,
        )}
      >
        <Icon className="size-5" strokeWidth={1.8} />
      </span>
      <p className="mt-3 flex items-center gap-1.5 text-body-lg font-semibold text-charcoal">
        {name}
        {!comingSoon ? (
          <span
            aria-hidden
            className="grid size-4 place-items-center rounded-[4px] bg-sidebar-active text-electric-blue"
          >
            <Check className="size-3" strokeWidth={3} />
          </span>
        ) : null}
      </p>
      <p className="mt-1 text-body text-steel">{description}</p>
    </div>
  );
}

/** The reference "Integrations" gallery: featured pair + category grids. */
export default function IntegrationsPage() {
  return (
    <>
      <PageHeader title="Integracje" help />
      <div className="flex-1 px-6 pb-16 pt-6">
        <SearchInput className="mx-auto block max-w-2xl" />

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <FeaturedCard {...school[0]} />
          <FeaturedCard {...planning[0]} />
        </div>

        <div className="mt-4 flex justify-center gap-2">
          {[...school, ...planning].slice(0, 4).map((integration) => (
            <span
              key={integration.name}
              aria-hidden
              className={cn(
                "grid size-7 place-items-center rounded-[8px]",
                integration.iconClass,
              )}
            >
              <integration.icon className="size-3.5" strokeWidth={2} />
            </span>
          ))}
        </div>

        <h2 className="mt-10 text-body-xl font-semibold text-charcoal">
          Szkoła
        </h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {school.map((integration) => (
            <IntegrationCard key={integration.name} {...integration} />
          ))}
        </div>

        <h2 className="mt-10 text-body-xl font-semibold text-charcoal">
          Planowanie
        </h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {planning.map((integration) => (
            <IntegrationCard key={integration.name} {...integration} />
          ))}
        </div>
      </div>
    </>
  );
}
