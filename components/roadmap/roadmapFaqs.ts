import type { FaqItem } from "@/components/sections/FaqAccordion";

/**
 * The six questions /roadmap answers inline.
 *
 * Data rather than a component: the accordion itself is shared
 * (components/sections/FaqAccordion), and every product page brings its own
 * six. Answers stay honest about what is not built yet.
 */
export const roadmapFaqs: FaqItem[] = [
  {
    question: "Czy mogę zmienić kolejność tematów?",
    answer:
      "Tak. Możesz przypiąć temat na początek, odłożyć go albo oznaczyć jako opanowany bez przechodzenia przez niego. Examax przeliczy resztę planu i powie, co to zmienia — jeśli pominiesz temat, od którego zależą kolejne, dostaniesz o tym ostrzeżenie, a nie cichą blokadę.",
  },
  {
    question: "Skąd Examax wie, ile mam czasu?",
    answer:
      "Z daty egzaminu, którą ustawiasz przy zakładaniu konta — domyślnie orientacyjny termin sesji CKE. Plan jest liczony wstecz od tego dnia, więc liczba tematów na tydzień wynika z tego, ile tygodni faktycznie zostało.",
  },
  {
    question: "Co, jeśli wypadnę z rytmu na dwa tygodnie?",
    answer:
      "Roadmapa przelicza się sama i nie zostawia Ci długu do nadrobienia w jeden weekend. Zaległe tematy wracają rozłożone na kolejne tygodnie, a jeśli czasu jest już naprawdę mało, Examax pokazuje, które tematy dają najwięcej punktów, i zaczyna od nich.",
  },
  {
    question: "Czy roadmapa jest dla każdego przedmiotu?",
    answer:
      "Na razie dla matematyki, języka polskiego i angielskiego — do egzaminu ósmoklasisty i matury podstawowej, a z matematyki i angielskiego również do rozszerzenia. Fizyka, chemia i biologia są w przygotowaniu; w aplikacji widzisz dokładnie to, co jest gotowe.",
  },
  {
    question: "Czym to się różni od listy tematów w podręczniku?",
    answer:
      "Spis treści jest jeden dla wszystkich i nie wie, co już umiesz. Roadmapa układa te same tematy w kolejności zależności, przelicza je na tygodnie do Twojego egzaminu i zmienia się po każdej serii zadań, którą zrobisz.",
  },
  {
    question: "Mogę zacząć w środku roku?",
    answer:
      "Tak, i to najczęstszy przypadek. Zaczynasz od krótkiej diagnozy zamiast od pierwszego tematu z września: Examax sprawdza, co masz opanowane, i buduje plan od miejsca, w którym faktycznie jesteś.",
  },
];
