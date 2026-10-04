"use client";

import { useEffect, useRef, useState } from "react";
import { BookOpen, CircleDashed, CornerDownRight, EllipsisVertical, ListChecks, LoaderCircle, Route, Trash2 } from "lucide-react";
import { E8Icon } from "@/components/ui/E8Icon";
import { MaturaIcon } from "@/components/ui/MaturaIcon";
import { cn } from "@/lib/cn";

/*
 * The hero's working demo — dub.co/links' "Shorten any link…" box: a field
 * with a filled action inside a faint tray, and under it the list it writes
 * to. Dub turns a URL into a short link; here a topic goes into the plan and
 * lands in the next free week, with the two ways into a roadmap node
 * (lesson, quiz) where dub has copy and QR.
 *
 * Above the field the student picks the exam — Ósmoklasista, Matura or the
 * extended level — and each keeps its own list; under it, three example
 * topics for that exam add themselves in one click. A topic the student
 * added can be taken back out through its ⋮ menu; the exam's example row
 * stays, so the list is never empty.
 *
 * The hero never grows: the list keeps one row's height, and a new topic
 * slides in right under the example row, the older ones running on below
 * and fading out past the hero's bottom edge — as dub's list does.
 *
 * UI only: nothing is saved, and each list keeps its example row and the two
 * newest.
 */

type ExamKey = "e8" | "matura" | "extended";
type Row = { id: number; topic: string; week: number; unit: string; fresh: boolean };

const EXAMS: Array<{ key: ExamKey; label: string; Mark: typeof E8Icon; first: Omit<Row, "id" | "fresh">; examples: string[] }> = [
  { key: "e8", label: "Ósmoklasista", Mark: E8Icon, first: { topic: "Ułamki", week: 3, unit: "Liczby" }, examples: ["Procenty", "Lektury", "Past Simple"] },
  { key: "matura", label: "Matura", Mark: MaturaIcon, first: { topic: "Funkcja liniowa", week: 3, unit: "Funkcje" }, examples: ["Ciągi", "Romantyzm", "Reading"] },
  { key: "extended", label: "Rozszerzona", Mark: MaturaIcon, first: { topic: "Pochodna funkcji", week: 3, unit: "Analiza" }, examples: ["Granice", "Stereometria", "Writing"] },
];

/** How long the action shows its spinner — dub's request round-trip. */
const PENDING_MS = 700;
const MAX_ROWS = 3;

const initialLists = () =>
  Object.fromEntries(EXAMS.map((exam, index) => [exam.key, [{ ...exam.first, id: -1 - index, fresh: false }]])) as Record<ExamKey, Row[]>;

