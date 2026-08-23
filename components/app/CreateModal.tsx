"use client";

import {
  Check,
  ChevronDown,
  CornerDownLeft,
  Crown,
  FolderOpen,
  Gift,
  Globe,
  Hourglass,
  Image as ImageIcon,
  Link2,
  Lock,
  Pencil,
  Shuffle,
  SlidersHorizontal,
  Target,
  X,
} from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { FieldLabel, Input, Textarea } from "@/components/ui/Input";
import { Toggle } from "@/components/ui/Toggle";
import { CircleHelp } from "lucide-react";

/** Tiny decorative QR placeholder — no external assets. */
function QrGlyph() {
  const cells = [
    [0, 0], [1, 0], [2, 0], [4, 0], [6, 0], [0, 1], [2, 1], [6, 1],
    [0, 2], [1, 2], [2, 2], [4, 2], [5, 2], [6, 2], [1, 4], [3, 4],
    [5, 4], [0, 5], [2, 5], [4, 5], [6, 5], [0, 6], [1, 6], [2, 6],
    [4, 6], [6, 6], [3, 3], [5, 3],
  ];
  return (
    <svg viewBox="0 0 7 7" className="size-14" aria-hidden>
      {cells.map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width="0.85" height="0.85" fill="#171717" />
      ))}
    </svg>
  );
}

const footerOptions = [
  { icon: SlidersHorizontal, label: "Poziom" },
  { icon: Target, label: "Zakres" },
  { icon: Shuffle, label: "Wariant A/B" },
  { icon: Lock, label: "Hasło" },
  { icon: Hourglass, label: "Termin" },
];

/**
 * The reference "New link" composer, rebuilt 1:1: breadcrumb header with a
 * draft indicator, a two-column body (fields left, folder/QR/preview right),
 * and the option-chip footer with the primary submit.
 */
