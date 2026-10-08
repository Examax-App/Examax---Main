import Link from "@/components/ui/Link";
import { Reveal } from "@/components/ui/Reveal";
import { DotPattern } from "@/components/about/DotPattern";
import { FilmCard } from "@/components/about/FilmCard";

/*
 * dub.co/about's second band: "What is Dub?" over a dot field, a line of
 * prose with dotted-underline links to the products, the video card, then
 * the mission — a smaller heading and two muted paragraphs.
 */

/** Links inside the prose: dotted underline, darker on hover. */
const PROSE_LINKS = "[&_a]:text-slate [&_a]:underline [&_a]:decoration-dotted [&_a]:underline-offset-2 [&_a]:transition-colors hover:[&_a]:text-charcoal";

export function StorySection() {
  return (
    <section aria-labelledby="story-heading" className="relative overflow-clip border-b border-ash bg-white px-4">
      <div className="relative z-0 mx-auto max-w-[var(--page-max-width)] border-x border-ash px-2.5 py-28 text-lg lg:px-20">
        <div aria-hidden className="absolute inset-x-4 bottom-8 top-4 sm:inset-x-16 sm:top-16">
          <DotPattern />
        </div>

        <div className="relative">
          <Reveal className="mx-auto w-full max-w-xl px-4 text-center">
            <h2 id="story-heading" className="text-balance font-satoshi text-3xl font-medium text-charcoal sm:text-4xl">
              Czym jest Examax?
            </h2>
            <p className={`mt-8 text-balance text-lg text-slate ${PROSE_LINKS}`}>
              Examax to platforma do przygotowania do egzaminu ósmoklasisty i matury. Łączy{" "}
              <Link href="/training">trening z arkuszy CKE</Link>, <Link href="/roadmap">plan nauki</Link>,{" "}
              <Link href="/progress">śledzenie postępów</Link> i{" "}
              <Link href="/simulation">symulacje egzaminu</Link> w jedną ścieżkę, a <Link href="/agents">Korepetytor AI</Link> pomaga zrozumieć
              zadania, z którymi masz problem.
            </p>
          </Reveal>

          <Reveal delay={100} className="mt-14">
            <FilmCard />
          </Reveal>

          <Reveal delay={100} className="mt-14 flex flex-col items-center px-4 text-center">
            <h3 className="max-w-[600px] text-pretty font-satoshi text-3xl font-medium text-charcoal">
              Chcemy, żeby wynik egzaminu mówił o tym, co umiesz — nie o tym, czy stać Cię na korepetycje.
            </h3>
            <div className={`mt-6 max-w-lg space-y-6 text-pretty text-base text-fog ${PROSE_LINKS}`}>
              <p>
                Egzamin ósmoklasisty i matura decydują o tym, do jakiej szkoły i na jakie studia trafisz. Arkusze CKE i zasady oceniania są
                publiczne, a mimo to wielu uczniów wciąż uczy się z rozproszonych materiałów i kluczy odpowiedzi bez szczegółowych wyjaśnień.
              </p>
              <p>
                Examax układa to w jedną ścieżkę: krótki test na start, zadania w formacie CKE sprawdzane według kryteriów, pełne arkusze na
                czas i Korepetytor AI, który tłumaczy błąd krok po kroku, zamiast podawać gotowy wynik. Dzięki temu wiesz nie tylko, ile masz
                punktów, ale też dlaczego je straciłeś.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
