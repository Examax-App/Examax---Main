"use client";

import { ArrowRight, BookOpenCheck } from "lucide-react";
import { Modal } from "@/components/ui/Modal";

/**
 * The reference import dialog ("Import Your Bitly Links"): two service
 * glyphs joined by an arrow, a one-liner, and a single sign-in action over
 * the muted footer.
 */
export function ImportModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Modal open={open} onClose={onClose} labelledBy="import-modal-title">
      <div className="px-8 pb-6 pt-8 text-center">
        <div className="flex items-center justify-center gap-3">
          <span
            aria-hidden
            className="grid size-11 place-items-center rounded-full bg-soft-mint text-[#166534]"
          >
            <BookOpenCheck className="size-5" strokeWidth={1.8} />
          </span>
          <ArrowRight className="size-4 text-fog" aria-hidden />
          <span
            aria-hidden
            className="grid size-11 place-items-center rounded-full bg-midnight-ink"
          >
            <svg viewBox="0 0 32 32" className="size-9" role="presentation">
              <path
                d="M10 20.5 16 9.5l6 11M12.4 16.6h7.2"
                fill="none"
                stroke="#ffffff"
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
        <h2
          id="import-modal-title"
          className="mt-5 text-body-xl font-semibold text-charcoal"
        >
          Zaimportuj swoje materiały
        </h2>
        <p className="mx-auto mt-2 max-w-xs text-body text-steel">
          Przenieś zadania i notatki z Google Classroom do Examax w kilka
          kliknięć.
        </p>
      </div>
      <div className="flex flex-col items-center gap-3 rounded-b-largecards border-t border-ash bg-[#fafafa] px-8 py-6">
        <button
          type="button"
          className="flex h-10 w-full items-center justify-center gap-2 rounded-buttons border border-ash bg-white text-body font-medium text-charcoal shadow-subtle transition-colors hover:border-smoke"
        >
          <BookOpenCheck className="size-4 text-[#166534]" aria-hidden />
          Zaloguj się przez Google Classroom
        </button>
        <a href="#" className="link-underline text-body text-fog">
          Przeczytaj przewodnik
        </a>
      </div>
    </Modal>
  );
}
