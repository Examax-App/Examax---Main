"use client";

import { AbsoluteFill, interpolate } from "remotion";
import {
  BookOpen,
  ChevronRight,
  CornerDownRight,
  Ellipsis,
  FolderOpen,
  Languages,
  ListChecks,
  ListFilter,
  PencilLine,
  Plus,
  Search,
  SlidersHorizontal,
  Sigma,
  Target,
  X,
} from "lucide-react";
import { useFrame } from "@/components/hero-film/frame";
import { EASE, enter, pageOpacity, ramp } from "@/components/hero-film/motion";
import { s } from "@/components/hero-film/timeline";
import { Chip, Cursor, Page, PrimaryButton, Shell } from "@/components/hero-film/kit";
import { PRACTICE, appNav, type Session } from "@/components/hero-film/demoData";
import { cn } from "@/lib/cn";

/**
 * Trening — the reference's Short Links loop, beat for beat.
 *
 *   0.0  the Trening list staggers in
 *   2.2  the cursor opens "Nowy trening"
 *   3.2  the form fills: topic typed, level picked, tags added, the first
 *        question previewed, instant checking switched on
 *   8.4  "Utwórz trening" → the modal closes and the new session slides in
 *        at the top of the list
 */
const T = {
  open: s(3.0),
  modal: s(3.2),
  typeFrom: s(4.1),
  level: s(5.7),
  tags: s(6.3),
  preview: s(6.9),
  toggle: s(7.6),
  create: s(8.5),
  close: s(8.6),
  end: s(11.0),
};

/**
 * The modal's frame in composition pixels, so the cursor can aim into it. It
 * sits high enough that its footer clears the hero's caption card, which
 * covers the bottom of the stage.
 */
const M = { x: 300, y: 40, w: 800, h: 452 };
const FIELD_X = M.x + 18;

/** A session's subject mark, read off its source line. */
function SubjectIcon({ source }: { source: string }) {
  const props = { className: "size-[14px] text-charcoal", strokeWidth: 1.9 };
  if (source.includes("polski")) return <BookOpen {...props} />;
  if (source.includes("angielski")) return <Languages {...props} />;
  return <Sigma {...props} />;
}

export function PracticeLoop() {
  const frame = useFrame();
  const modalIn = ramp(frame, T.modal, 12) * (1 - ramp(frame, T.close, 8));
  const created = frame >= T.close + 4;

  const newButton = { x: 1108, y: 30 };
  const topicField = { x: FIELD_X + 120, y: M.y + 103 };
  const levelOption = { x: FIELD_X + 402, y: M.y + 169 };
  const tagsField = { x: FIELD_X + 250, y: M.y + 235 };
  const toggle = { x: FIELD_X + 448, y: M.y + 341 };
  const createButton = { x: M.x + M.w - 70, y: M.y + M.h - 25 };

  return (
    <AbsoluteFill>
      <Shell
        nav={appNav()}
        active="Trening"
        title="Trening"
        titleKey="Trening"
        headerRight={
          <PrimaryButton pressed={frame >= T.open && frame < T.open + 6}>
            <Plus className="size-3" strokeWidth={2.2} />
            Nowy trening
          </PrimaryButton>
        }
      >
        <List frame={frame} opacity={pageOpacity(frame, 0, T.end)} created={created ? frame - (T.close + 4) : null} />
      </Shell>

      {modalIn > 0 && (
        <>
          <div className="absolute inset-0 bg-white/55" style={{ opacity: modalIn }} />
          <Modal frame={frame} opacity={modalIn} />
        </>
      )}

      <Cursor
        keys={[
          { at: s(2.2), x: 980, y: 300 },
          { at: s(2.8), x: newButton.x, y: newButton.y },
          { at: T.open, x: newButton.x, y: newButton.y, click: true },
          { at: s(3.8), x: topicField.x, y: topicField.y },
          { at: s(4.0), x: topicField.x, y: topicField.y, click: true },
          { at: s(5.4), x: levelOption.x, y: levelOption.y },
          { at: T.level, x: levelOption.x, y: levelOption.y, click: true },
          { at: s(6.1), x: tagsField.x, y: tagsField.y },
          { at: T.tags, x: tagsField.x, y: tagsField.y, click: true },
          { at: s(7.3), x: toggle.x, y: toggle.y },
          { at: T.toggle, x: toggle.x, y: toggle.y, click: true },
          { at: s(8.2), x: createButton.x, y: createButton.y },
          { at: T.create, x: createButton.x, y: createButton.y, click: true },
          { at: s(9.3), x: 900, y: 150 },
        ]}
      />
    </AbsoluteFill>
  );
}

/* The list ---------------------------------------------------------------- */

