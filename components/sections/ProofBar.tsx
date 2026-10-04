import { BookMarked, FileText, GraduationCap } from "lucide-react";
import { Container } from "@/components/ui/Container";
import type { LucideIcon } from "lucide-react";

const cells: Array<{ icon: LucideIcon; label: string; sub: string }> = [
  {
    icon: FileText,
    label: "Oficjalne arkusze CKE",
    sub: "zadania w formacie egzaminacyjnym",
  },
  {
    icon: GraduationCap,
    label: "Egzamin ósmoklasisty i matura",
    sub: "poziom podstawowy i rozszerzony",
  },
  {
    icon: BookMarked,
    label: "Matematyka · polski · angielski",
    sub: "kolejne przedmioty w drodze",
  },
];

/**
 * Static proof row in the reference's logo-wall discipline: hairline-divided
 * cells, greyscale, no motion — replaces the scrolling text marquee.
 */
export function ProofBar() {
  return (
    <section aria-label="Zakres materiału" className="col-rules border-t border-ash bg-white">
      <Container>
        <div className="grid divide-y divide-ash sm:grid-cols-3 sm:divide-x sm:divide-y-0">
      {cells.map((cell) => (
        <div
          key={cell.label}
          className="flex flex-col items-center gap-1.5 px-6 py-10 text-center"
        >
          <cell.icon className="size-5 text-steel" strokeWidth={1.6} aria-hidden />
          <p className="mt-1.5 text-body font-medium text-charcoal">
            {cell.label}
          </p>
          <p className="text-[13px] text-fog">{cell.sub}</p>
        </div>
      ))}
        </div>
      </Container>
    </section>
  );
}