export function CreateModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Modal open={open} onClose={onClose} size="lg" labelledBy="create-modal-title">
      <div className="flex items-center justify-between gap-4 px-6 py-4">
        <p id="create-modal-title" className="flex items-center gap-2 text-body-lg text-steel">
          Zadania
          <span aria-hidden className="text-pebble">›</span>
          <Globe className="size-4 text-fog" aria-hidden />
          <span className="font-medium text-charcoal">Nowe zadanie</span>
        </p>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 text-body text-fog">
            <Check className="size-3.5" aria-hidden />
            Szkic zapisany
          </span>
          <button
            type="button"
            aria-label="Zamknij"
            onClick={onClose}
            className="grid size-8 place-items-center rounded-buttons text-steel transition-colors hover:bg-paper-mist hover:text-charcoal"
          >
            <X className="size-4.5" />
          </button>
        </div>
      </div>

      <div className="grid gap-6 px-6 pb-6 lg:grid-cols-[1.35fr_1fr]">
        {/* Left column — the form */}
        <div>
          <FieldLabel htmlFor="create-source">
            <span className="inline-flex items-center gap-1.5">
              Materiał źródłowy
              <CircleHelp className="size-3.5 text-fog" aria-hidden />
            </span>
          </FieldLabel>
          <Input
            id="create-source"
            emphasis
            placeholder="https://cke.gov.pl/arkusze/matematyka-2024"
          />

          <div className="mt-5 flex items-center justify-between">
            <FieldLabel htmlFor="create-name">Nazwa zadania</FieldLabel>
            <div className="mb-2 flex items-center gap-2 text-fog">
              <Shuffle className="size-3.5" aria-hidden />
              <Pencil className="size-3.5" aria-hidden />
            </div>
          </div>
          <div className="flex">
            <button
              type="button"
              className="flex h-10 shrink-0 items-center gap-1.5 rounded-l-inputs border border-r-0 border-ash bg-white px-3 text-body text-charcoal hover:bg-paper-mist"
            >
              matura
              <ChevronDown className="size-3.5 text-fog" aria-hidden />
            </button>
            <input
              id="create-name"
              defaultValue="procenty-01"
              className="h-10 w-full min-w-0 rounded-r-inputs border border-ash bg-white px-3 text-body text-charcoal focus:outline-2 focus:outline-offset-2 focus:outline-charcoal"
            />
          </div>

          <div className="mt-4 flex items-center gap-3 rounded-cards bg-gradient-to-r from-soft-mint/80 to-soft-mint/30 px-3.5 py-2.5">
            <span
              aria-hidden
              className="grid size-6 shrink-0 place-items-center rounded-full border border-vivid-green/30 bg-white text-vivid-green"
            >
              <Gift className="size-3.5" />
            </span>
            <p className="min-w-0 flex-1 truncate text-body text-charcoal">
              Odbierz <span className="font-semibold">30 dni</span> Premium za
              darmo.{" "}
              <a href="#pricing" className="underline">
                Dowiedz się więcej
              </a>
            </p>
            <button
              type="button"
              className="shrink-0 rounded-buttons border border-vivid-green/40 bg-white px-3 py-1.5 text-body font-medium text-[#166534] transition-colors hover:bg-soft-mint/60"
            >
              Odbierz
            </button>
            <button
              type="button"
              aria-label="Zamknij"
              className="grid size-6 shrink-0 place-items-center rounded-full text-steel hover:text-charcoal"
            >
              <X className="size-3.5" />
            </button>
          </div>

          <div className="mt-5 flex items-center justify-between">
            <FieldLabel htmlFor="create-tags">
              <span className="inline-flex items-center gap-1.5">
                Etykiety
                <CircleHelp className="size-3.5 text-fog" aria-hidden />
              </span>
            </FieldLabel>
            <span className="mb-2 text-body text-fog">Zarządzaj</span>
          </div>
          <Input id="create-tags" placeholder="Wybierz etykiety..." />

          <div className="mt-5">
            <FieldLabel htmlFor="create-notes">
              <span className="inline-flex items-center gap-1.5">
                Notatki
                <CircleHelp className="size-3.5 text-fog" aria-hidden />
              </span>
            </FieldLabel>
            <Textarea id="create-notes" rows={3} placeholder="Dodaj notatkę" />
          </div>

          <div className="mt-5 flex items-center justify-between">
            <p className="inline-flex items-center gap-1.5 text-body font-medium text-charcoal">
              Tryb egzaminu
              <CircleHelp className="size-3.5 text-fog" aria-hidden />
            </p>
            <span className="inline-flex items-center gap-1.5">
              <Crown className="size-3.5 text-fog" aria-hidden />
              <Toggle label="Tryb egzaminu" size="sm" disabled />
            </span>
          </div>
        </div>

        {/* Right column — folder, QR, preview */}
        <div className="rounded-largecards border border-ash bg-[#fafafa] p-4">
          <FieldLabel htmlFor="create-folder">
            <span className="inline-flex items-center gap-1.5">
              Folder
              <CircleHelp className="size-3.5 text-fog" aria-hidden />
            </span>
          </FieldLabel>
          <button
            id="create-folder"
            type="button"
            className="flex h-10 w-full items-center justify-between rounded-inputs border border-ash bg-white px-3 text-body text-charcoal hover:border-smoke"
          >
            <span className="inline-flex items-center gap-2">
              <span
                aria-hidden
                className="grid size-5 place-items-center rounded-[5px] bg-soft-mint text-[#166534]"
              >
                <FolderOpen className="size-3" />
              </span>
              Zadania
            </span>
            <ChevronDown className="size-3.5 text-fog" aria-hidden />
          </button>

          <div className="mt-4 flex items-center justify-between">
            <p className="inline-flex items-center gap-1.5 text-body font-medium text-charcoal">
              Kod QR
              <CircleHelp className="size-3.5 text-fog" aria-hidden />
            </p>
          </div>
          <div className="relative mt-2 grid place-items-center rounded-cards border border-ash bg-white py-6">
            <QrGlyph />
            <button
              type="button"
              aria-label="Edytuj kod QR"
              className="absolute right-2 top-2 grid size-7 place-items-center rounded-buttons border border-ash bg-white text-steel shadow-subtle hover:text-charcoal"
            >
              <Pencil className="size-3.5" />
            </button>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <p className="inline-flex items-center gap-1.5 text-body font-medium text-charcoal">
              Podgląd zadania
              <CircleHelp className="size-3.5 text-fog" aria-hidden />
            </p>
            <span className="inline-flex items-center gap-1.5">
              <Crown className="size-3.5 text-fog" aria-hidden />
              <Toggle label="Własny podgląd" size="sm" disabled />
            </span>
          </div>
          <div className="mt-2 flex gap-1.5">
            {[Globe, Link2, ImageIcon].map((Icon, index) => (
              <button
                key={index}
                type="button"
                className={
                  index === 0
                    ? "grid h-8 flex-1 place-items-center rounded-buttons border border-ash bg-white text-charcoal shadow-subtle"
                    : "grid h-8 flex-1 place-items-center rounded-buttons text-steel hover:bg-white"
                }
              >
                <Icon className="size-3.5" aria-hidden />
              </button>
            ))}
          </div>
          <div className="bg-dots mt-2 grid min-h-36 place-items-center rounded-cards border border-ash bg-white p-4 text-center">
            <p className="max-w-40 text-body text-fog">
              <ImageIcon className="mx-auto mb-2 size-4" aria-hidden />
              Wskaż materiał, aby wygenerować podgląd
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-b-largecards border-t border-ash bg-[#fafafa] px-6 py-4">
        <div className="flex flex-wrap items-center gap-2">
          {footerOptions.map((option) => (
            <button
              key={option.label}
              type="button"
              className="inline-flex items-center gap-1.5 rounded-buttons border border-ash bg-white px-3 py-1.5 text-body font-medium text-charcoal shadow-subtle transition-colors hover:border-smoke"
            >
              <option.icon className="size-3.5 text-steel" aria-hidden />
              {option.label}
            </button>
          ))}
          <button
            type="button"
            aria-label="Więcej opcji"
            className="rounded-buttons border border-ash bg-white px-2.5 py-1.5 text-body font-medium text-charcoal shadow-subtle hover:border-smoke"
          >
            ⋯
          </button>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center gap-2 rounded-buttons bg-primary-action-fill px-4 py-2 text-body font-medium text-white shadow-subtle transition-colors hover:bg-graphite"
        >
          Utwórz zadanie
          <CornerDownLeft className="size-3.5 opacity-70" aria-hidden />
        </button>
      </div>
    </Modal>
  );
}
