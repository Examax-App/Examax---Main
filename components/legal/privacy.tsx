import type { LegalSection } from "@/components/legal/LegalDocument";

/*
 * The privacy policy at /legal/privacy, in the owner's own words (supplied
 * 2026-10-07). The administrator's details are still a placeholder, to be
 * filled in before the platform takes accounts. LegalDocument numbers the
 * sections, so titles carry no numbers. Every section's `id` is its anchor:
 * keep ids stable once the page is public.
 */

/** Where every privacy question goes, on this page only; the rest of the site keeps pomoc@ (lib/contact). */
const PRIVACY_EMAIL = "contact@examax.app";

/** The date the policy last changed — bump it with every edit below. */
export const PRIVACY_UPDATED = "2026-10-07";

const Mail = () => <a href={`mailto:${PRIVACY_EMAIL}`}>{PRIVACY_EMAIL}</a>;

export const PRIVACY_SECTIONS: LegalSection[] = [
  {
    id: "informacje-ogolne",
    title: "Informacje ogólne",
    body: (
      <>
        <p>Niniejsza Polityka Prywatności opisuje zasady przetwarzania danych osobowych użytkowników korzystających z platformy Examax.</p>
        <p>
          Examax jest internetową platformą edukacyjną wspierającą naukę oraz przygotowanie do egzaminów poprzez interaktywne materiały, ćwiczenia,
          funkcje analityczne oraz rozwiązania wykorzystujące sztuczną inteligencję.
        </p>
        <p>
          Celem platformy jest zapewnienie użytkownikom spersonalizowanego środowiska nauki, umożliwiającego śledzenie postępów, korzystanie z
          dostępnych funkcji edukacyjnych oraz rozwijanie własnych umiejętności.
        </p>
        <p>Platforma jest przeznaczona przede wszystkim dla osób uczących się zgodnie z polskim systemem edukacji.</p>
      </>
    ),
  },
  {
    id: "administrator-danych",
    title: "Administrator danych",
    body: (
      <>
        <p>Administratorem danych osobowych użytkowników jest:</p>
        <p>[Dane operatora zostaną uzupełnione]</p>
        <p>Kontakt w sprawach dotyczących prywatności oraz danych osobowych:</p>
        <p>
          <Mail />
        </p>
        <p>
          Administrator odpowiada za sposób przetwarzania danych osobowych zgodnie z obowiązującymi przepisami, w szczególności z Rozporządzeniem
          Parlamentu Europejskiego i Rady (UE) 2016/679 (RODO).
        </p>
      </>
    ),
  },
  {
    id: "jakie-dane-zbieramy",
    title: "Jakie dane możemy przetwarzać",
    body: (
      <>
        <p>Zakres przetwarzanych danych zależy od sposobu korzystania z platformy.</p>
        <p>Możemy przetwarzać między innymi:</p>
        <p>
          <strong>Dane konta:</strong>
        </p>
        <ul>
          <li>adres e-mail,</li>
          <li>imię i nazwisko (jeżeli zostanie podane),</li>
          <li>informacje wymagane do utworzenia i zabezpieczenia konta.</li>
        </ul>
        <p>
          <strong>Dane dotyczące korzystania z platformy:</strong>
        </p>
        <ul>
          <li>postępy w nauce,</li>
          <li>wykonane ćwiczenia,</li>
          <li>zapisane materiały,</li>
          <li>ustawienia użytkownika,</li>
          <li>historia korzystania z funkcji platformy.</li>
        </ul>
        <p>
          <strong>Dane techniczne:</strong>
        </p>
        <ul>
          <li>informacje dotyczące urządzenia,</li>
          <li>informacje niezbędne do zapewnienia bezpieczeństwa oraz prawidłowego działania platformy.</li>
        </ul>
        <p>Nie zbieramy danych, które nie są potrzebne do działania Examax.</p>
      </>
    ),
  },
  {
    id: "wykorzystanie-danych",
    title: "Dlaczego przetwarzamy dane",
    body: (
      <>
        <p>Dane użytkowników są wykorzystywane wyłącznie w celu zapewnienia działania platformy oraz poprawy doświadczenia użytkownika.</p>
        <p>Dane mogą być wykorzystywane w celu:</p>
        <ul>
          <li>utworzenia i obsługi konta,</li>
          <li>zapewnienia dostępu do funkcji platformy,</li>
          <li>zapisywania postępów nauki,</li>
          <li>obsługi płatności i subskrypcji,</li>
          <li>zapewnienia bezpieczeństwa konta,</li>
          <li>odpowiadania na wiadomości przesłane przez użytkownika,</li>
          <li>wysyłania niezbędnych komunikatów związanych z działaniem konta.</li>
        </ul>
        <p>Nie sprzedajemy danych osobowych użytkowników.</p>
        <p>Nie wykorzystujemy danych użytkowników w celu tworzenia profili reklamowych ani sprzedaży informacji innym podmiotom.</p>
      </>
    ),
  },
  {
    id: "logowanie",
    title: "Logowanie i uwierzytelnianie",
    body: (
      <>
        <p>Użytkownik może mieć możliwość korzystania z różnych metod logowania, w tym:</p>
        <ul>
          <li>adresu e-mail i hasła,</li>
          <li>zewnętrznych metod uwierzytelniania dostępnych na platformie.</li>
        </ul>
        <p>W przypadku korzystania z zewnętrznej metody logowania możemy otrzymać podstawowe informacje potrzebne do utworzenia konta, takie jak:</p>
        <ul>
          <li>adres e-mail,</li>
          <li>imię i nazwisko (jeżeli jest dostępne),</li>
          <li>podstawowe informacje wymagane do identyfikacji konta.</li>
        </ul>
        <p>Nie otrzymujemy dostępu do haseł użytkownika przechowywanych przez zewnętrznych dostawców.</p>
      </>
    ),
  },
  {
    id: "korepetytor-ai",
    title: "Funkcje wykorzystujące sztuczną inteligencję",
    body: (
      <>
        <p>Examax może oferować funkcje wykorzystujące sztuczną inteligencję w celu wspierania nauki użytkownika.</p>
        <p>W ramach korzystania z tych funkcji mogą być przetwarzane:</p>
        <ul>
          <li>wiadomości wysyłane przez użytkownika,</li>
          <li>pytania,</li>
          <li>treści potrzebne do wygenerowania odpowiedzi,</li>
          <li>historia rozmów, jeżeli użytkownik zdecyduje się ją zachować.</li>
        </ul>
        <p>Dane te są wykorzystywane w celu zapewnienia działania funkcji AI oraz dostarczenia użytkownikowi odpowiedzi.</p>
        <p>Nie wykorzystujemy prywatnych rozmów użytkowników do celów niezwiązanych ze świadczeniem usługi.</p>
        <p>Użytkownik powinien korzystać z funkcji AI zgodnie z przeznaczeniem platformy oraz obowiązującymi zasadami.</p>
      </>
    ),
  },
  {
    id: "platnosci",
    title: "Płatności i subskrypcje",
    body: (
      <>
        <p>Examax może oferować bezpłatne oraz płatne plany dostępu.</p>
        <p>Płatności są obsługiwane przez bezpiecznych operatorów płatności.</p>
        <p>W związku z płatnościami możemy przetwarzać informacje niezbędne do:</p>
        <ul>
          <li>realizacji zakupu,</li>
          <li>potwierdzenia transakcji,</li>
          <li>obsługi subskrypcji,</li>
          <li>zapewnienia dostępu do zakupionych funkcji.</li>
        </ul>
        <p>Zakup planu płatnego nie wpływa na sposób przetwarzania danych użytkownika.</p>
        <p>Wszyscy użytkownicy są traktowani zgodnie z tymi samymi zasadami ochrony prywatności.</p>
      </>
    ),
  },
  {
    id: "komunikacja-e-mail",
    title: "Komunikacja e-mail",
    body: (
      <>
        <p>Możemy wysyłać wiadomości związane z:</p>
        <ul>
          <li>bezpieczeństwem konta,</li>
          <li>logowaniem,</li>
          <li>odzyskiwaniem dostępu,</li>
          <li>płatnościami,</li>
          <li>ważnymi zmianami dotyczącymi usługi.</li>
        </ul>
        <p>Dodatkowe wiadomości, takie jak informacje o nowych funkcjach lub aktualizacjach produktu, mogą wymagać odpowiednich ustawień użytkownika.</p>
        <p>Użytkownik może zarządzać preferencjami komunikacji, jeżeli takie ustawienia są dostępne.</p>
      </>
    ),
  },
  {
    id: "cookies",
    title: "Cookies i technologie podobne",
    body: (
      <>
        <p>Examax wykorzystuje technologie niezbędne do prawidłowego działania platformy.</p>
        <p>Możemy wykorzystywać między innymi:</p>
        <ul>
          <li>pliki cookies wymagane do działania konta,</li>
          <li>technologie poprawiające bezpieczeństwo,</li>
          <li>narzędzia pomagające analizować działanie platformy.</li>
        </ul>
        <p>Nie wykorzystujemy plików cookies do sprzedaży danych użytkowników ani tworzenia reklamowych profili użytkowników.</p>
      </>
    ),
  },
  {
    id: "udostepnianie-danych",
    title: "Udostępnianie danych",
    body: (
      <>
        <p>Dane użytkowników mogą być przetwarzane przez zaufanych dostawców usług technicznych wyłącznie w zakresie niezbędnym do działania platformy.</p>
        <p>Podmioty te mogą pomagać między innymi w:</p>
        <ul>
          <li>utrzymaniu infrastruktury,</li>
          <li>obsłudze komunikacji,</li>
          <li>realizacji płatności,</li>
          <li>zapewnieniu bezpieczeństwa.</li>
        </ul>
        <p>Nie udostępniamy danych osobowych innym podmiotom w celach sprzedażowych.</p>
      </>
    ),
  },
  {
    id: "bezpieczenstwo-danych",
    title: "Bezpieczeństwo danych",
    body: (
      <>
        <p>Stosujemy odpowiednie środki organizacyjne oraz techniczne mające na celu ochronę danych użytkowników przed:</p>
        <ul>
          <li>nieautoryzowanym dostępem,</li>
          <li>utratą,</li>
          <li>nieuprawnioną zmianą,</li>
          <li>niewłaściwym wykorzystaniem.</li>
        </ul>
        <p>Żadna metoda przesyłania lub przechowywania danych w internecie nie gwarantuje jednak całkowitego bezpieczeństwa.</p>
      </>
    ),
  },
  {
    id: "usuniecie-konta",
    title: "Usunięcie konta",
    body: (
      <>
        <p>Użytkownik może w każdej chwili wystąpić o usunięcie swojego konta.</p>
        <p>Po zakończeniu procesu usunięcia:</p>
        <ul>
          <li>konto zostaje usunięte,</li>
          <li>dane związane z użytkownikiem zostają usunięte,</li>
          <li>postępy oraz zapisane informacje zostają usunięte.</li>
        </ul>
        <p>Niektóre informacje mogą zostać zachowane, jeżeli ich przechowywanie jest wymagane przez obowiązujące przepisy prawa.</p>
        <p>
          W przypadku aktywnej subskrypcji użytkownik powinien najpierw anulować odnawianie płatności oraz poczekać do zakończenia okresu
          rozliczeniowego.
        </p>
      </>
    ),
  },
  {
    id: "twoje-prawa",
    title: "Prawa użytkownika",
    body: (
      <>
        <p>Użytkownik ma prawo do:</p>
        <ul>
          <li>dostępu do swoich danych,</li>
          <li>poprawienia danych,</li>
          <li>usunięcia danych,</li>
          <li>ograniczenia przetwarzania,</li>
          <li>otrzymania kopii swoich danych,</li>
          <li>wniesienia sprzeciwu wobec określonych form przetwarzania.</li>
        </ul>
        <p>W celu realizacji swoich praw użytkownik może skontaktować się:</p>
        <p>
          <Mail />
        </p>
      </>
    ),
  },
  {
    id: "zmiany-polityki",
    title: "Zmiany Polityki Prywatności",
    body: (
      <>
        <p>
          Examax może aktualizować niniejszą Politykę Prywatności w związku z rozwojem platformy, zmianami funkcji lub zmianami przepisów prawa.
        </p>
        <p>Aktualna wersja dokumentu będzie zawsze dostępna na stronie platformy.</p>
        <p>Data ostatniej aktualizacji znajduje się na końcu dokumentu.</p>
      </>
    ),
  },
  {
    id: "kontakt",
    title: "Kontakt",
    body: (
      <>
        <p>W przypadku pytań dotyczących prywatności, danych osobowych lub działania platformy:</p>
        <p>
          <Mail />
        </p>
      </>
    ),
  },
];
