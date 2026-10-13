/**
 * The landing FAQ's questions, kept out of the client `Faq` component so the
 * landing page can also read them on the server for its FAQPage structured
 * data. `Faq` renders them by default.
 */

export type FaqItem = { question: string; answer: React.ReactNode };

const strong = (label: string) => <strong className="font-semibold text-charcoal">{label}</strong>;

export const landingFaqs: FaqItem[] = [
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
