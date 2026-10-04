import { CkeIcon } from "@/components/ui/CkeIcon";
import { E8Icon } from "@/components/ui/E8Icon";
import { MaturaIcon } from "@/components/ui/MaturaIcon";
import { GridSection } from "@/components/roadmap/sections";

/*
 * dub.co/solutions/creators' logo strip under the hero (live DOM,
 * 2026-10-02): one muted line, then four wordmarks spread across the
 * column, each with a tiny uppercase chip under it. Dub's are the creators
 * who use it; these are the exams a simulation can be — the official marks,
 * as they are (never redrawn), each with its Satoshi name.
 */

const EXAMS = [
  { mark: <E8Icon className="h-5 w-6" />, name: "Ósmoklasista", chip: "Egzamin ósmoklasisty" },
  { mark: <MaturaIcon className="h-5 w-6" />, name: "Matura", chip: "Poziom podstawowy" },
  { mark: <MaturaIcon className="h-5 w-6" />, name: "Rozszerzona", chip: "Poziom rozszerzony" },
  { mark: <CkeIcon className="h-5 w-auto" />, name: "Arkusze", chip: "Oficjalne CKE" },
];

export function ExamBand() {
  return (
    <GridSection labelledBy="exam-band-heading">
      <div className="py-8">
        <p id="exam-band-heading" className="mx-auto max-w-sm text-balance text-center text-sm font-medium text-fog">
          Symulacje każdego egzaminu CKE
        </p>
        <ul className="mt-6 flex flex-wrap items-start justify-around gap-8 px-4">
          {EXAMS.map((exam) => (
            <li key={exam.name} className="flex flex-col items-center gap-2 px-2 py-1">
              <span className="flex h-6 items-center gap-2">
                {exam.mark}
                <span className="whitespace-nowrap font-satoshi text-lg font-bold tracking-tight text-charcoal">{exam.name}</span>
              </span>
              <MarkChip>{exam.chip}</MarkChip>
            </li>
          ))}
        </ul>
      </div>
    </GridSection>
  );
}

/**
 * Dub's tiny uppercase "Case study" chip, under a wordmark in a logo strip.
 * Always a block box: as a bare inline span its block-level label splits it,
 * and the tint collapses into a thin bar beside the text.
 */
export function MarkChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="relative block w-fit overflow-hidden rounded-md px-1.5 py-0.5 [box-shadow:0_1px_0_0_#0000001a_inset]">
      <span aria-hidden className="absolute inset-0 bg-black opacity-5 [mask-image:linear-gradient(black,transparent)]" />
      <span className="relative block whitespace-nowrap text-[0.5rem] font-semibold uppercase leading-tight text-charcoal/60">{children}</span>
    </span>
  );
}
