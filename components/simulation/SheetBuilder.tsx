import {
  ChevronDown,
  ChevronRight,
  CircleHelp,
  FileText,
  FolderOpen,
  ListChecks,
  NotebookPen,
  Pencil,
  Timer,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";
import { SECTION_H2 } from "@/lib/type";

/**
 * The links-page builder panel, in Examax's terms.
 *
 * Built from the "Design for simulation" set in the Figma file
 * (`wuO3Pq5OaVJb1pBWGznjAl`), whose reference is dub.co/links: one wide white
 * card split into a tall form column and a narrower tinted sidebar, opened by
 * a breadcrumb header row and closed by an ✕.
 *
 * Everything small in that reference is here because the small things are what
 * make it read as a real screen: the `ⓘ` glyph after a field label, the split
 * select-plus-text input, the ✕/⌄ affordances hanging off a field's right
 * edge, the pencil on an editable sidebar block, the tab row over a preview,
 * and placeholder text that is visibly lighter than a filled value.
 */

/** A field label with the reference's help glyph. */
function FieldLabel({ children, help = true }: { children: React.ReactNode; help?: boolean }) {
  return (
    <p className="flex items-center gap-1.5 text-[12px] font-medium text-charcoal">
      {children}
      {help ? <CircleHelp className="size-3 text-silver" aria-hidden /> : null}
    </p>
  );
}

/* Icon tabs, as the reference draws them — a 272px sidebar cannot hold three
   text labels without truncating each one, and the reference's own switcher is
   a row of glyphs with the label carried by the tooltip. */
const modes = [
  { label: "Pełny arkusz", icon: FileText, active: true },
  { label: "Bez brudnopisu", icon: NotebookPen },
  { label: "Tylko zadania otwarte", icon: ListChecks },
];

export function SheetBuilder() {
  return (
    <section
      id="setup"
      aria-labelledby="setup-heading"
      className="border-t border-ash bg-white"
    >
      <div className="col-rules">
        <Container className="py-20 text-center">
          <Reveal>
            <p className="flex items-center justify-center gap-2 text-[12px] font-medium text-steel">
              <FileText className="size-3.5 text-tangerine" strokeWidth={2} aria-hidden />
              Przygotowanie podejścia
            </p>
            <h2
              id="setup-heading"
              className={cn("mx-auto mt-4 max-w-xl text-charcoal", SECTION_H2)}
            >
              Wybierasz arkusz, resztę ustawia sesja
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-pretty text-body-xl text-fog">
              Limit czasu, liczba zadań i punktacja przychodzą z arkusza — nie
              ustawiasz ich ręcznie.
            </p>
          </Reveal>
        </Container>
      </div>

      <div className="col-rules border-t border-ash bg-canvas-muted">
        <div className="mx-auto w-full max-w-[var(--page-max-width)] px-5 py-14 sm:px-10">
          <Reveal>
            <div
              role="img"
              aria-label="Podgląd ustawień symulacji: wybór egzaminu, arkusza i limitu czasu obok podglądu arkusza i trybu podejścia"
              className="mx-auto max-w-4xl overflow-hidden rounded-largecards border border-ash bg-white [box-shadow:var(--shadow-ring),var(--shadow-lg)]"
            >
              {/* Breadcrumb header — chip, path, close. */}
              <div className="flex items-center gap-2 border-b border-ash px-5 py-3.5">
                <span className="grid size-5 shrink-0 place-items-center rounded-[5px] border border-black/5 bg-soft-peach text-[#7c2d12]">
                  <Timer className="size-3" strokeWidth={2.5} aria-hidden />
                </span>
                <span className="text-[13px] font-medium text-charcoal">
                  Arkusz:
                </span>
                <ChevronRight className="size-3.5 text-silver" aria-hidden />
                <span className="truncate font-geist-mono text-[12.5px] text-steel">
                  matematyka/2024-maj
                </span>
                <X className="ml-auto size-4 shrink-0 text-silver" aria-hidden />
              </div>

              <div className="grid lg:grid-cols-[1fr_17rem]">
                {/* ── Form column ─────────────────────────────────────── */}
                <div className="space-y-4 p-5 sm:p-6">
                  <div>
                    <FieldLabel>Egzamin</FieldLabel>
                    <div className="mt-1.5 flex items-center justify-between rounded-inputs border border-ash px-3 py-2 text-[13px] text-charcoal">
                      Egzamin ósmoklasisty
                      <ChevronDown className="size-3.5 text-silver" aria-hidden />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <FieldLabel help={false}>Arkusz</FieldLabel>
                      <span className="flex items-center gap-2 text-silver" aria-hidden>
                        <X className="size-3" />
                        <ChevronDown className="size-3" />
                      </span>
                    </div>
                    {/* Split input: a select welded to a text field, the
                        reference's signature control. */}
                    <div className="mt-1.5 flex overflow-hidden rounded-inputs border border-midnight-ink">
                      <span className="flex shrink-0 items-center gap-1.5 border-r border-ash bg-canvas-muted px-3 py-2 text-[13px] text-steel">
                        maj 2024
                        <ChevronDown className="size-3 text-silver" aria-hidden />
                      </span>
                      <span className="px-3 py-2 text-[13px] text-charcoal">
                        Matematyka
                      </span>
                    </div>
                  </div>

                  <div>
                    <FieldLabel>Limit czasu</FieldLabel>
                    <div className="mt-1.5 flex items-center justify-between rounded-inputs border border-ash px-3 py-2">
                      <span className="font-geist-mono text-[13px] text-charcoal">
                        100:00
                      </span>
                      <span className="rounded-full bg-paper-mist px-2 py-0.5 text-[10.5px] text-fog">
                        z arkusza
                      </span>
                    </div>
                  </div>

                  <div>
                    <FieldLabel>Notatka do podejścia</FieldLabel>
                    <div className="mt-1.5 h-20 rounded-inputs border border-ash px-3 py-2 text-[13px] text-silver">
                      Dodaj notatkę…
                    </div>
                  </div>
                </div>

                {/* ── Sidebar ─────────────────────────────────────────── */}
                <div className="space-y-4 border-t border-ash bg-canvas-muted p-5 sm:p-6 lg:border-l lg:border-t-0">
                  <div>
                    <p className="text-[12px] font-medium text-charcoal">Folder</p>
                    <div className="mt-1.5 flex items-center gap-2 rounded-inputs border border-ash bg-white px-2.5 py-1.5">
                      <FolderOpen className="size-3.5 text-tangerine" aria-hidden />
                      <span className="text-[12px] text-charcoal">Symulacje</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <p className="text-[12px] font-medium text-charcoal">
                        Podgląd arkusza
                      </p>
                      <Pencil className="size-3 text-silver" aria-hidden />
                    </div>
                    <div className="mt-1.5 rounded-cards border border-ash bg-white p-3">
                      <p className="font-geist-mono text-[8px] uppercase tracking-[0.14em] text-fog">
                        Arkusz CKE
                      </p>
                      <p className="mt-1 font-satoshi text-[13px] font-bold tracking-tight text-charcoal">
                        Matematyka
                      </p>
                      <div className="mt-2 space-y-1.5">
                        {["w-full", "w-4/5", "w-full", "w-2/3"].map((width, index) => (
                          <span
                            key={index}
                            className={cn("block h-1 rounded-full bg-paper-mist", width)}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <p className="flex items-center gap-1.5 text-[12px] font-medium text-charcoal">
                        Tryb podejścia
                        <CircleHelp className="size-3 text-silver" aria-hidden />
                      </p>
                      <Pencil className="size-3 text-silver" aria-hidden />
                    </div>
                    {/* Tab row over the summary — the reference's preview
                        switcher, with only the live option selected. */}
                    <div className="mt-1.5 flex gap-1 rounded-inputs border border-ash bg-white p-1">
                      {modes.map((mode) => (
                        <span
                          key={mode.label}
                          title={mode.label}
                          className={cn(
                            "grid flex-1 place-items-center rounded-[4px] py-1.5",
                            mode.active ? "bg-charcoal text-white" : "text-silver",
                          )}
                        >
                          <mode.icon className="size-3.5" strokeWidth={2} aria-hidden />
                          <span className="sr-only">{mode.label}</span>
                        </span>
                      ))}
                    </div>
                    <div className="mt-2 rounded-cards border border-ash bg-white px-3 py-2">
                      <p className="font-geist-mono text-[11px] text-charcoal tabular-nums">
                        25 zadań · 100 minut
                      </p>
                      <p className="mt-0.5 text-[10.5px] text-fog">
                        maks. 25 punktów
                      </p>
                    </div>
                  </div>

                  <span className="block rounded-buttons bg-midnight-ink py-2.5 text-center text-body font-medium text-white">
                    Rozpocznij arkusz
                  </span>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="mt-10 text-center">
              <Button href="/signup" variant="outline" size="lg">
                Zapisz się na start
              </Button>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
