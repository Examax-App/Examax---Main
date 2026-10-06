import Link from "next/link";
import { LegalTable, type LegalSection } from "@/components/legal/LegalDocument";

/*
 * PLACEHOLDER COPY — the privacy policy at /legal/privacy. Written as a
 * plausible starting point, not as legal advice: the administrator's full
 * name and address, the processors and the retention periods must be
 * checked by a lawyer before launch. Every section's `id` is its anchor,
 * so keep ids stable once the page is public.
 */

/** Where every privacy question goes, on this page only; the rest of the site keeps pomoc@ (lib/contact). */
const PRIVACY_EMAIL = "kontakt@examax.app";

/** The date the policy last changed — bump it with every edit below. */
export const PRIVACY_UPDATED = "2026-10-06";

const Mail = () => <a href={`mailto:${PRIVACY_EMAIL}`}>{PRIVACY_EMAIL}</a>;

export const PRIVACY_INTRO = (
  <>
    <p>
      Witaj w <Link href="/">Examax</Link> (dalej „Serwis”). Serwis prowadzi Examax (dalej „Examax”, „my”, „nas”). Examax to platforma do nauki na
      egzamin ósmoklasisty i maturę (dalej „Usługi”). Szanujemy Twoją prywatność i dbamy o ochronę Twoich danych osobowych. Ta Polityka prywatności
      opisuje, jakie dane zbieramy, jak z nich korzystamy i komu możemy je przekazać.
    </p>
    <p>
      Korzystamy z Twoich danych, aby świadczyć i ulepszać Usługi. Korzystając z Serwisu, akceptujesz zbieranie i wykorzystywanie informacji zgodnie
      z tą polityką. Pojęcia, których nie definiujemy w tej Polityce prywatności, mają takie samo znaczenie jak w naszym Regulaminie.
    </p>
    <p>Regulamin określa zasady korzystania z Usług i razem z tą Polityką prywatności stanowi umowę między Tobą a nami.</p>
  </>
);

