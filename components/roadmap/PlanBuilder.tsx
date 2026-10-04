import {
  BookOpen,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
  CircleDashed,
  CircleHelp,
  FileText,
  ListChecks,
  Pencil,
  RefreshCcw,
  Route,
  Sparkles,
  X,
} from "lucide-react";
import { BrandMark } from "@/components/ui/BrandMark";
import { MaturaIcon } from "@/components/ui/MaturaIcon";
import { cn } from "@/lib/cn";

/*
 * The section's centrepiece — dub.co/links' link builder modal, kept at its
 * own layout (2fr/1fr, fields left, a muted side panel right) and drawn at
 * 85% inside a 500px window that fades out from halfway down. Dub's builder
 * edits a link; this one sets up a roadmap: the exam, its date, the days a
 * student studies and a note for the tutor, with the stage, the path and a
 * preview of the week where dub has folder, QR code and link preview.
 *
 * A picture of the product, not a form: nothing in it takes focus.
 */

function Label({ children, help = false }: { children: React.ReactNode; help?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <span className="block text-sm font-medium text-slate">{children}</span>
      {help ? <CircleHelp className="size-3.5 text-fog" strokeWidth={2} aria-hidden /> : null}
    </div>
  );
}

const FIELD = "block w-full rounded-md border border-smoke bg-white px-3 py-2 text-sm text-charcoal shadow-subtle";

/** Where the student is on the path: the topic behind, the one under way, the one next. */
function MiniPath() {
  return (
    <div className="flex size-full flex-col justify-center gap-1 px-3">
      <div className="flex items-center gap-2 px-2 text-xs text-silver">
        <Check className="size-3" strokeWidth={2.5} />
        Procenty
      </div>
      <div className="flex items-center gap-2 rounded-md border border-ash bg-white px-2 py-1 text-xs font-medium text-charcoal shadow-subtle">
        <span className="rounded border border-blue-200 bg-blue-100 p-0.5">
          <Route className="size-2.5 text-blue-700" strokeWidth={2.5} />
        </span>
        Funkcja liniowa
        <span className="ml-auto text-[10px] font-normal text-fog tabular-nums">64%</span>
      </div>
      <div className="flex items-center gap-2 px-2 text-xs text-silver">
        <CircleDashed className="size-3" strokeWidth={2} />
        Funkcja kwadratowa
      </div>
    </div>
  );
}

