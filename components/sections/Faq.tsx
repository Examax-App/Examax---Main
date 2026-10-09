"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

type FaqItem = { question: string; answer: React.ReactNode };

const strong = (label: string) => <strong className="font-semibold text-charcoal">{label}</strong>;

const faqs: FaqItem[] = [
  {
    question: "Do jakich egzaminów przygotowuje Examax?",
    answer:
      "Do egzaminu ósmoklasisty oraz matury — na poziomie podstawowym i rozszerzonym. Zaczynamy od matematyki, języka polskiego i języka angielskiego, a kolejne przedmioty będziemy dodawać.",
  },
  {
    question: "Czy zadania w Examax naprawdę pochodzą z arkuszy CKE?",
    answer:
      "Tak. Trenujesz na zadaniach z oficjalnych arkuszy egzaminacyjnych CKE z poprzednich lat. Każde zadanie ma przypisane źródło i jest oceniane zgodnie z zasadami punktacji egzaminacyjnej.",
  },
  {
    question: "Czym Examax różni się od zwykłej aplikacji z quizami?",
    answer:
      "Quiz pokazuje wynik. Examax pomaga zrozumieć, co zrobić dalej. Roadmapa prowadzi przez cały materiał, trening wzmacnia słabe obszary, a Korepetytor AI pomaga zrozumieć błędy.",
  },
  {
    question: "Jak działa Korepetytor AI?",
    answer: (
      <>
        <p>
          Korepetytor AI korzysta z Twoich wyników, postępów i rozwiązywanych zadań, aby lepiej dopasować wyjaśnienia. Pokazuje rozwiązanie krok po kroku i
          pomaga zdecydować, co warto przećwiczyć dalej.
        </p>
        <p>
          Jak każde AI może popełnić błąd — dlatego traktuj jego odpowiedzi jako pomoc w nauce, a nie zastępstwo oficjalnych materiałów egzaminacyjnych.
        </p>
      </>
    ),
  },
  {
    question: "Czy Examax zastępuje korepetycje?",
    answer:
      "Nie musi. Examax daje Ci plan nauki, zadania i pomoc wtedy, kiedy jej potrzebujesz. Możesz uczyć się samodzielnie albo korzystać z niego razem z korepetycjami.",
  },
  {
    question: "Ile kosztuje Examax?",
    answer: (
      <>
        <p>
          Plan {strong("Free")} jest darmowy i nie wymaga podawania karty. Obejmuje roadmapę oraz trening zadań.
        </p>
        <p>
          Plan {strong("Pro")} kosztuje 49 zł miesięcznie, a {strong("Max")} 79 zł miesięcznie. Przy płatności rocznej oszczędzasz równowartość dwóch
          miesięcy. Wszystkie plany działają zarówno dla egzaminu ósmoklasisty, jak i matury.
        </p>
      </>
    ),
  },
  {
    question: "Kiedy pojawią się symulacje egzaminu?",
    answer: (
      <>
        <p>
          Pracujemy nad symulacjami pełnych arkuszy w warunkach zbliżonych do prawdziwego egzaminu — z limitem czasu i raportem wyników.
        </p>
        <p>Po uruchomieniu będą dostępne zgodnie z wybranym planem. Informacje o premierze pojawią się w Aktualnościach.</p>
      </>
    ),
  },
  {
    question: "Jak dbacie o moje dane?",
    answer: (
      <>
        <p>
          Twoje dane należą do Ciebie. Nie sprzedajemy ich i przetwarzamy je zgodnie z obowiązującymi przepisami o ochronie danych, w tym RODO.
        </p>
        <p>Możesz w każdej chwili zarządzać swoim kontem, poprosić o dostęp do danych lub usunąć konto.</p>
      </>
    ),
  },
];

/**
 * The FAQ, as dub.co/startups sets its own (`container.png`, read off the
 * live page): one centred 768px column, the heading above, then a quiet
 * list — each question on a hairline, a "+" that turns to "×" as the answer
 * slides open. Everything starts closed, and one answer is open at a time.
 *
 * The landing page renders it as-is. /pricing passes its own questions —
 * dub.co/pricing closes on this same accordion — and a `className` for its
 * column rules.
 */
export function Faq({
  items = faqs,
  heading = "Najczęściej zadawane pytania",
  className,
}: {
  items?: FaqItem[];
  heading?: string;
  className?: string;
} = {}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" aria-labelledby="faq-heading" className={cn("col-rules border-t border-ash bg-white", className)}>
      <Container>
        <div className="relative mx-auto w-full max-w-screen-md px-3 py-14 sm:py-20 lg:px-10">
          <Reveal>
            <h2 id="faq-heading" className="mb-10 font-satoshi text-3xl font-medium text-charcoal sm:text-4xl">
              {heading}
            </h2>
          </Reveal>

          <div className="px-3 sm:px-0">
            {items.map((faq, index) => {
              const open = openIndex === index;
              return (
                <div key={faq.question} className="border-b border-ash py-3 last:border-none">
                  <h3 className="flex">
                    <button
                      type="button"
                      onClick={() => setOpenIndex(open ? null : index)}
                      aria-expanded={open}
                      aria-controls={`faq-panel-${index}`}
                      id={`faq-button-${index}`}
                      className="focus-ring flex flex-1 cursor-pointer items-center justify-between gap-6 rounded-sm py-4 text-left text-body-lg font-medium text-charcoal"
                    >
                      {faq.question}
                      {/* Dub's own "+", 1.5 stroke; a quarter-turn short of
                          a half makes it the "×" that closes the answer. */}
                      <svg
                        viewBox="0 0 18 18"
                        aria-hidden
                        className={cn(
                          "size-5 flex-none text-charcoal transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none",
                          open && "rotate-45",
                        )}
                      >
                        <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5">
                          <line x1="9" x2="9" y1="3.25" y2="14.75" />
                          <line x1="3.25" x2="14.75" y1="9" y2="9" />
                        </g>
                      </svg>
                    </button>
                  </h3>
                  {/* The answer slides open from 0fr to 1fr; closed, it is inert. */}
                  <div
                    id={`faq-panel-${index}`}
                    role="region"
                    aria-labelledby={`faq-button-${index}`}
                    aria-hidden={!open}
                    inert={!open}
                    className={cn(
                      "grid transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none",
                      open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                    )}
                  >
                    <div className="min-h-0 overflow-hidden">
                      <div className="space-y-3 pb-4 pr-11 text-body-sm text-fog sm:text-body-lg">{faq.answer}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