export const PRIVACY_SECTIONS: LegalSection[] = [
  {
    id: "definicje",
    title: "Definicje",
    body: (
      <>
        <p>Poniżej znajdziesz definicje pojęć używanych w tej Polityce prywatności:</p>
        <LegalTable
          head={["Pojęcie", "Definicja"]}
          rows={[
            [
              <strong key="t">Serwis</strong>,
              <>
                Strona <code>examax.app</code> i aplikacja internetowa Examax, prowadzone przez Examax.
              </>,
            ],
            [
              <strong key="t">Dane osobowe</strong>,
              "Informacje o osobie, którą można zidentyfikować bezpośrednio lub pośrednio — na przykład imię, adres e-mail albo identyfikator konta.",
            ],
            [
              <strong key="t">Dane o korzystaniu</strong>,
              "Dane zbierane automatycznie podczas korzystania z Serwisu albo przez jego infrastrukturę — na przykład czas trwania wizyty na stronie.",
            ],
            [<strong key="t">Dane o nauce</strong>, "Twoje odpowiedzi, wyniki zadań i symulacji, postęp w roadmapie i historia nauki."],
            [<strong key="t">Pliki cookies</strong>, "Niewielkie pliki zapisywane na Twoim urządzeniu (komputerze, telefonie lub tablecie)."],
            [
              <strong key="t">Administrator danych</strong>,
              "Podmiot, który samodzielnie lub wspólnie z innymi ustala cele i sposoby przetwarzania danych osobowych.",
            ],
            [
              <strong key="t">Podmiot przetwarzający</strong>,
              "Podmiot, który przetwarza dane osobowe w imieniu administratora — na przykład dostawca hostingu albo poczty e-mail.",
            ],
            [<strong key="t">Użytkownik</strong>, "Osoba korzystająca z Serwisu, której dotyczą dane osobowe."],
          ]}
        />
      </>
    ),
  },
  {
    id: "jakie-dane-zbieramy",
    title: "Jakie dane zbieramy",
    body: (
      <>
        <p>Zbieramy kilka rodzajów informacji, aby świadczyć i ulepszać nasze Usługi.</p>
        <p>
          <strong>Dane konta</strong>
        </p>
        <p>
          Gdy zakładasz konto albo piszesz do nas, możemy poprosić Cię o dane, które pozwalają się z Tobą skontaktować lub Cię zidentyfikować. Mogą to
          być w szczególności:
        </p>
        <ul>
          <li>Imię</li>
          <li>Adres e-mail</li>
          <li>Egzamin, do którego się przygotowujesz, i jego termin</li>
          <li>Zdjęcie profilowe (jeśli je dodasz)</li>
        </ul>
        <p>
          Możemy wysyłać Ci wiadomości dotyczące Twojego konta, a jeśli się na to zgodzisz — także informacje o nowościach w Examaxie. Z wiadomości
          marketingowych możesz zrezygnować w każdej chwili, klikając link w stopce wiadomości albo pisząc na <Mail />.
        </p>
        <p>
          <strong>Dane o nauce</strong>
        </p>
        <p>
          Kiedy korzystasz z Examaxu, zapisujemy Twoje odpowiedzi, wyniki zadań i symulacji, postęp w roadmapie oraz rozmowy z Korepetytorem AI. Bez
          tych danych nie moglibyśmy pokazywać Ci postępów ani dobierać zadań do tematów, w których tracisz punkty.
        </p>
        <p>
          <strong>Dane o korzystaniu</strong>
        </p>
        <p>Możemy też zbierać informacje, które Twoja przeglądarka wysyła przy każdej wizycie w Serwisie („Dane o korzystaniu”).</p>
        <p>
          Mogą to być: adres IP Twojego urządzenia, typ i wersja przeglądarki, odwiedzone strony Serwisu, data i godzina wizyty, czas spędzony na
          stronach, identyfikatory urządzenia i inne dane diagnostyczne.
        </p>
        <p>
          Statystyki odwiedzin zbieramy bez plików cookies i w formie zbiorczej. Nie służą one do śledzenia Cię między stronami ani do wyświetlania
          reklam.
        </p>
        <p>
          <strong>Pliki cookies</strong>
        </p>
        <p>Używamy wyłącznie własnych plików cookies, potrzebnych do działania Serwisu.</p>
        <p>
          Pliki cookies to niewielkie pliki z danymi, które mogą zawierać anonimowy, unikalny identyfikator. Serwis wysyła je do Twojej przeglądarki, a ta
          zapisuje je na Twoim urządzeniu.
        </p>
        <p>Przykłady plików cookies, których używamy:</p>
        <LegalTable
          head={["Rodzaj", "Opis"]}
          rows={[
            [<strong key="t">Sesyjne</strong>, "Utrzymują Twoje logowanie, dopóki korzystasz z Serwisu."],
            [<strong key="t">Preferencji</strong>, "Zapamiętują Twoje ustawienia, na przykład wybrany egzamin."],
            [<strong key="t">Bezpieczeństwa</strong>, "Chronią Twoje konto i formularze Serwisu przed nadużyciami."],
          ]}
        />
        <p>
          <strong>Nie używamy plików cookies stron trzecich</strong> ani plików cookies reklamowych.
        </p>
      </>
    ),
  },
  {
    id: "wykorzystanie-danych",
    title: "Jak wykorzystujemy dane",
    body: (
      <>
        <p>Examax wykorzystuje zebrane dane, aby:</p>
        <ul>
          <li>świadczyć Usługi i utrzymywać je w działaniu;</li>
          <li>prowadzić Twoją roadmapę, zapisywać wyniki i pokazywać postępy;</li>
          <li>dobierać zadania i powtórki do tematów, które sprawiają Ci trudność;</li>
          <li>odpowiadać na pytania, które zadajesz Korepetytorowi AI;</li>
          <li>informować Cię o zmianach w Usługach;</li>
          <li>udzielać pomocy technicznej i odpowiadać na Twoje wiadomości;</li>
          <li>analizować, jak korzystasz z Serwisu, i na tej podstawie go ulepszać;</li>
          <li>wykrywać problemy techniczne, nadużycia i naruszenia bezpieczeństwa oraz im zapobiegać;</li>
          <li>obsługiwać płatności i wysyłać powiadomienia o subskrypcji, w tym o jej odnowieniu;</li>
          <li>wykonywać obowiązki wynikające z umowy z Tobą i z przepisów prawa;</li>
          <li>w każdym innym celu, na który wyrazisz zgodę.</li>
        </ul>
      </>
    ),
  },
  {
    id: "podstawy-prawne",
    title: "Podstawy prawne przetwarzania",
    body: (
      <>
        <p>Przetwarzamy Twoje dane osobowe tylko wtedy, gdy pozwala na to RODO. W zależności od celu podstawą jest:</p>
        <ul>
          <li>
            <strong>Umowa</strong> — gdy dane są potrzebne, by prowadzić Twoje konto i świadczyć Usługi (art. 6 ust. 1 lit. b RODO).
          </li>
          <li>
            <strong>Zgoda</strong> — na przykład na wiadomości marketingowe. Możesz ją wycofać w każdej chwili (art. 6 ust. 1 lit. a RODO).
          </li>
          <li>
            <strong>Prawnie uzasadniony interes</strong> — gdy dbamy o bezpieczeństwo Serwisu, ulepszamy go i odpowiadamy na wiadomości (art. 6 ust. 1
            lit. f RODO).
          </li>
          <li>
            <strong>Obowiązek prawny</strong> — gdy przepisy, na przykład podatkowe, wymagają od nas przechowywania danych (art. 6 ust. 1 lit. c RODO).
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "przechowywanie-danych",
    title: "Przechowywanie danych",
    body: (
      <>
        <p>
          Dane konta i dane o nauce przechowujemy tak długo, jak masz konto w Examaxie. Po usunięciu konta usuwamy je albo anonimizujemy, chyba że
          przepisy wymagają od nas dłuższego przechowywania — na przykład dokumentów księgowych — albo dane są potrzebne do rozstrzygnięcia sporu.
        </p>
        <p>
          Dane o korzystaniu przechowujemy krócej, chyba że są potrzebne do zapewnienia bezpieczeństwa Serwisu, poprawy jego działania albo przepisy
          wymagają od nas dłuższego okresu przechowywania.
        </p>
      </>
    ),
  },
  {
    id: "przekazywanie-danych",
    title: "Przekazywanie danych poza EOG",
    body: (
      <>
        <p>
          Niektórzy nasi dostawcy mogą przetwarzać Twoje dane poza Europejskim Obszarem Gospodarczym (EOG), na przykład w Stanach Zjednoczonych, gdzie
          przepisy o ochronie danych mogą różnić się od obowiązujących w Polsce.
        </p>
        <p>
          W takich przypadkach przekazujemy dane wyłącznie na podstawie mechanizmów przewidzianych w RODO: decyzji Komisji Europejskiej stwierdzającej
          odpowiedni stopień ochrony albo standardowych klauzul umownych zatwierdzonych przez Komisję.
        </p>
        <p>
          Dokładamy wszelkich starań, aby Twoje dane były bezpieczne i przetwarzane zgodnie z tą Polityką prywatności, także wtedy, gdy opuszczają EOG.
        </p>
      </>
    ),
  },
  {
    id: "udostepnianie-danych",
    title: "Udostępnianie danych",
    body: (
      <>
        <p>Nie sprzedajemy Twoich danych osobowych. Możemy je udostępnić tylko w sytuacjach opisanych poniżej.</p>
        <p>
          <strong>Na żądanie organów państwowych</strong>
        </p>
        <p>
          W określonych sytuacjach możemy być zobowiązani do ujawnienia Twoich danych osobowych, jeśli wymagają tego przepisy prawa albo uprawnione
          organy publiczne.
        </p>
        <p>
          <strong>Zmiany w firmie</strong>
        </p>
        <p>W razie połączenia, przejęcia lub sprzedaży całości albo części Examaxu Twoje dane mogą zostać przekazane nowemu właścicielowi.</p>
        <p>
          <strong>Inne przypadki</strong>
        </p>
        <p>Możemy też udostępnić Twoje dane:</p>
        <ul>
          <li>podmiotom przetwarzającym, które pomagają nam prowadzić Serwis;</li>
          <li>Twojej szkole lub nauczycielowi, jeśli korzystasz z Examaxu w ramach licencji dla szkół;</li>
          <li>innym osobom lub firmom — wyłącznie za Twoją zgodą;</li>
          <li>gdy jest to konieczne do ochrony praw, bezpieczeństwa lub mienia Examaxu, naszych użytkowników albo innych osób.</li>
        </ul>
      </>
    ),
  },
  {
    id: "bezpieczenstwo-danych",
    title: "Bezpieczeństwo danych",
    body: (
      <p>
        Bezpieczeństwo Twoich danych jest dla nas ważne. Szyfrujemy je w trakcie przesyłania i przechowywania, a dostęp do nich mają tylko osoby, które
        go potrzebują. Pamiętaj jednak, że żadna metoda przesyłania danych przez internet ani ich elektronicznego przechowywania nie jest w pełni
        niezawodna, dlatego nie możemy zagwarantować ich absolutnego bezpieczeństwa.
      </p>
    ),
  },
  {
    id: "twoje-prawa",
    title: "Twoje prawa wynikające z RODO",
    body: (
      <>
        <p>
          Jeśli mieszkasz w Unii Europejskiej (UE) lub Europejskim Obszarze Gospodarczym (EOG), przysługują Ci szczególne prawa na podstawie{" "}
          <a href="https://eur-lex.europa.eu/legal-content/PL/TXT/?uri=CELEX:32016R0679" target="_blank" rel="noopener noreferrer">
            ogólnego rozporządzenia o ochronie danych (RODO)
          </a>
          . Traktujemy ochronę danych poważnie i dbamy o to, by Twoje dane były bezpieczne.
        </p>
        <p>
          <strong>Twoje prawa</strong>
        </p>
        <p>
          Jeśli chcesz uzyskać dostęp do swoich danych, poprawić je, ograniczyć ich przetwarzanie albo je usunąć, napisz na <Mail />. Na podstawie RODO
          masz prawo do:
        </p>
        <ul>
          <li>
            <strong>Dostępu</strong> do danych, które o Tobie przechowujemy.
          </li>
          <li>
            <strong>Sprostowania</strong> danych nieprawidłowych lub niekompletnych.
          </li>
          <li>
            <strong>Usunięcia danych</strong> w przypadkach przewidzianych w RODO.
          </li>
          <li>
            <strong>Ograniczenia przetwarzania</strong> albo wniesienia sprzeciwu wobec niego.
          </li>
          <li>
            <strong>Przeniesienia danych</strong> w ustrukturyzowanym formacie, który nadaje się do odczytu maszynowego.
          </li>
          <li>
            <strong>Wycofania zgody</strong> w dowolnym momencie — bez wpływu na zgodność z prawem przetwarzania, które odbyło się przed jej wycofaniem.
          </li>
        </ul>
        <p>
          Zanim zrealizujemy niektóre żądania, możemy poprosić Cię o potwierdzenie tożsamości. Pamiętaj, że po usunięciu lub ograniczeniu niektórych
          danych część funkcji Serwisu może przestać działać.
        </p>
        <p>
          Masz też prawo wnieść skargę do Prezesa Urzędu Ochrony Danych Osobowych (
          <a href="https://uodo.gov.pl" target="_blank" rel="noopener noreferrer">
            UODO
          </a>
          ), jeśli uważasz, że przetwarzamy Twoje dane niezgodnie z prawem.
        </p>
        <p>
          <strong>Konta szkolne</strong>
        </p>
        <p>
          Jeśli korzystasz z Examaxu w ramach licencji szkoły, administratorem Twoich danych jest szkoła, a Examax przetwarza je w jej imieniu na
          podstawie umowy powierzenia przetwarzania danych. Oznacza to, że:
        </p>
        <p>
          <strong>Szkoła jako administrator odpowiada za:</strong>
        </p>
        <ul>
          <li>
            <strong>Informowanie uczniów</strong> o tym, jakie dane są przetwarzane i w jakim celu.
          </li>
          <li>
            <strong>Odpowiadanie na żądania</strong> uczniów i ich rodziców, na przykład o dostęp do danych lub ich usunięcie.
          </li>
        </ul>
        <p>
          <strong>Examax jako podmiot przetwarzający zobowiązuje się do:</strong>
        </p>
        <ul>
          <li>
            <strong>Przetwarzania danych wyłącznie w imieniu szkoły</strong>, zgodnie z jej poleceniami i zawartą umową.
          </li>
          <li>
            <strong>Ochrony danych uczniów</strong> za pomocą odpowiednich środków technicznych i organizacyjnych.
          </li>
          <li>
            <strong>Pomocy szkole w wypełnianiu obowiązków z RODO</strong>, w tym w realizacji żądań dostępu do danych lub ich usunięcia.
          </li>
        </ul>
        <p>Jeśli masz pytania o to, jak dbamy o prywatność i zgodność z przepisami, napisz do nas.</p>
      </>
    ),
  },
  {
    id: "korepetytor-ai",
    title: "Korepetytor AI i Twoje dane",
    body: (
      <>
        <p>
          Korepetytor AI odpowiada na Twoje pytania na podstawie Twojej roadmapy, Twoich odpowiedzi i wcześniejszych błędów. Aby to było możliwe:
        </p>
        <ul>
          <li>treść rozmowy i kontekst zadania przekazujemy dostawcy modelu AI, który przetwarza je w naszym imieniu;</li>
          <li>rozmowy zapisujemy na Twoim koncie, żeby można było do nich wrócić;</li>
          <li>
            o usunięcie historii rozmów możesz poprosić w każdej chwili, pisząc na <Mail />.
          </li>
        </ul>
        <p>
          Nie podawaj w rozmowach z Korepetytorem AI danych, których nie chcesz nam przekazywać — na przykład numeru telefonu, adresu albo informacji o
          zdrowiu.
        </p>
      </>
    ),
  },
  {
    id: "dostawcy-uslug",
    title: "Dostawcy usług (podmioty przetwarzające)",
    body: (
      <>
        <p>
          Korzystamy z usług zewnętrznych firm, które pomagają nam prowadzić Serwis, świadczyć Usługi w naszym imieniu albo analizować, jak korzystasz z
          Serwisu.
        </p>
        <p>
          Mają one dostęp do Twoich danych osobowych wyłącznie w zakresie potrzebnym do wykonania tych zadań i nie mogą ich ujawniać ani wykorzystywać w
          żadnym innym celu.
        </p>
        <LegalTable
          head={["Dostawca", "Zakres"]}
          rows={[
            [<strong key="t">Vercel</strong>, "Hosting Serwisu i zbiorcze statystyki odwiedzin."],
            [<strong key="t">Supabase</strong>, "Baza danych i logowanie do konta."],
            [<strong key="t">Stripe</strong>, "Obsługa płatności za plany Pro i Max."],
            [<strong key="t">Resend</strong>, "Wysyłka wiadomości e-mail, w tym odpowiedzi na formularze kontaktowe."],
            [<strong key="t">Dostawcy modeli AI</strong>, "Generowanie odpowiedzi Korepetytora AI."],
          ]}
        />
      </>
    ),
  },
  {
    id: "linki-zewnetrzne",
    title: "Linki do innych stron",
    body: (
      <>
        <p>
          Serwis może zawierać linki do stron, których nie prowadzimy — na przykład do arkuszy egzaminacyjnych na stronie CKE. Po kliknięciu takiego
          linku trafisz na stronę innego podmiotu. Zachęcamy, by zapoznać się z polityką prywatności każdej odwiedzanej strony.
        </p>
        <p>Nie mamy wpływu na treści, polityki prywatności ani praktyki stron i usług innych podmiotów i nie ponosimy za nie odpowiedzialności.</p>
      </>
    ),
  },
  {
    id: "prywatnosc-dzieci",
    title: "Prywatność dzieci",
    body: (
      <>
        <p>Z Examaxu korzystają uczniowie szkół podstawowych i średnich, w tym osoby niepełnoletnie.</p>
        <p>
          Jeśli masz mniej niż 16 lat, do założenia konta potrzebujesz zgody rodzica lub opiekuna prawnego. Nie zbieramy świadomie danych osób poniżej
          16 roku życia bez takiej zgody. Jeśli dowiemy się, że do tego doszło, niezwłocznie usuniemy te dane z naszych serwerów.
        </p>
        <p>Jeśli jesteś rodzicem lub opiekunem i uważasz, że Twoje dziecko przekazało nam dane bez Twojej zgody, napisz do nas.</p>
      </>
    ),
  },
  {
    id: "zmiany-polityki",
    title: "Zmiany w Polityce prywatności",
    body: (
      <>
        <p>Możemy co jakiś czas aktualizować tę Politykę prywatności. O zmianach poinformujemy, publikując nową wersję na tej stronie.</p>
        <p>
          Przed wejściem zmian w życie powiadomimy Cię też e-mailem lub wyraźnym komunikatem w Serwisie i zaktualizujemy datę ostatniej aktualizacji na
          dole tej strony.
        </p>
        <p>
          Zachęcamy, by co jakiś czas sprawdzać tę Politykę prywatności. Zmiany obowiązują od momentu opublikowania ich na tej stronie.
        </p>
      </>
    ),
  },
  {
    id: "kontakt",
    title: "Kontakt",
    body: (
      <p>
        Jeśli masz pytania dotyczące tej Polityki prywatności, napisz do nas na <Mail /> albo przez{" "}
        <Link href="/contact/support">formularz kontaktowy</Link>.
      </p>
    ),
  },
];
