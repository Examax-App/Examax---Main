import { LineChart, ScanFace, Table2 } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Avatar } from "@/components/ui/Avatar";
import { Sparkline } from "@/components/ui/Sparkline";

function StudentCard() {
  return (
    <div className="w-60 -rotate-3 rounded-cards border border-ash bg-white shadow-md transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
      <div className="border-b border-ash p-4">
        <p className="text-[12px] font-medium text-fog">Marzec 2027</p>
        <dl className="mt-3 space-y-1.5 text-[13px]">
          {[
            { dot: "bg-electric-blue", label: "Zadania", value: "3 214" },
            { dot: "bg-[#60a5fa]", label: "Poprawne", value: "2 705" },
            { dot: "bg-[#93c5fd]", label: "Opanowane", value: "38 tematów" },
          ].map((row) => (
            <div key={row.label} className="flex items-center gap-2">
              <span className={`size-2 rounded-[3px] ${row.dot}`} aria-hidden />
              <dt className="text-steel">{row.label}</dt>
              <dd className="ml-auto font-medium text-charcoal">{row.value}</dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="p-4">
        <div className="flex items-center gap-3">
          <Avatar name="Ala Wiśniewska" size="lg" />
          <div>
            <p className="text-body font-semibold text-charcoal">Ala Wiśniewska</p>
            <p className="text-[12px] text-fog">ala@examax.app</p>
          </div>
        </div>
        <dl className="mt-4 space-y-1.5 text-[13px]">
          {[
            { label: "Arkusz próbny", value: "82%" },
            { label: "Gotowość", value: "76%" },
            { label: "Seria nauki", value: "34 dni" },
          ].map((row) => (
            <div key={row.label} className="flex justify-between">
              <dt className="text-fog">{row.label}</dt>
              <dd className="font-medium text-charcoal">{row.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

function FunnelCard() {
  return (
    <div className="w-64 rotate-3 rounded-cards border border-ash bg-white p-4 shadow-md transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Przerobione", value: "3 214" },
          { label: "Skuteczność", value: "84%" },
          { label: "Opanowane", value: "38" },
        ].map((stat) => (
          <div key={stat.label}>
            <p className="text-[10px] text-fog">{stat.label}</p>
            <p className="mt-0.5 text-body-lg font-medium leading-none text-charcoal">
              {stat.value}
            </p>
          </div>
        ))}
      </div>
      <Sparkline className="mt-4 h-14 w-full" />
      <p className="mt-2 text-[11px] text-fog">Opanowanie w ostatnich 90 dniach</p>
    </div>
  );
}

/**
 * Centered editorial statement over the dotted texture, flanked by floating
 * UI cards — the reference's z-pattern "philosophy" section.
 */
export function Editorial() {
  return (
    <section
      id="metoda"
      aria-label="Dlaczego Examax"
      className="relative overflow-hidden bg-white"
    >
      <div className="bg-dots mask-fade-edges absolute inset-0" aria-hidden />
      <Container className="relative py-24">
        {/* Floating outline icon tiles */}
        <div aria-hidden className="pointer-events-none absolute inset-0 hidden lg:block">
          <span className="absolute left-16 top-20 grid size-12 -rotate-6 place-items-center rounded-cards border border-ash bg-white text-steel shadow-subtle">
            <ScanFace className="size-5" />
          </span>
          <span className="absolute left-40 top-40 grid size-12 rotate-3 place-items-center rounded-cards border border-ash bg-white text-steel shadow-subtle">
            <LineChart className="size-5" />
          </span>
          <span className="absolute right-40 top-16 grid size-12 rotate-6 place-items-center rounded-cards border border-ash bg-white text-steel shadow-subtle">
            <Table2 className="size-5" />
          </span>
        </div>

        <div className="grid items-center gap-14 lg:grid-cols-[auto_1fr_auto]">
          <Reveal className="hidden lg:block">
            <div className="animate-float">
              <StudentCard />
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="mx-auto max-w-2xl space-y-8 text-heading font-normal text-charcoal">
              <p>
                Quiz sprawdza, co umiesz.
                <br />
                Nie mówi, co dalej.
              </p>
              <p>
                Examax łączy{" "}
                <span className="font-medium text-tangerine">roadmapę</span>,{" "}
                <span className="font-medium text-vivid-green">zadania CKE</span>{" "}
                i{" "}
                <span className="font-medium text-lavender">agenta AI</span> —
                w jeden system przygotowań.
              </p>
              <p>
                Od zrozumienia egzaminu do pełnej gotowości. Krok po kroku,
                dzień po dniu.
              </p>
              <p className="text-fog">
                Bo dobry wynik to nie kwestia szczęścia. To kwestia systemu.
              </p>
            </div>
          </Reveal>

          <Reveal delay={200} className="hidden lg:block">
            <div className="animate-float-delayed">
              <FunnelCard />
            </div>
          </Reveal>
        </div>

        {/* Floating cards stack under the text on smaller screens */}
        <div className="mt-14 flex flex-wrap items-center justify-center gap-8 lg:hidden">
          <Reveal>
            <StudentCard />
          </Reveal>
          <Reveal delay={100}>
            <FunnelCard />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
