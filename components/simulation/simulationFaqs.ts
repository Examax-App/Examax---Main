import type { FaqItem } from "@/components/sections/FaqAccordion";

/**
 * The six questions /simulation answers inline.
 *
 * The first one is the one every visitor actually has, because the feature is
 * not shipped yet — and the honest answer is the reason the rest of the page
 * is worth reading. Nothing here promises a date we do not have.
 */
export const simulationFaqs: FaqItem[] = [
  {
    question: "Kiedy symulacje ruszają?",
    answer:
      "Pracujemy nad nimi teraz i nie podajemy jeszcze daty — wolimy wypuścić pierwszy arkusz późno niż taki, który liczy czas albo punkty inaczej niż CKE. Symulacje trafią najpierw do planów Pro i Max; start ogłosimy na tej stronie i mailem do wszystkich zapisanych.",
  },
  {
    question: "Czym symulacja różni się od trybu na czas w treningu?",
    answer:
      "Tryb na czas to seria zadań z limitem, którą sam układasz. Symulacja to cały arkusz z konkretnej sesji: te same zadania w tej samej kolejności, ten sam limit i ta sama maksymalna liczba punktów — plus raport gotowości, którego seria treningowa nie daje.",
  },
  {
    question: "Czy zadania otwarte też są oceniane?",
    answer:
      "Tak, według kryteriów z zasad oceniania tej samej sesji: osobno metoda, obliczenia i odpowiedź. Przy dłuższych wypowiedziach ocena jest orientacyjna i zawsze pokazujemy, na czym została oparta — to nie jest werdykt egzaminatora i tak go nie nazywamy.",
  },
  {
    question: "Co, jeśli przerwę arkusz w połowie?",
    answer:
      "Arkusz zapisuje się na bieżąco, więc nic nie przepada, ale zegar nie zatrzymuje się na życzenie — inaczej symulacja przestałaby symulować cokolwiek. Możesz zamknąć podejście i wrócić do niego później albo zacząć ten arkusz od nowa.",
  },
  {
    question: "Ile razy mogę podejść do tego samego arkusza?",
    answer:
      "Ile chcesz. Każde podejście zapisuje się osobno, więc widzisz, jak zmienia się wynik i tempo. Examax pilnuje przy tym, żeby nie polecać Ci w kółko arkusza, który znasz już na pamięć.",
  },
  {
    question: "Czy wynik z symulacji przewidzi mój wynik na egzaminie?",
    answer:
      "Nie obiecujemy tego i nikt uczciwie nie może. Symulacja pokazuje, ile punktów zdobyłeś na tym arkuszu, w tym czasie, tego dnia. To bardzo dobra informacja o przygotowaniu i bardzo słaba wróżba — dlatego raport mówi, co poprawić, a nie jaki dostaniesz wynik.",
  },
];
