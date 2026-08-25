"use client";

import { BookOpen, ChevronDown, Gift } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/app/PageHeader";
import { SetupPill } from "@/components/app/SetupPill";
import { Banner } from "@/components/ui/Banner";
import { EmptyState } from "@/components/ui/EmptyState";
import { SearchInput } from "@/components/ui/SearchInput";
import { Segmented, UnderlineTabs } from "@/components/ui/Tabs";
import { TableFooter } from "@/components/ui/Table";

/** "Domains" page from the reference: tabs, claim banner, empty list. */
export default function PrzedmiotyPage() {
  return (
    <>
      <PageHeader
        title="Przedmioty"
        help
        actions={
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-buttons bg-primary-action-fill px-4 py-2 text-body font-medium text-white shadow-subtle transition-colors hover:bg-graphite"
          >
            Dodaj przedmiot
            <ChevronDown className="size-3.5 opacity-70" aria-hidden />
          </button>
        }
      />

      <div className="flex-1 px-6 pb-16 pt-2">
        <UnderlineTabs tabs={["Twoje przedmioty", "Wszystkie przedmioty"]} />

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <SearchInput className="w-64" />
          <Segmented options={["Aktywne", "Zarchiwizowane"]} />
        </div>

        <Banner
          icon={Gift}
          className="mt-4"
          action={
            <button
              type="button"
              className="shrink-0 rounded-buttons border border-vivid-green/40 bg-white px-3 py-1.5 text-body font-medium text-[#166534] transition-colors hover:bg-soft-mint/60"
            >
              Odbierz
            </button>
          }
        >
          Odbierz <span className="font-semibold">30 dni</span> Premium za
          darmo.{" "}
          <Link href="/#cennik" className="underline">
            Dowiedz się więcej
          </Link>
        </Banner>

        <div className="mt-4 rounded-cards border border-ash bg-white">
          <EmptyState
            icon={BookOpen}
            title="Nie znaleziono przedmiotów"
            description="Dodaj przedmioty, aby uporządkować naukę pod swój egzamin."
          >
            <button
              type="button"
              className="rounded-buttons bg-primary-action-fill px-4 py-2 text-body font-medium text-white shadow-subtle transition-colors hover:bg-graphite"
            >
              Dodaj przedmiot
            </button>
            <button
              type="button"
              className="rounded-buttons border border-ash bg-white px-4 py-2 text-body font-medium text-charcoal transition-colors hover:border-smoke hover:bg-paper-mist"
            >
              Dowiedz się więcej
            </button>
          </EmptyState>
        </div>

        <TableFooter
          summary={
            <>
              Wyświetlasz <span className="font-semibold">0</span> przedmiotów
            </>
          }
        />
      </div>

      <SetupPill />
    </>
  );
}
