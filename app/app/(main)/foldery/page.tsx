import { EllipsisVertical, FolderOpen, Globe } from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { SetupPill } from "@/components/app/SetupPill";
import { Kbd } from "@/components/ui/Kbd";
import { SearchInput } from "@/components/ui/SearchInput";
import { TableFooter } from "@/components/ui/Table";

/** The reference "Folders" grid with the single default-folder card. */
export default function FolderyPage() {
  return (
    <>
      <PageHeader
        title="Foldery"
        help
        actions={
          <button
            type="button"
            disabled
            className="inline-flex items-center gap-2 rounded-buttons border border-ash bg-paper-mist px-4 py-2 text-body font-medium text-silver"
          >
            Nowy folder
            <Kbd>F</Kbd>
          </button>
        }
      />

      <div className="flex-1 px-6 pb-16 pt-5">
        <SearchInput className="w-64" />

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-cards border border-ash bg-white p-4 transition-shadow hover:shadow-subtle">
            <div className="flex items-start justify-between">
              <span
                aria-hidden
                className="grid size-10 place-items-center rounded-full bg-soft-mint text-[#166534]"
              >
                <FolderOpen className="size-4.5" strokeWidth={1.8} />
              </span>
              <button
                type="button"
                aria-label="Opcje folderu"
                className="grid size-8 place-items-center rounded-buttons border border-ash text-steel transition-colors hover:bg-paper-mist hover:text-charcoal"
              >
                <EllipsisVertical className="size-4" />
              </button>
            </div>
            <p className="mt-3 flex flex-wrap items-center gap-2 text-body-lg font-semibold text-charcoal">
              Zadania
              <span className="text-body font-normal text-steel">
                Nieprzypisane
              </span>
              <span className="rounded-[6px] bg-sidebar-active px-1.5 py-0.5 text-[11px] font-medium text-electric-blue">
                Domyślny
              </span>
            </p>
            <p className="mt-1.5 flex items-center gap-1.5 text-body text-fog">
              <Globe className="size-3.5" aria-hidden />0 zadań
            </p>
          </div>
        </div>

        <TableFooter
          summary={
            <>
              Wyświetlasz <span className="font-semibold">0</span> folderów
            </>
          }
        />
      </div>

      <SetupPill />
    </>
  );
}