export function TopicComposer() {
  const [examKey, setExamKey] = useState<ExamKey>("matura");
  const [lists, setLists] = useState(initialLists);
  const [value, setValue] = useState("");
  const [pending, setPending] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const nextId = useRef(1);

  const exam = EXAMS.find((item) => item.key === examKey) ?? EXAMS[1];
  const rows = lists[examKey];

  const add = (raw: string) => {
    const topic = raw.trim().replace(/\s+/g, " ").slice(0, 48);
    if (!topic) {
      input.current?.focus();
      return;
    }
    setPending(true);
    const key = examKey;
    window.setTimeout(() => {
      setLists((current) => {
        const list = current[key];
        const row: Row = {
          id: nextId.current++,
          topic: topic[0].toLocaleUpperCase("pl-PL") + topic.slice(1),
          week: list.reduce((last, item) => Math.max(last, item.week), 2) + 1,
          unit: "Dodany przez Ciebie",
          fresh: true,
        };
        const [example, ...added] = list;
        return { ...current, [key]: [example, row, ...added].slice(0, MAX_ROWS) };
      });
      setValue("");
      setPending(false);
    }, PENDING_MS);
  };

  const remove = (id: number) => setLists((current) => ({ ...current, [examKey]: current[examKey].filter((row) => row.id !== id) }));

  return (
    // The hero staggers its entrance through --delay; nothing inside should inherit it.
    <div className="mx-auto w-full max-w-[561.5px] rounded-xl bg-black/[0.02] p-3 text-left" style={{ "--delay": "0ms" } as React.CSSProperties}>
      {/* The exam */}
      <div role="tablist" aria-label="Egzamin" className="mb-3 flex justify-center gap-1">
        {EXAMS.map(({ key, label, Mark }) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={key === examKey}
            onClick={() => setExamKey(key)}
            className={cn(
              "flex cursor-pointer items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors",
              key === examKey ? "border-ash bg-white text-charcoal shadow-subtle" : "border-transparent text-fog hover:text-charcoal",
            )}
          >
            <Mark className="h-3 w-4" />
            {label}
          </button>
        ))}
      </div>

      <form
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          if (!pending) add(value);
        }}
      >
        <div className="relative flex flex-col items-start overflow-hidden rounded-xl border border-ash bg-white px-2 pb-2 drop-shadow-md transition-all focus-within:border-blue-700 focus-within:ring-[3px] focus-within:ring-blue-500/30 sm:flex-row sm:items-center sm:pb-0 sm:pl-4 sm:pr-3">
          <label className="flex w-full grow items-center sm:w-auto">
            <span className="sr-only">Temat do planu ({exam.label})</span>
            <Route className="size-5 shrink-0 text-graphite" strokeWidth={1.5} aria-hidden />
            <input
              ref={input}
              name="topic"
              value={value}
              onChange={(event) => setValue(event.target.value)}
              placeholder="Dodaj temat do planu…"
              autoComplete="off"
              maxLength={48}
              className="relative block h-12 w-full rounded-r-xl border-0 bg-transparent px-2 text-base text-charcoal placeholder:text-silver focus:outline-none sm:h-14 sm:px-3"
            />
          </label>
          <div className="flex w-full shrink-0 items-center justify-center pt-1 sm:w-auto sm:pl-1 sm:pt-0">
            <button
              type="submit"
              disabled={pending}
              className={cn(
                "flex h-8 w-full cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-lg px-3 text-sm font-medium transition-[background-color,box-shadow] focus:outline-none sm:w-auto",
                pending
                  ? "cursor-not-allowed border border-ash bg-paper-mist text-silver"
                  : "bg-electric-blue text-white ring-blue-500/30 hover:ring-[3px] focus-visible:ring-[3px] active:bg-blue-700",
              )}
            >
              {pending ? <LoaderCircle className="size-3.5 animate-spin" aria-hidden /> : null}
              Dodaj do planu
            </button>
          </div>
        </div>
      </form>

      {/* Examples for this exam, one click each */}
      <div className="mt-2.5 flex flex-wrap items-center justify-center gap-1.5 text-xs">
        <span className="text-silver">Spróbuj:</span>
        {exam.examples.map((example) => (
          <button
            key={example}
            type="button"
            disabled={pending}
            onClick={() => add(example)}
            className="cursor-pointer rounded-full border border-ash bg-white px-2 py-0.5 text-steel transition-colors hover:border-smoke hover:text-charcoal disabled:cursor-not-allowed disabled:opacity-60"
          >
            {example}
          </button>
        ))}
      </div>

      {/* One row tall in the layout; the rest overflow downwards and fade */}
      <div className="relative mt-3 h-[68px]">
        <ul className="absolute inset-x-0 top-0 grid grid-cols-1 gap-2 [mask-image:linear-gradient(black_76px,transparent_160px)]" aria-live="polite">
          {rows.map((row) => (
            <li key={row.id} className={cn(row.fresh && "animate-slide-up-fade")} style={{ "--offset": "10px" } as React.CSSProperties}>
              <TopicRow row={row} Mark={exam.Mark} onRemove={row.fresh ? () => remove(row.id) : undefined} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function TopicRow({ row, Mark, onRemove }: { row: Row; Mark: typeof E8Icon; onRemove?: () => void }) {
  return (
    <div className="relative flex max-w-full items-center justify-between gap-2 rounded-xl border border-ash bg-white p-3 drop-shadow-sm">
      <div className="flex min-w-0 items-center gap-x-3">
        <div className="grid size-10 flex-none place-items-center rounded-full border border-ash bg-gradient-to-t from-paper-mist">
          <Mark className="h-3.5 w-5" />
        </div>
        <div className="min-w-0 overflow-hidden">
          <div className="flex items-center gap-1 sm:gap-2">
            <span className="truncate font-semibold text-graphite">{row.topic}</span>
            <div className="flex items-center gap-1 sm:gap-2">
              <NodeButton icon={BookOpen} label="Lekcja" />
              <NodeButton icon={ListChecks} label="Quiz" />
            </div>
          </div>
          <div className="flex items-center gap-1">
            <CornerDownRight className="size-4 shrink-0 text-silver" strokeWidth={1.5} aria-hidden />
            <span className="max-w-60 truncate text-sm text-silver sm:max-w-72">
              Tydzień {row.week} · {row.unit}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {row.fresh ? (
          <span className="hidden rounded-md border border-blue-100 bg-blue-50 px-2 py-[0.2rem] text-sm text-blue-600 sm:block">Nowy</span>
        ) : null}
        <span className="flex items-center justify-center gap-1 rounded-md border border-ash bg-canvas-muted px-1 py-[0.2rem] sm:px-3">
          <CircleDashed className="size-4 text-slate" strokeWidth={1.75} aria-hidden />
          <span className="flex items-center whitespace-nowrap text-sm text-fog">
            0%<span className="ml-1 hidden sm:inline-block">ukończone</span>
          </span>
        </span>
        {onRemove ? (
          <RowMenu topic={row.topic} onRemove={onRemove} />
        ) : (
          <span className="rounded-md px-1 py-2 text-fog" aria-hidden>
            <EllipsisVertical className="size-5" strokeWidth={1.5} />
          </span>
        )}
      </div>
    </div>
  );
}

/** Dub's ⋮ button, here with the one action a demo row needs: taking it out of the plan. */
function RowMenu({ topic, onRemove }: { topic: string; onRemove: () => void }) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    const escape = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", escape);
    };
  }, [open]);

  return (
    <div ref={root} className="relative">
      <button
        type="button"
        aria-label={`Opcje: ${topic}`}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((shown) => !shown)}
        className="cursor-pointer rounded-md px-1 py-2 text-fog transition-colors duration-75 hover:bg-canvas-muted focus:outline-none focus-visible:ring-1 focus-visible:ring-fog active:bg-paper-mist"
      >
        <EllipsisVertical className="size-5" strokeWidth={1.5} aria-hidden />
      </button>
      {open ? (
        <div
          role="menu"
          className="animate-scale-in-fade absolute bottom-full right-0 z-20 mb-1 w-44 origin-bottom-right rounded-lg border border-ash bg-white p-1 shadow-md"
          style={{ "--from-scale": "0.96" } as React.CSSProperties}
        >
          <button
            type="button"
            role="menuitem"
            autoFocus
            onClick={() => {
              setOpen(false);
              onRemove();
            }}
            className="flex w-full cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm text-charcoal transition-colors hover:bg-paper-mist focus:bg-paper-mist focus:outline-none"
          >
            <Trash2 className="size-4 text-fog" strokeWidth={1.75} aria-hidden />
            Usuń z planu
          </button>
        </div>
      ) : null}
    </div>
  );
}

/** Dub's copy / QR buttons: a 26px round outline, here the node's two ways in. */
function NodeButton({ icon: Icon, label }: { icon: typeof BookOpen; label: string }) {
  return (
    <span title={label} className="rounded-full border border-ash bg-canvas-muted p-1.5 text-slate">
      <span className="sr-only">{label}</span>
      <Icon className="size-3.5" strokeWidth={2} aria-hidden />
    </span>
  );
}
