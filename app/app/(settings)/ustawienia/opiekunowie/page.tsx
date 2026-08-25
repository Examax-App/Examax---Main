import { ChevronDown, EllipsisVertical, Link2, ListFilter } from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { Avatar } from "@/components/ui/Avatar";
import { Kbd } from "@/components/ui/Kbd";
import { SearchInput } from "@/components/ui/SearchInput";
import { TableFooter } from "@/components/ui/Table";
import { ToolbarButton } from "@/components/ui/ToolbarButton";

/** The reference "Members" table with the single owner row. */
export default function OpiekunowiePage() {
  return (
    <>
      <PageHeader
        title="Opiekunowie"
        help
        actions={
          <div className="flex gap-2">
            <button
              type="button"
              disabled
              className="inline-flex items-center gap-2 rounded-buttons border border-ash bg-paper-mist px-4 py-2 text-body font-medium text-silver"
            >
              Zaproś opiekuna
              <Kbd>O</Kbd>
            </button>
            <button
              type="button"
              aria-label="Skopiuj link z zaproszeniem"
              className="grid size-10 place-items-center rounded-buttons border border-ash bg-white text-steel transition-colors hover:bg-paper-mist hover:text-charcoal"
            >
              <Link2 className="size-4" />
            </button>
          </div>
        }
      />

      <div className="flex-1 px-6 pb-16 pt-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <ToolbarButton icon={ListFilter} label="Filtruj" />
          <SearchInput placeholder="Szukaj po imieniu lub e-mailu" className="w-72" />
        </div>

        <div className="mt-4 overflow-hidden rounded-cards border border-ash bg-white">
          <div className="grid grid-cols-[1fr_auto] items-center gap-4 border-b border-ash px-4 py-3.5 text-body font-medium text-charcoal">
            <span>Imię i nazwisko</span>
            <span className="pr-14">Rola</span>
          </div>
          <div className="grid grid-cols-[1fr_auto] items-center gap-4 px-4 py-3.5">
            <div className="flex items-center gap-3">
              <Avatar name="Franciszek Kierzkiewicz" size="md" />
              <div>
                <p className="text-body font-medium text-charcoal">
                  Franciszek Kierzkiewicz{" "}
                  <span className="font-normal text-fog">(Ty)</span>
                </p>
                <p className="text-[13px] text-fog">uczen@przyklad.pl</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled
                className="inline-flex h-9 items-center gap-2 rounded-inputs border border-ash bg-paper-mist px-3 text-body text-silver"
              >
                Właściciel
                <ChevronDown className="size-3.5" aria-hidden />
              </button>
              <button
                type="button"
                aria-label="Więcej opcji"
                className="grid size-9 place-items-center rounded-buttons text-steel transition-colors hover:bg-paper-mist hover:text-charcoal"
              >
                <EllipsisVertical className="size-4" />
              </button>
            </div>
          </div>
        </div>

        <TableFooter
          summary={
            <>
              Wyświetlasz <span className="font-semibold">1–1</span> z{" "}
              <span className="font-semibold">1</span> opiekuna
            </>
          }
        />
      </div>
    </>
  );
}
