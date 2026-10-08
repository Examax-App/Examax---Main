import type { LegalSection } from "@/components/legal/LegalDocument";

/*
 * The terms of service (Regulamin) at /legal/terms, in the owner's own words
 * (supplied 2026-10-08), on the same LegalDocument as the privacy policy.
 * LegalDocument numbers the sections, so titles carry no numbers. Every
 * section's `id` is its anchor: keep ids stable once the page is public.
 */

/** Where every question about the terms goes. */
const TERMS_EMAIL = "pomoc@examax.app";

/** The date the terms last changed — bump it with every edit below. */
export const TERMS_UPDATED = "2026-10-08";

const Mail = () => <a href={`mailto:${TERMS_EMAIL}`}>{TERMS_EMAIL}</a>;

export const TERMS_SECTIONS: LegalSection[] = [
  {
    id: "postanowienia-ogolne",
    title: "Postanowienia ogólne",
    body: (
      <>
        <p>Niniejszy Regulamin określa zasady korzystania z platformy Examax.</p>
        <p>Examax jest internetową platformą edukacyjną wspierającą naukę poprzez interaktywne materiały, ćwiczenia, narzędzia edukacyjne oraz funkcje wykorzystujące sztuczną inteligencję.</p>
        <p>Celem platformy jest umożliwienie użytkownikom skuteczniejszej nauki, organizacji postępów oraz przygotowania do egzaminów.</p>
        <p>Korzystając z Examax, użytkownik akceptuje postanowienia niniejszego Regulaminu.</p>
      </>
    ),
  },
  {
    id: "definicje",
    title: "Definicje",
    body: (
      <>
        <p>Na potrzeby niniejszego Regulaminu:</p>
        <p>
          <strong>Examax</strong> – platforma edukacyjna dostępna online.
        </p>
        <p>
          <strong>Użytkownik</strong> – osoba korzystająca z platformy Examax.
        </p>
        <p>
          <strong>Konto</strong> – indywidualny profil użytkownika umożliwiający dostęp do określonych funkcji platformy.
        </p>
        <p>
          <strong>Usługi</strong> – funkcje dostępne w ramach Examax, w tym materiały edukacyjne, narzędzia nauki oraz funkcje dodatkowe.
        </p>
        <p>
          <strong>Plan płatny</strong> – dostęp rozszerzony do wybranych funkcji platformy dostępny za opłatą.
        </p>
      </>
    ),
  },
  {
    id: "korzystanie-z-platformy",
    title: "Korzystanie z platformy",
    body: (
      <>
        <p>Użytkownik zobowiązuje się korzystać z Examax zgodnie z:</p>
        <ul>
          <li>obowiązującym prawem,</li>
          <li>zasadami uczciwego korzystania,</li>
          <li>niniejszym Regulaminem.</li>
        </ul>
        <p>Użytkownik zobowiązuje się nie wykorzystywać platformy w sposób, który może:</p>
        <ul>
          <li>zakłócać jej działanie,</li>
          <li>naruszać bezpieczeństwo,</li>
          <li>wpływać negatywnie na innych użytkowników,</li>
          <li>służyć do działań niezgodnych z prawem.</li>
        </ul>
      </>
    ),
  },
  {
    id: "konto-uzytkownika",
    title: "Konto użytkownika",
    body: (
      <>
        <p>Do korzystania z części funkcji Examax może być wymagane utworzenie konta.</p>
        <p>Użytkownik zobowiązuje się podawać prawdziwe i aktualne informacje podczas rejestracji.</p>
        <p>Użytkownik odpowiada za:</p>
        <ul>
          <li>bezpieczeństwo swoich danych logowania,</li>
          <li>działania wykonywane za pomocą swojego konta,</li>
          <li>nieudostępnianie dostępu do konta osobom trzecim.</li>
        </ul>
        <p>Jeżeli użytkownik zauważy podejrzaną aktywność dotyczącą swojego konta, powinien skontaktować się z Examax.</p>
      </>
    ),
  },
  {
    id: "plany-i-funkcje",
    title: "Dostępne plany i funkcje",
    body: (
      <>
        <p>Examax może oferować różne poziomy dostępu, w tym:</p>
        <ul>
          <li>bezpłatny plan,</li>
          <li>płatne plany rozszerzone,</li>
          <li>indywidualne rozwiązania dla organizacji i instytucji.</li>
        </ul>
        <p>Plan bezpłatny umożliwia korzystanie z podstawowych funkcji platformy.</p>
        <p>Plany płatne mogą zapewniać między innymi:</p>
        <ul>
          <li>większe limity korzystania z określonych funkcji,</li>
          <li>dodatkowe możliwości,</li>
          <li>rozszerzony dostęp do narzędzi edukacyjnych.</li>
        </ul>
        <p>Zakres funkcji, limity oraz ceny poszczególnych planów są przedstawiane użytkownikowi przed dokonaniem zakupu.</p>
        <p>Zakup planu nie oznacza gwarancji nieograniczonego dostępu do wszystkich funkcji platformy.</p>
      </>
    ),
  },
  {
    id: "subskrypcje-i-platnosci",
    title: "Subskrypcje i płatności",
    body: (
      <>
        <p>Wybrane funkcje Examax mogą być dostępne w ramach płatnych subskrypcji.</p>
        <p>Subskrypcja może być rozliczana:</p>
        <ul>
          <li>miesięcznie,</li>
          <li>rocznie,</li>
          <li>lub według innych dostępnych wariantów przedstawionych podczas zakupu.</li>
        </ul>
        <p>W przypadku subskrypcji automatycznie odnawialnej płatność jest pobierana zgodnie z wybranym okresem rozliczeniowym.</p>
        <p>Użytkownik może anulować subskrypcję, aby zapobiec kolejnemu odnowieniu.</p>
        <p>Anulowanie subskrypcji nie powoduje automatycznego zwrotu wcześniej dokonanej płatności. Użytkownik zachowuje dostęp do zakupionych funkcji do końca opłaconego okresu.</p>
      </>
    ),
  },
  {
    id: "zwroty-platnosci",
    title: "Zwroty płatności",
    body: (
      <>
        <p>Examax dokłada starań, aby zakupione usługi działały zgodnie z opisem.</p>
        <p>Zwrot płatności może być rozpatrzony w szczególności w przypadku:</p>
        <ul>
          <li>braku otrzymania zakupionej usługi,</li>
          <li>błędu technicznego uniemożliwiającego korzystanie z zakupionej funkcji,</li>
          <li>nieprawidłowego rozliczenia,</li>
          <li>sytuacji, w której Examax nie zapewnił dostępu do opłaconych funkcji.</li>
        </ul>
        <p>Sam fakt zmiany decyzji przez użytkownika po prawidłowym rozpoczęciu korzystania z usługi nie oznacza automatycznego prawa do zwrotu płatności.</p>
        <p>W przypadku problemów użytkownik powinien skontaktować się:</p>
        <p>
          <Mail />
        </p>
      </>
    ),
  },
  {
    id: "funkcje-ai",
    title: "Funkcje wykorzystujące sztuczną inteligencję",
    body: (
      <>
        <p>Examax może udostępniać funkcje wykorzystujące sztuczną inteligencję.</p>
        <p>Użytkownik rozumie, że:</p>
        <ul>
          <li>odpowiedzi generowane przez AI mogą zawierać błędy,</li>
          <li>AI nie zastępuje nauczyciela, eksperta ani oficjalnych źródeł edukacyjnych,</li>
          <li>użytkownik powinien samodzielnie zweryfikować informacje szczególnie istotne.</li>
        </ul>
        <p>Funkcje AI są przeznaczone przede wszystkim do wspierania nauki, wyjaśniania zagadnień oraz pomocy edukacyjnej.</p>
        <p>Zabronione jest wykorzystywanie funkcji AI do działań niezgodnych z prawem lub przeznaczeniem platformy.</p>
      </>
    ),
  },
  {
    id: "prawa-autorskie",
    title: "Materiały edukacyjne i prawa autorskie",
    body: (
      <>
        <p>Materiały dostępne w Examax mogą pochodzić z różnych źródeł edukacyjnych.</p>
        <p>W szczególności materiały egzaminacyjne związane z Centralną Komisją Egzaminacyjną (CKE) pozostają własnością odpowiednich podmiotów.</p>
        <p>Examax:</p>
        <ul>
          <li>nie jest oficjalnie powiązany z CKE,</li>
          <li>nie deklaruje własności nad oficjalnymi materiałami egzaminacyjnymi CKE,</li>
          <li>wykorzystuje dostępne materiały edukacyjne w celu stworzenia dodatkowego środowiska nauki, wyjaśnień i ćwiczeń.</li>
        </ul>
        <p>Informacje dotyczące źródeł oraz praw do materiałów pozostają zgodne z obowiązującymi zasadami ich wykorzystania.</p>
        <p>Materiały, funkcje oraz elementy stworzone przez Examax nie mogą być kopiowane, odsprzedawane ani rozpowszechniane bez odpowiedniej zgody.</p>
      </>
    ),
  },
  {
    id: "tresci-uzytkownika",
    title: "Treści tworzone przez użytkownika",
    body: (
      <>
        <p>Użytkownik zachowuje prawa do treści, które samodzielnie tworzy podczas korzystania z platformy.</p>
        <p>Użytkownik udziela Examax prawa do przetwarzania tych treści wyłącznie w zakresie niezbędnym do:</p>
        <ul>
          <li>działania platformy,</li>
          <li>zapewnienia dostępu do funkcji,</li>
          <li>zapisania postępów użytkownika.</li>
        </ul>
        <p>Użytkownik nie powinien przesyłać ani tworzyć treści naruszających prawa innych osób lub obowiązujące przepisy.</p>
      </>
    ),
  },
  {
    id: "bezpieczenstwo-i-naduzycia",
    title: "Bezpieczeństwo i nadużycia",
    body: (
      <>
        <p>Examax może podejmować działania mające na celu ochronę platformy oraz użytkowników.</p>
        <p>W przypadku naruszenia Regulaminu, w szczególności:</p>
        <ul>
          <li>prób ataku na platformę,</li>
          <li>wykorzystywania jej w sposób szkodliwy,</li>
          <li>automatycznego przeciążania usług,</li>
          <li>działań oszustwa,</li>
          <li>nękania lub spamowania,</li>
        </ul>
        <p>Examax może ograniczyć dostęp do funkcji, czasowo zablokować konto lub zakończyć możliwość korzystania z platformy.</p>
        <p>Jeżeli użytkownik zauważy błąd, problem bezpieczeństwa lub naruszenie zasad, powinien zgłosić to:</p>
        <p>
          <Mail />
        </p>
      </>
    ),
  },
  {
    id: "dostepnosc-platformy",
    title: "Dostępność platformy",
    body: (
      <>
        <p>Examax dąży do zapewnienia stabilnego działania platformy.</p>
        <p>Jednocześnie użytkownik przyjmuje do wiadomości, że mogą wystąpić czasowe przerwy związane między innymi z:</p>
        <ul>
          <li>konserwacją,</li>
          <li>aktualizacjami,</li>
          <li>zmianami technicznymi,</li>
          <li>nieprzewidzianymi problemami.</li>
        </ul>
        <p>Examax nie gwarantuje nieprzerwanej dostępności platformy w każdym momencie.</p>
      </>
    ),
  },
  {
    id: "odpowiedzialnosc-uzytkownika",
    title: "Odpowiedzialność użytkownika",
    body: (
      <>
        <p>Użytkownik odpowiada za sposób korzystania z platformy oraz zgodność swoich działań z prawem.</p>
        <p>Użytkownik nie powinien:</p>
        <ul>
          <li>udostępniać swojego konta innym osobom,</li>
          <li>próbować uzyskać nieautoryzowanego dostępu,</li>
          <li>wykorzystywać platformy do celów niezwiązanych z jej przeznaczeniem.</li>
        </ul>
      </>
    ),
  },
  {
    id: "zmiany-regulaminu",
    title: "Zmiany Regulaminu",
    body: (
      <>
        <p>Examax może aktualizować niniejszy Regulamin w związku z:</p>
        <ul>
          <li>rozwojem platformy,</li>
          <li>dodawaniem nowych funkcji,</li>
          <li>zmianami prawnymi,</li>
          <li>zmianami sposobu świadczenia usług.</li>
        </ul>
        <p>Aktualna wersja Regulaminu będzie zawsze dostępna na stronie Examax.</p>
        <p>W przypadku istotnych zmian użytkownicy mogą zostać poinformowani za pomocą dostępnych kanałów komunikacji.</p>
      </>
    ),
  },
  {
    id: "kontakt",
    title: "Kontakt",
    body: (
      <>
        <p>W przypadku pytań, problemów lub zgłoszeń dotyczących działania platformy:</p>
        <p>
          <Mail />
        </p>
        <p>Examax zachęca użytkowników do kontaktu w przypadku zauważenia błędów, problemów technicznych lub sytuacji wymagających wyjaśnienia.</p>
      </>
    ),
  },
];
