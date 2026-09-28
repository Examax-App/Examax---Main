import type { FaqItem } from "@/components/sections/FaqAccordion";

/**
 * The six questions /training answers inline.
 *
 * Data rather than a component: the accordion itself is shared
 * (components/sections/FaqAccordion), and every product page brings its own
 * six. Answers stay honest about what is not built yet — a FAQ that only
 * promises is the fastest way to lose the trust the rest of the page earned.
 */
export const trainingFaqs: FaqItem[] = [
  {
    question: "Skąd pochodzą zadania?",
    answer:
      "Z oficjalnych arkuszy CKE z poprzednich sesji, z informatorów i z wymagań egzaminacyjnych. Zadania pisane przez nas trafiają do bazy dopiero po sprawdzeniu, czy da się je ocenić według tych samych zasad co arkuszowe.",
  },
  {
    question: "Ile zadań zrobię za darmo?",
    answer:
      "Dwadzieścia dziennie w planie Free, bez karty i bez limitu czasowego. Plany płatne zdejmują limit i odblokowują tryb na czas oraz pełną historię powtórek.",
  },
  {
    question: "Czy zadania otwarte też są sprawdzane?",
    answer:
      "Tak, według kryteriów z zasad oceniania: osobno metoda, obliczenia i odpowiedź. Dostajesz rozbicie punktów, a nie samo „dobrze / źle”. Przy wypracowaniach ocena jest orientacyjna i zawsze pokazujemy, na czym została oparta.",
  },
  {
    question: "Trenuję pod maturę rozszerzoną — jest dla mnie materiał?",
    answer:
      "Z matematyki i angielskiego tak, na obu poziomach. Polski rozszerzony i przedmioty przyrodnicze są w przygotowaniu; do tego czasu widzisz w bazie dokładnie to, co jest gotowe, bez obiecywania reszty.",
  },
  {
    question: "Jak działa tryb na czas?",
    answer:
      "Wybierasz serię i limit czasu, a Examax odlicza go jak na sali — z nawigatorem zadań i flagowaniem tych, do których chcesz wrócić. Po ostatnim kliknięciu dostajesz punktację i listę tematów do powtórki.",
  },
  {
    question: "Czy trening działa na telefonie?",
    answer:
      "Tak. Zadania zamknięte i quizy rozwiążesz wygodnie na telefonie, a dłuższe zadania otwarte — te z miejscem na rozpisanie — są wygodniejsze na większym ekranie. Postęp synchronizuje się między urządzeniami.",
  },
];
