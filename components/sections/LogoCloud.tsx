import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

const exams: Array<{ label: string; sub?: string }> = [
  { label: "Egzamin ósmoklasisty", sub: "3 przedmioty" },
  { label: "Matura podstawowa" },
  { label: "Matura rozszerzona" },
  { label: "Arkusze CKE", sub: "oficjalne zadania" },
  { label: "Matematyka" },
  { label: "Język polski" },
  { label: "Język angielski" },
  { label: "Więcej przedmiotów", sub: "wkrótce" },
];

/**
 * Exam coverage grid — a single clean uniform wordmark treatment (no
 * mixed-font fake logos), with a hover-revealed sub-label on selected
 * entries, mirroring the reference's logo cloud behaviour.
 */
export function LogoCloud() {
  return (
    <section
      aria-label="Egzaminy i przedmioty w Examax"
      className="relative border-y border-ash bg-white"
    >
      <Container className="py-12">
        <Reveal>
          <p className="text-center text-[12px] font-medium uppercase tracking-[0.14em] text-fog">
            Jedna platforma, oba egzaminy CKE
          </p>
        </Reveal>
        <ul className="mt-8 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4">
          {exams.map((exam, index) => (
            <li key={exam.label} className="flex items-center justify-center">
              <Reveal delay={(index % 4) * 40}>
                <span className="group relative flex flex-col items-center">
                  <span className="text-center font-satoshi text-[19px] font-bold leading-none tracking-tight text-graphite/70 transition-colors duration-200 group-hover:text-graphite sm:text-[20px]">
                    {exam.label}
                  </span>
                  {exam.sub ? (
                    <span
                      aria-hidden
                      className="pointer-events-none absolute top-full mt-1.5 rounded-full bg-paper-mist px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-steel opacity-0 transition-all duration-200 group-hover:translate-y-0.5 group-hover:opacity-100"
                    >
                      {exam.sub}
                    </span>
                  ) : null}
                </span>
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
