"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

const faqs: Array<{ question: string; answer: React.ReactNode }> = [
  {
    question: "Do których egzaminów przygotowuje Examax?",
    answer:
      "Do egzaminu ósmoklasisty oraz matury — na poziomie podstawowym i rozszerzonym. Zaczynamy od matematyki, języka polskiego i języka angielskiego, a lista przedmiotów rośnie.",
  },
  {
    question: "Czy zadania naprawdę pochodzą z arkuszy CKE?",
    answer:
      "Tak. Trenujesz na zadaniach z oficjalnych arkuszy egzaminacyjnych z poprzednich lat, uzupełnionych o zadania przygotowane w tym samym formacie i punktowane według tych samych zasad.",
  },
  {
    question: "Czym Examax różni się od aplikacji z quizami?",
    answer:
      "Quiz sprawdza, co umiesz — Examax dodatkowo mówi, co dalej. Roadmapa układa cały materiał w kolejne kroki, trening wzmacnia słabe punkty, a agent tłumaczy błędy. To system przygotowań, nie zbiór pytań.",
  },
  {
    question: "Jak działa Agent Examax?",
    answer:
      "Agent widzi Twoją roadmapę, Twoje odpowiedzi i Twoje wcześniejsze błędy. Kiedy pytasz o zadanie, tłumaczy je krok po kroku i podpowiada, co przećwiczyć dalej. Jak każde AI może się mylić — dlatego zawsze łączymy jego wyjaśnienia z oficjalnymi zasadami oceniania.",
  },
  {
    question: "Czy Examax zastępuje korepetycje?",
    answer:
      "Nie obiecujemy cudów. Examax daje Ci system: plan, zadania i wyjaśnienia dostępne o każdej porze. Dla wielu osób to wystarcza; innym pomaga wyciągnąć więcej z korepetycji, bo na zajęcia przychodzą z konkretnymi pytaniami.",
  },
  {
    question: "Ile kosztuje Examax?",
    answer: (
      <>
        Plan{" "}
        <strong className="font-semibold text-charcoal">Darmowy</strong> jest
        bezpłatny na zawsze i nie wymaga karty. Plan{" "}
        <strong className="font-semibold text-charcoal">Premium</strong>{" "}
        kosztuje 29 zł miesięcznie (24 zł przy płatności rocznej) i odblokowuje
        pełną roadmapę, trening bez limitów i agenta bez ograniczeń.
      </>
    ),
  },
  {
    question: "Kiedy pojawią się symulacje egzaminu?",
    answer:
      "Pracujemy nad nimi teraz — z pełnym formatem arkusza, czasem liczonym jak na sali i raportem gotowości po zakończeniu. Symulacje trafią najpierw do planu Premium; ogłosimy start na tej stronie i w aplikacji.",
  },
  {
    question: "Co z moimi danymi?",
    answer:
      "Twoje dane należą do Ciebie. Szyfrujemy je w trakcie przesyłania i przechowywania, nie sprzedajemy ich nikomu i działamy zgodnie z RODO. W każdej chwili możesz je wyeksportować albo usunąć konto.",
  },
];

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="col-rules border-t border-ash bg-white"
    >
      <Container className="py-20">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <h2
              id="faq-heading"
              className="font-satoshi text-heading-lg font-medium leading-[1.15] text-charcoal sm:text-display sm:leading-[1.15]"
            >
              Częste pytania
            </h2>
          </Reveal>

          <div className="mt-12">
            {faqs.map((faq, index) => {
              const open = openIndex === index;
              return (
                <Reveal key={faq.question} delay={index * 60}>
                  <div className="border-b border-ash">
                    <h3>
                      <button
                        type="button"
                        onClick={() => setOpenIndex(open ? null : index)}
                        aria-expanded={open}
                        aria-controls={`faq-panel-${index}`}
                        id={`faq-button-${index}`}
                        className="focus-ring flex w-full items-center justify-between gap-6 py-6 text-left text-body-xl font-semibold text-charcoal transition-colors duration-150 hover:text-steel"
                      >
                        {faq.question}
                        <ChevronDown
                          className={cn(
                            "size-4 shrink-0 text-fog transition-transform duration-150 ease-out",
                            open && "rotate-180",
                          )}
                          aria-hidden
                        />
                      </button>
                    </h3>
                    <div
                      id={`faq-panel-${index}`}
                      role="region"
                      aria-labelledby={`faq-button-${index}`}
                      hidden={!open}
                      className="pb-6"
                    >
                      <p className="max-w-2xl text-body-lg text-steel">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