function List({ frame, opacity, created }: { frame: number; opacity: number; created: number | null }) {
  const f = frame;
  // The new row takes the top slot; the others step down to make room.
  const slide = created === null ? 0 : interpolate(created, [0, 14], [0, 1], { easing: EASE, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <Page opacity={opacity}>
      <div className="flex items-center justify-between" style={enter(f, 3)}>
        <div className="flex gap-2">
          <Chip icon={ListFilter} caret>
            Filtr
          </Chip>
          <Chip icon={SlidersHorizontal} caret>
            Widok
          </Chip>
        </div>
        <span className="flex h-[28px] w-[220px] items-center gap-2 rounded-[7px] border border-ash px-2.5 text-[11.5px] text-silver">
          <Search className="size-[12px]" strokeWidth={1.75} />
          Szukaj po temacie lub arkuszu
        </span>
      </div>

      <div className="relative mt-4">
        {created !== null && (
          <div className="absolute inset-x-0 top-0" style={{ opacity: slide, transform: `translateY(${(1 - slide) * -8}px)` }}>
            <SessionRow session={PRACTICE.created} highlight={1 - ramp(created, 30, 40)} />
          </div>
        )}
        <div style={{ transform: `translateY(${slide * 68}px)` }}>
          {PRACTICE.sessions.map((session, i) => (
            <div key={session.title} className="mb-[10px]" style={enter(f, 6 + i * 2, { offset: 5 })}>
              <SessionRow session={session} />
            </div>
          ))}
        </div>
      </div>
    </Page>
  );
}

/** The reference's link row: a round mark, title with icons, the source, stats. */
function SessionRow({ session, highlight = 0 }: { session: Session; highlight?: number }) {
  return (
    <div
      className="flex h-[58px] items-center gap-3 rounded-[12px] border border-ash bg-white px-3.5"
      style={{ boxShadow: highlight > 0 ? `0 0 0 3px rgba(37,99,235,${0.12 * highlight})` : undefined }}
    >
      <span className="grid size-[32px] shrink-0 place-items-center rounded-full border border-ash bg-gradient-to-b from-white to-paper-mist">
        <SubjectIcon source={session.source} />
      </span>
      <div className="min-w-0 flex-1 leading-none">
        <div className="flex items-center gap-2">
          <span className="text-[12px] font-semibold text-charcoal">{session.title}</span>
          <ListChecks className="size-[11px] text-slate" strokeWidth={1.9} />
        </div>
        <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-fog">
          <CornerDownRight className="size-[11px] text-silver" strokeWidth={1.75} />
          {session.source}
          <span className="mx-0.5 size-[3px] rounded-full bg-smoke" />
          <span className="text-silver">{session.date}</span>
        </div>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="flex h-[24px] items-center gap-1.5 rounded-[6px] border border-ash px-2 text-[10.5px] tabular-nums text-slate">
          <ListChecks className="size-[11px]" strokeWidth={1.75} />
          {session.tasks} zadań
        </span>
        <span className="flex h-[24px] items-center gap-1.5 rounded-[6px] border border-ash px-2 text-[10.5px] tabular-nums text-slate">
          <Target className="size-[11px]" strokeWidth={1.75} />
          {session.score}
        </span>
        <Ellipsis className="ml-1 size-[14px] text-silver" strokeWidth={1.75} />
      </div>
    </div>
  );
}

/* The form ---------------------------------------------------------------- */

function Modal({ frame, opacity }: { frame: number; opacity: number }) {
  const f = frame;
  const { draft } = PRACTICE;
  const typed = Math.max(0, Math.min(draft.topic.length, Math.floor((f - T.typeFrom) / 1.4)));
  const caret = f >= T.typeFrom - 6 && f < T.level && Math.floor(f / 8) % 2 === 0;
  const level = ramp(f, T.level, 10);
  const tags = draft.tags.map((_, i) => ramp(f, T.tags + 4 + i * 5, 10));
  const preview = ramp(f, T.preview, 16);
  const toggle = ramp(f, T.toggle, 8);
  const createPressed = f >= T.create && f < T.create + 6;

  return (
    <div
      className="absolute overflow-hidden rounded-[14px] border border-ash bg-white shadow-[0_12px_40px_rgba(0,0,0,0.12)]"
      style={{ left: M.x, top: M.y, width: M.w, height: M.h, opacity, transform: `scale(${0.97 + opacity * 0.03})` }}
    >
      <div className="flex h-[48px] items-center justify-between border-b border-ash px-[18px]">
        <div className="flex items-center gap-1.5 text-[12px] leading-none">
          <span className="flex items-center gap-1.5 text-fog">
            <PencilLine className="size-[13px]" strokeWidth={1.75} />
            Trening
          </span>
          <ChevronRight className="size-3 text-silver" strokeWidth={1.75} />
          <span className="font-medium text-charcoal">Nowy trening</span>
        </div>
        <X className="size-[14px] text-fog" strokeWidth={1.75} />
      </div>

      <div className="grid h-[354px] grid-cols-[500px_1fr]">
        <div className="space-y-[12px] p-[18px]">
          <Field label="Temat">
            <div className={cn("flex h-[34px] items-center rounded-[8px] border px-3 text-[12px]", f >= s(4.0) && f < T.level ? "border-charcoal/50" : "border-ash")}>
              <span className="text-charcoal">{draft.topic.slice(0, typed)}</span>
              {caret && <span className="ml-px h-[14px] w-px bg-charcoal" />}
              {typed === 0 && !caret && <span className="text-silver">np. Równania kwadratowe</span>}
            </div>
          </Field>

          <div className="grid grid-cols-[200px_1fr] gap-4">
            <Field label="Przedmiot">
              <div className="flex h-[34px] items-center justify-between rounded-[8px] border border-ash px-3 text-[12px] text-charcoal">
                <span className="flex items-center gap-2">
                  <Sigma className="size-[13px] text-slate" strokeWidth={1.9} />
                  {draft.subject}
                </span>
                <svg viewBox="0 0 10 10" className="size-[9px] text-fog" aria-hidden>
                  <path d="M2.5 4 5 6.5 7.5 4" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </Field>
            <Field label="Poziom">
              <div className="relative grid h-[34px] grid-cols-2 rounded-[8px] bg-paper-mist p-[3px] text-[12px]">
                <span
                  className="absolute bottom-[3px] top-[3px] w-[calc(50%-3px)] rounded-[6px] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.08)]"
                  style={{ left: `calc(3px + ${level * 50}% - ${level * 3}px)` }}
                />
                <span className="relative grid place-items-center" style={{ color: level < 0.5 ? "#171717" : "#737373" }}>
                  Podstawa
                </span>
                <span className="relative grid place-items-center" style={{ color: level >= 0.5 ? "#171717" : "#737373" }}>
                  {draft.level}
                </span>
              </div>
            </Field>
          </div>

          <div className="grid grid-cols-[100px_1fr] gap-4">
            <Field label="Liczba zadań">
              <div className="flex h-[34px] items-center rounded-[8px] border border-ash px-3 text-[12px] tabular-nums text-charcoal">
                {draft.count}
              </div>
            </Field>
            <Field label="Tagi">
              <div className="flex h-[34px] items-center gap-1.5 rounded-[8px] border border-ash px-2 text-[12px]">
                {tags.every((t) => t === 0) && <span className="px-1 text-silver">Wybierz tagi</span>}
                {draft.tags.map((tag, i) =>
                  tags[i] > 0 ? (
                    <span
                      key={tag}
                      className={cn(
                        "inline-flex h-[22px] items-center rounded-[5px] px-2 text-[11px] font-medium",
                        i === 0 ? "bg-[#eff6ff] text-[#1d63d8]" : "bg-[#f0fdf4] text-[#15803d]",
                      )}
                      style={{ opacity: tags[i], transform: `scale(${0.9 + tags[i] * 0.1})` }}
                    >
                      {tag}
                    </span>
                  ) : null,
                )}
              </div>
            </Field>
          </div>

          <Field label="Notatka (opcjonalnie)">
            <div className="flex h-[36px] items-center rounded-[8px] border border-ash px-3 text-[12px] text-silver">Dodaj notatkę do treningu</div>
          </Field>

          <div className="flex items-center justify-between">
            <span className="text-[12px] font-medium leading-none text-charcoal">Sprawdzaj od razu</span>
            <span
              className="flex h-[18px] w-[32px] items-center rounded-full p-[2px]"
              style={{ backgroundColor: toggle > 0.5 ? "#171717" : "#e5e5e5" }}
            >
              <span className="size-[14px] rounded-full bg-white shadow-sm" style={{ transform: `translateX(${toggle * 14}px)` }} />
            </span>
          </div>
        </div>

        <div className="border-l border-ash bg-canvas-muted p-[18px]">
          <Field label="Folder">
            <div className="flex h-[34px] items-center gap-2 rounded-[8px] border border-ash bg-white px-3 text-[12px] text-charcoal">
              <FolderOpen className="size-[13px] text-slate" strokeWidth={1.75} />
              Matura 2027
            </div>
          </Field>
          <div className="mt-[18px]">
            <p className="text-[11.5px] font-medium leading-none text-charcoal">Podgląd zadania</p>
            <div
              className="mt-2.5 rounded-[10px] border border-ash bg-white p-3"
              style={{ opacity: 0.35 + preview * 0.65 }}
            >
              {preview > 0 ? (
                <div style={{ opacity: preview, transform: `translateY(${(1 - preview) * 4}px)` }}>
                  <p className="text-[10px] font-medium leading-none text-fog">Zadanie 1 · 1 pkt</p>
                  <p className="mt-2 text-[11.5px] leading-snug text-charcoal">{draft.question}</p>
                  <div className="mt-2.5 space-y-1.5">
                    {draft.options.map((option, i) => (
                      <div key={option} className="flex h-[26px] items-center gap-2 rounded-[7px] border border-ash px-2 text-[11px] text-charcoal">
                        <span className="grid size-[16px] place-items-center rounded-full border border-ash text-[9px] font-medium text-fog">
                          {"ABCD"[i]}
                        </span>
                        {option}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="grid h-[140px] place-items-center text-[11px] text-silver">Podgląd pojawi się po wybraniu tematu</div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-[50px] items-center justify-end gap-2 border-t border-ash px-[18px]">
        <Chip>Anuluj</Chip>
        <PrimaryButton pressed={createPressed}>Utwórz trening</PrimaryButton>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-[11.5px] font-medium leading-none text-charcoal">{label}</p>
      {children}
    </div>
  );
}
