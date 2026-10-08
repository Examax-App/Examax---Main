"use client";

import Link from "@/components/ui/Link";
import {
  BarChart3,
  CalendarDays,
  FileClock,
  Link2,
  ListFilter,
  MousePointerClick,
  PencilLine,
  RefreshCcw,
  Route,
  Webhook,
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { AccentTile, FeaturePill } from "@/components/ui/FeaturePill";
import { FieldLabel, Input, PrefixInput, Textarea } from "@/components/ui/Input";
import { SearchInput } from "@/components/ui/SearchInput";
import { Toggle } from "@/components/ui/Toggle";
import { Segmented, UnderlineTabs } from "@/components/ui/Tabs";
import { Kbd } from "@/components/ui/Kbd";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Avatar } from "@/components/ui/Avatar";
import { Banner } from "@/components/ui/Banner";
import { UpsellPanel } from "@/components/ui/UpsellPanel";
import { EmptyState } from "@/components/ui/EmptyState";
import { DataTable, TableFooter, TableRow } from "@/components/ui/Table";
import { StatCard, StatTabs } from "@/components/ui/StatCard";
import { AreaChart } from "@/components/ui/AreaChart";
import { ToolbarButton } from "@/components/ui/ToolbarButton";
import {
  SaveButton,
  SettingsCard,
  SettingToggleRow,
} from "@/components/ui/SettingsCard";
import { AgentIcon } from "@/components/ui/AgentIcon";

const swatches = [
  { name: "Charcoal", cls: "bg-charcoal", hex: "#171717" },
  { name: "Steel", cls: "bg-steel", hex: "#525252" },
  { name: "Fog", cls: "bg-fog", hex: "#737373" },
  { name: "Ash", cls: "bg-ash", hex: "#e5e5e5" },
  { name: "Paper Mist", cls: "bg-paper-mist", hex: "#f5f5f5" },
  { name: "Electric Blue", cls: "bg-electric-blue", hex: "#2563eb" },
  { name: "Vivid Green", cls: "bg-vivid-green", hex: "#16a34a" },
  { name: "Lavender", cls: "bg-lavender", hex: "#7c3aed" },
  { name: "Deep Sapphire", cls: "bg-deep-sapphire", hex: "#1e40af" },
];

const tints = [
  { name: "Soft Blue", cls: "bg-soft-blue", text: "text-electric-blue" },
  { name: "Soft Mint", cls: "bg-soft-mint", text: "text-[#166534]" },
  { name: "Soft Violet", cls: "bg-soft-violet", text: "text-lavender" },
];

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-ash py-12">
      <h2 className="font-satoshi text-heading-sm font-medium text-charcoal">
        {title}
      </h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}

/**
 * The lego box — every core component of the design system on one page,
 * grouped and labeled. Content is placeholder-only by design.
 */