export function PlanBuilder() {
  return (
    <div className="hidden bg-gradient-to-b from-white to-canvas-muted px-4 sm:mt-12 sm:block">
      <div className="py-12">
        <div
          className="mx-auto h-[500px] max-w-[940px] [mask-image:linear-gradient(black_50%,transparent)]"
          role="img"
          aria-label="Kreator roadmapy: egzamin, termin, dni nauki, etap, ścieżka i podgląd tygodnia"
        >
          <div aria-hidden className="pointer-events-none origin-top scale-[0.85] select-none rounded-xl border border-ash bg-white text-left shadow-[0_98px_64px_0_#0001]">
            {/* Header: breadcrumb and close */}
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex min-w-0 items-center gap-1">
                <div className="flex items-center gap-2 px-1.5">
                  <span className="rounded-md border border-blue-200 bg-blue-100 p-1">
                    <Route className="size-4 text-blue-700" strokeWidth={2} />
                  </span>
                  <span className="text-sm font-semibold text-graphite">Roadmapa</span>
                </div>
                <ChevronRight className="size-4 text-fog" strokeWidth={2} />
                <div className="flex items-center gap-2 px-1.5">
                  <MaturaIcon className="size-5" />
                  <span className="text-sm font-medium text-charcoal">Matura 2027 · Matematyka</span>
                </div>
              </div>
              <span className="rounded-full p-2 text-fog">
                <X className="size-5" strokeWidth={1.75} />
              </span>
            </div>

            <div className="grid w-full gap-y-6 md:min-h-[510px] md:grid-cols-[2fr_1fr]">
              {/* Fields */}
              <div className="px-6">
                <div className="flex min-h-full flex-col gap-8 py-4">
                  <div>
                    <Label help>Egzamin</Label>
                    <div className={cn(FIELD, "mt-2")}>Matura podstawowa — Matematyka</div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <Label>Termin egzaminu</Label>
                      <div className="flex items-center gap-1 text-fog">
                        <span className="grid size-6 place-items-center rounded-md">
                          <CalendarDays className="size-4" strokeWidth={1.75} />
                        </span>
                        <span className="grid size-6 place-items-center rounded-md">
                          <Sparkles className="size-4" strokeWidth={1.75} />
                        </span>
                      </div>
                    </div>
                    <div className="relative mt-1 flex rounded-md shadow-subtle">
                      <div className="flex w-40 shrink-0 items-center justify-between gap-2 rounded-l-md border border-r-0 border-smoke bg-white px-2.5 py-2 text-sm text-charcoal">
                        Matura 2027
                        <ChevronDown className="size-4 text-fog" strokeWidth={1.75} />
                      </div>
                      <div className="block w-full rounded-r-md border border-smoke bg-white px-3 py-2 text-sm text-charcoal">5 maja 2027, godz. 9:00</div>
                    </div>
                  </div>
                  <div>
                    <div className="mb-1 flex items-center gap-2">
                      <Label help>Dni nauki</Label>
                    </div>
                    <div className="flex w-full items-center gap-2 rounded-lg border border-smoke bg-white px-2.5 py-1.5 text-sm text-silver">
                      <CalendarDays className="size-4 shrink-0" strokeWidth={1.75} />
                      <span className="my-px block py-0.5">Wybierz dni nauki…</span>
                    </div>
                  </div>
                  <div>
                    <Label help>Notatka dla Korepetytora AI</Label>
                    <div className={cn(FIELD, "mt-2 h-[78px] text-silver")}>Na czym chcesz się skupić?</div>
                  </div>
                </div>
              </div>

              {/* Side panel */}
              <div className="px-6 md:pl-0 md:pr-4">
                <div className="relative">
                  <div className="absolute inset-0 rounded-xl border border-ash bg-canvas-muted [mask-image:linear-gradient(to_bottom,black,transparent)]" />
                  <div className="relative flex flex-col gap-6 px-4 py-3">
                    <div>
                      <h3 className="mb-1 text-sm font-medium text-slate">Etap</h3>
                      <div className="flex h-8 w-full min-w-0 items-center gap-2 rounded-md border border-ash bg-white px-2 py-1 pl-1 text-sm">
                        <span className="shrink-0 rounded-md border border-blue-200 bg-blue-100 p-1">
                          <Route className="size-3 text-blue-700" strokeWidth={2.25} />
                        </span>
                        <span className="min-w-0 grow truncate font-medium text-charcoal">Etap 2 · Funkcje</span>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-slate">Ścieżka</h3>
                        <span className="grid h-7 place-items-center px-1 text-graphite">
                          <Pencil className="size-3.5" strokeWidth={1.75} />
                        </span>
                      </div>
                      <div className="relative mt-2 h-24 overflow-hidden rounded-md border border-smoke bg-canvas-muted">
                        <MiniPath />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between">
                        <Label help>Podgląd tygodnia</Label>
                        <span className="grid h-7 place-items-center px-1 text-graphite">
                          <Pencil className="size-3.5" strokeWidth={1.75} />
                        </span>
                      </div>
                      <div className="mt-2.5 grid grid-cols-4 gap-2">
                        {[BookOpen, ListChecks, RefreshCcw, FileText].map((Icon, index) => (
                          <span
                            key={index}
                            className={cn(
                              "flex h-7 items-center justify-center rounded-lg border text-graphite",
                              index === 0 ? "border-silver bg-white drop-shadow-sm" : "border-smoke",
                            )}
                          >
                            <Icon className="size-3.5" strokeWidth={2} />
                          </span>
                        ))}
                      </div>
                      <div className="mt-2 overflow-hidden rounded-md border border-smoke">
                        <div className="relative aspect-[1200/630] w-full overflow-hidden bg-white">
                          <div className="absolute -inset-1/2 opacity-15 blur-2xl [background:var(--gradient-conic-spectrum)]" />
                          <div className="absolute left-4 top-4 flex items-center gap-1.5 text-midnight-ink">
                            <BrandMark className="h-3.5" />
                            <span className="font-satoshi text-[11px] font-bold">Tydzień 12</span>
                          </div>
                          <span className="absolute bottom-4 left-4 text-sm font-medium text-graphite">Funkcja liniowa</span>
                        </div>
                      </div>
                      <p className="mt-4 text-xs font-medium text-slate">Pon, śr, pt · 3 sesje</p>
                      <p className="mt-2.5 text-xs text-fog">Lekcja, quiz i powtórka z poprzedniego tygodnia.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
