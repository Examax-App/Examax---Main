"use client";

import { useState } from "react";
import {
  EllipsisVertical,
  ListFilter,
  PencilLine,
  SlidersHorizontal,
} from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { SetupPill } from "@/components/app/SetupPill";
import { CreateModal } from "@/components/app/CreateModal";
import { ImportModal } from "@/components/app/ImportModal";
import { EmptyState } from "@/components/ui/EmptyState";
import { Kbd } from "@/components/ui/Kbd";
import { SearchInput } from "@/components/ui/SearchInput";
import { ToolbarButton } from "@/components/ui/ToolbarButton";

/** "Links" list page from the reference — empty state + composer modal. */
export default function TasksPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);

  return (
    <>
      <PageHeader
        title="Zadania"
        actions={
          <button
            type="button"
            onClick={() => setCreateOpen(true)}
            className="inline-flex items-center gap-2 rounded-buttons bg-primary-action-fill px-3.5 py-1.5 text-body-sm font-medium text-white shadow-subtle transition-colors hover:bg-graphite"
          >
            Nowe zadanie
            <Kbd tone="dark">Z</Kbd>
          </button>
        }
      />

      <div className="flex-1 px-6 pb-24 pt-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-2">
            <ToolbarButton icon={ListFilter} label="Filtruj" />
            <ToolbarButton icon={SlidersHorizontal} label="Wyświetlanie" />
          </div>
          <div className="flex items-center gap-2">
            <SearchInput
              placeholder="Szukaj zadania lub tematu"
              className="w-64"
            />
            <button
              type="button"
              aria-label="Więcej opcji"
              onClick={() => setImportOpen(true)}
              className="grid size-10 place-items-center rounded-buttons border border-ash bg-white text-steel transition-colors hover:bg-paper-mist hover:text-charcoal"
            >
              <EllipsisVertical className="size-4" />
            </button>
          </div>
        </div>

        <div className="mt-4 rounded-cards border border-ash bg-white">
          <EmptyState
            icon={PencilLine}
            title="Brak zadań"
            description="Zacznij tworzyć zestawy zadań do swoich tematów, arkuszy i powtórek."
          >
            <button
              type="button"
              onClick={() => setCreateOpen(true)}
              className="inline-flex items-center gap-2 rounded-buttons bg-primary-action-fill px-3.5 py-1.5 text-body-sm font-medium text-white shadow-subtle transition-colors hover:bg-graphite"
            >
              Nowe zadanie
              <Kbd tone="dark">Z</Kbd>
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

      {/* Floating results strip from the reference list pages */}
      <div className="pointer-events-none sticky bottom-4 z-20 flex justify-center px-6">
        <p className="pointer-events-auto rounded-cards border border-ash bg-white px-5 py-3 text-body text-charcoal shadow-md">
          Wyświetlasz <span className="font-semibold">0</span> zadań
        </p>
      </div>

      <SetupPill />
      <CreateModal open={createOpen} onClose={() => setCreateOpen(false)} />
      <ImportModal open={importOpen} onClose={() => setImportOpen(false)} />
    </>
  );
}