export function ComponentsGallery() {

  return (
    <main className="bg-white pb-24">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-4 py-12">
          <div>
            <Logo />
            <h1 className="mt-6 font-satoshi text-heading-lg font-medium text-charcoal">
              Komponenty
            </h1>
            <p className="mt-2 max-w-lg text-body-lg text-steel">
              Klocki systemu — wszystkie podstawowe elementy odtworzone z
              referencji. Treści to placeholdery do podmiany.
            </p>
          </div>
          <div className="flex gap-2">
            <Button href="/" variant="outline">
              Strona główna
            </Button>
          </div>
        </div>

        <Section title="Kolory">
          <div className="flex flex-wrap gap-3">
            {swatches.map((swatch) => (
              <div key={swatch.name} className="w-28">
                <div
                  className={`h-14 rounded-cards border border-ash ${swatch.cls}`}
                />
                <p className="mt-1.5 text-[12px] font-medium text-charcoal">
                  {swatch.name}
                </p>
                <p className="font-geist-mono text-[11px] text-fog">
                  {swatch.hex}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {tints.map((tint) => (
              <span
                key={tint.name}
                className={`rounded-full px-3 py-1.5 text-[12px] font-medium ${tint.cls} ${tint.text}`}
              >
                {tint.name}
              </span>
            ))}
          </div>
        </Section>

        <Section title="Typografia">
          <div className="space-y-4">
            <p className="font-satoshi text-display font-medium leading-none text-charcoal">
              Display 48 — Satoshi Medium
            </p>
            <p className="font-satoshi text-heading-lg font-medium text-charcoal">
              Heading 36 — Satoshi Medium
            </p>
            <p className="text-heading font-medium text-charcoal">
              Heading 30 — Inter Medium
            </p>
            <p className="text-body-lg text-charcoal">
              Body 16 — Inter Regular. Kanoniczny tekst podstawowy z
              interlinią 1.5.
            </p>
            <p className="text-body text-steel">
              Body 14 — Inter Regular, ton przygaszony dla treści gęstych.
            </p>
            <p className="font-geist-mono text-body text-charcoal">
              Geist Mono 14 — metadane techniczne i liczby: 82% · 24:36
            </p>
          </div>
        </Section>

        <Section title="Przyciski">
          <div className="flex flex-wrap items-center gap-3">
            <Button href="#" variant="primary">
              Akcja główna
            </Button>
            <Button href="#" variant="outline">
              Akcja drugorzędna
            </Button>
            <Button href="#" variant="ghost">
              Akcja ghost
            </Button>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-buttons bg-primary-action-fill px-4 py-2 text-body font-medium text-white shadow-subtle transition-colors hover:bg-graphite"
            >
              Ze skrótem
              <Kbd tone="dark">C</Kbd>
            </button>
            <button
              type="button"
              disabled
              className="inline-flex items-center gap-2 rounded-buttons border border-ash bg-paper-mist px-4 py-2 text-body font-medium text-silver"
            >
              Wyłączony
              <Kbd>M</Kbd>
            </button>
            <ToolbarButton icon={ListFilter} label="Filtruj" />
            <ToolbarButton icon={CalendarDays} label="Ostatnie 24 godziny" />
          </div>
        </Section>

        <Section title="Pola formularza">
          <div className="grid max-w-3xl gap-6 sm:grid-cols-2">
            <div>
              <FieldLabel htmlFor="demo-input">Pole standardowe</FieldLabel>
              <Input id="demo-input" placeholder="Wpisz wartość" />
            </div>
            <div>
              <FieldLabel htmlFor="demo-emphasis">
                Pole z akcentem (czarna ramka)
              </FieldLabel>
              <Input id="demo-emphasis" emphasis placeholder="ty@przyklad.pl" />
            </div>
            <div>
              <FieldLabel htmlFor="demo-prefix">Pole z prefiksem</FieldLabel>
              <PrefixInput
                id="demo-prefix"
                prefix="app.examax.pl"
                placeholder="matura-2027"
              />
            </div>
            <div>
              <FieldLabel htmlFor="demo-search">Wyszukiwanie</FieldLabel>
              <SearchInput id="demo-search" />
            </div>
            <div className="sm:col-span-2">
              <FieldLabel htmlFor="demo-textarea" required>
                W czym możemy pomóc?
              </FieldLabel>
              <Textarea id="demo-textarea" rows={3} placeholder="Opisz temat" />
            </div>
          </div>
        </Section>

        <Section title="Pigułki, odznaki i awatary">
          <div className="flex flex-wrap items-center gap-3">
            <FeaturePill icon={Route} accent="blue" label="Roadmapa" active />
            <FeaturePill icon={PencilLine} accent="green" label="Trening" active />
            <FeaturePill icon={AgentIcon} accent="lavender" label="Korepetytor AI" active />
            <FeaturePill icon={BarChart3} accent="blue" label="Postępy" active />
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <StatusBadge status="completed" label="Ukończone" />
            <StatusBadge status="pending" label="W trakcie" />
            <StatusBadge status="active" label="Aktywne" />
            <span className="rounded-[6px] bg-sidebar-active px-1.5 py-0.5 text-[11px] font-medium text-electric-blue">
              Domyślny
            </span>
            <span className="rounded-[6px] bg-soft-violet px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.06em] text-lavender">
              Wkrótce
            </span>
            <AccentTile icon={Route} accent="blue" />
            <AccentTile icon={PencilLine} accent="green" />
            <AccentTile icon={AgentIcon} accent="lavender" />
            <AccentTile icon={BarChart3} accent="blue" />
            <Avatar name="Ala Wiśniewska" size="md" />
            <Avatar name="Jan Kowalski" size="md" />
            <Avatar name="Ola Nowak" size="lg" />
          </div>
        </Section>

        <Section title="Przełączniki, zakładki i segmenty">
          <div className="flex flex-wrap items-center gap-6">
            <Toggle label="Przykładowy przełącznik" defaultChecked />
            <Toggle label="Przełącznik wyłączony" />
            <Toggle label="Mały przełącznik" size="sm" defaultChecked />
            <Segmented options={["Aktywne", "Zarchiwizowane"]} />
          </div>
          <UnderlineTabs
            className="mt-6 max-w-md"
            tabs={["Twoje przedmioty", "Wszystkie przedmioty"]}
          />
        </Section>

        <Section title="Karty">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-cards border border-ash bg-white p-4">
              <p className="text-body font-semibold text-charcoal">
                Karta panelu
              </p>
              <p className="mt-1 text-body text-steel">
                Biała, ramka 1px, promień 12px — bez cienia.
              </p>
            </div>
            <div className="rounded-largecards bg-[#fafafa] p-4">
              <p className="text-body font-semibold text-charcoal">
                Karta przygaszona
              </p>
              <p className="mt-1 text-body text-steel">
                Szare tło #fafafa, promień 16px, bez ramki.
              </p>
            </div>
            <div className="rounded-largecards bg-white p-4 shadow-ring">
              <p className="text-body font-semibold text-charcoal">
                Karta wyróżniona
              </p>
              <p className="mt-1 text-body text-steel">
                Pierścień 4px — „pływający panel” referencji.
              </p>
            </div>
          </div>
        </Section>

        <Section title="Pusty stan">
          <div className="rounded-cards border border-ash bg-white">
            <EmptyState
              icon={Link2}
              title="Brak elementów"
              description="Zacznij dodawać elementy, aby zobaczyć je na tej liście."
            >
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-buttons bg-primary-action-fill px-4 py-2 text-body font-medium text-white shadow-subtle transition-colors hover:bg-graphite"
              >
                Dodaj element
                <Kbd tone="dark">C</Kbd>
              </button>
              <button
                type="button"
                className="rounded-buttons border border-ash bg-white px-4 py-2 text-body font-medium text-charcoal transition-colors hover:border-smoke hover:bg-paper-mist"
              >
                Dowiedz się więcej
              </button>
            </EmptyState>
          </div>
        </Section>

        <Section title="Tabela">
          <DataTable columns={["Arkusz", "Przedmiot", "Wynik", "Status"]}>
            <TableRow
              cells={[
                "Arkusz CKE — maj 2025",
                "Matematyka",
                "82%",
                <StatusBadge key="s" status="completed" label="Ukończony" />,
              ]}
            />
            <TableRow
              cells={[
                "Arkusz próbny — procenty",
                "Matematyka",
                "64%",
                <StatusBadge key="s" status="pending" label="W trakcie" />,
              ]}
            />
            <TableRow
              ghost
              cells={["Arkusz próbny — funkcje", "Matematyka", "—", "—"]}
            />
          </DataTable>
          <TableFooter
            summary={
              <>
                Wyświetlasz <span className="font-semibold">2</span> z{" "}
                <span className="font-semibold">2</span> wyników
              </>
            }
          />
        </Section>

        <Section title="Statystyki i wykres">
          <StatTabs
            stats={[
              { dotClass: "bg-electric-blue", label: "Rozwiązane", value: "1 246" },
              { dotClass: "bg-lavender", label: "Poprawne", value: "1 047" },
              { dotClass: "bg-[#2dd4bf]", label: "Punkty", value: "84%" },
            ]}
          />
          <div className="rounded-b-cards border border-ash bg-white p-5">
            <AreaChart />
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <StatCard label="Rozwiązane" value="0" active />
            <StatCard label="Poprawne" value="0" />
            <StatCard label="Punkty" value="0" />
          </div>
        </Section>

        <Section title="Baner i upsell">
          <Banner
            icon={RefreshCcw}
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
            <a href="#" className="underline">
              Dowiedz się więcej
            </a>
          </Banner>
          <div className="mt-4 rounded-cards border border-ash bg-white">
            <UpsellPanel
              icon={Webhook}
              title="Funkcja planu Premium"
              description="Krótki opis funkcji, która czeka w wyższym planie — z linkiem do szczegółów."
              ctaLabel="Ulepsz do Premium"
            />
          </div>
        </Section>

        <Section title="Karty ustawień">
          <div className="max-w-2xl space-y-6">
            <SettingsCard
              title="Nazwa profilu"
              description="Tak nazywa się Twój profil w Examax."
              footerHint="Maks. 32 znaki."
              footerAction={<SaveButton />}
            >
              <Input defaultValue="Matura 2027" />
            </SettingsCard>
            <div className="rounded-cards border border-ash bg-white">
              <SettingToggleRow
                icon={MousePointerClick}
                title="Wiersz preferencji"
                description="Ikona w kółku, tytuł, opis i niebieski przełącznik."
              />
              <SettingToggleRow
                icon={FileClock}
                title="Drugi wiersz"
                description="Wiersze rozdziela linia 1px."
                defaultChecked={false}
              />
            </div>
          </div>
        </Section>

        <p className="border-t border-ash pt-8 text-body text-fog">
          Pełne strony:{" "}
          <Link
            href="/login"
            className="link-underline font-medium text-steel"
          >
            logowanie
          </Link>
          ,{" "}
          <Link
            href="/contact"
            className="link-underline font-medium text-steel"
          >
            kontakt
          </Link>
          ,{" "}
          <Link href="/help" className="link-underline font-medium text-steel">
            pomoc
          </Link>
          .
        </p>
      </Container>

    </main>
  );
}
