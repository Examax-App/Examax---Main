import Link from "@/components/ui/Link";
import type { LegalSection } from "@/components/legal/LegalDocument";

/*
 * The privacy policy at /legal/privacy, in the owner's own words (supplied
 * 2026-10-07, replaced in full 2026-10-08). LegalDocument numbers the
 * sections, so titles carry no numbers. Every section's `id` is its anchor:
 * keep ids stable once the page is public.
 */

/** Where every privacy question goes. */
const PRIVACY_EMAIL = "pomoc@examax.app";

/** The date the policy last changed — bump it with every edit below. */
export const PRIVACY_UPDATED = "2026-10-08";

const Mail = () => <a href={`mailto:${PRIVACY_EMAIL}`}>{PRIVACY_EMAIL}</a>;

export const PRIVACY_SECTIONS: LegalSection[] = [
  {
    id: "informacje-ogolne",
    title: "Informacje ogólne",
    body: (
      <>
        <p>Niniejsza Polityka Prywatności opisuje zasady przetwarzania danych osobowych użytkowników korzystających z platformy Examax.</p>
        <p>Examax jest internetową platformą edukacyjną wspierającą naukę oraz przygotowanie do egzaminów poprzez interaktywne materiały, ćwiczenia oraz funkcje wspierane przez sztuczną inteligencję.</p>
        <p>Celem Examax jest zapewnienie użytkownikom wygodnego, bezpiecznego i spersonalizowanego środowiska nauki.</p>
        <p>Korzystając z Examax, użytkownik potwierdza, że zapoznał się z niniejszą Polityką Prywatności.</p>
      </>
    ),
  },
  {
    id: "administrator-danych",
    title: "Administrator danych",
    body: (
      <>
        <p>Administratorem danych osobowych użytkowników jest:</p>
        <p>
          Examax
          <br />
          Polska
        </p>
        <p>Kontakt w sprawach dotyczących prywatności oraz danych osobowych:</p>
        <p>
          <Mail />
        </p>
        <p>Użytkownik może skontaktować się z nami w sprawach dotyczących korzystania z platformy, swoich danych oraz realizacji praw wynikających z obowiązujących przepisów.</p>
      </>
    ),
  },
  {
    id: "jakie-dane-zbieramy",
    title: "Jakie dane możemy przetwarzać",
    body: (
      <>
        <p>Zakres przetwarzanych danych zależy od sposobu korzystania z platformy oraz dostępnych funkcji.</p>
        <p>Możemy przetwarzać między innymi:</p>
        <p>
          <strong>Dane konta</strong>
        </p>
        <p>Podczas tworzenia konta możemy przetwarzać:</p>
        <ul>
          <li>adres e-mail,</li>
          <li>dane niezbędne do uwierzytelnienia konta,</li>
          <li>informacje dotyczące bezpieczeństwa konta.</li>
        </ul>
        <p>Jeżeli użytkownik korzysta z logowania za pomocą zewnętrznej metody uwierzytelniania, możemy otrzymać podstawowe informacje wymagane do utworzenia i zabezpieczenia konta.</p>
        <p>Nie pobieramy informacji, które nie są potrzebne do działania konta.</p>
      </>
    ),
  },
  {
    id: "wykorzystanie-danych",
    title: "Cel przetwarzania danych",
    body: (
      <>
        <p>Dane użytkowników są wykorzystywane w celu:</p>
        <ul>
          <li>utworzenia i obsługi konta użytkownika,</li>
          <li>zapewnienia dostępu do funkcji platformy,</li>
          <li>zapisywania postępów nauki,</li>
          <li>zapewnienia działania funkcji edukacyjnych,</li>
          <li>obsługi płatności i subskrypcji,</li>
          <li>zapewnienia bezpieczeństwa platformy,</li>
          <li>kontaktu z użytkownikiem w sprawach związanych z kontem,</li>
          <li>ulepszania działania oraz jakości usług.</li>
        </ul>
        <p>Examax nie wykorzystuje danych użytkowników w celu sprzedaży ich innym podmiotom.</p>
      </>
    ),
  },
  {
    id: "logowanie",
    title: "Konto użytkownika i uwierzytelnianie",
    body: (
      <>
        <p>Aby korzystać z części funkcji Examax, użytkownik może zostać poproszony o utworzenie konta.</p>
        <p>Użytkownik może korzystać z dostępnych metod logowania, takich jak:</p>
        <ul>
          <li>adres e-mail i hasło,</li>
          <li>dodatkowe bezpieczne metody uwierzytelniania dostępne na platformie.</li>
        </ul>
        <p>W celu ochrony kont użytkowników Examax może stosować mechanizmy bezpieczeństwa, takie jak:</p>
        <ul>
          <li>wymagania dotyczące silnych haseł,</li>
          <li>weryfikacja adresu e-mail,</li>
          <li>ograniczenia przeciwko nadużyciom,</li>
          <li>zabezpieczenia przed podejrzaną aktywnością.</li>
        </ul>
        <p>Użytkownik jest odpowiedzialny za zachowanie poufności swoich danych logowania.</p>
      </>
    ),
  },
  {
    id: "dane-nauki",
    title: "Dane związane z nauką i korzystaniem z platformy",
    body: (
      <>
        <p>Examax może przechowywać informacje związane z korzystaniem z platformy, takie jak:</p>
        <ul>
          <li>postępy nauki,</li>
          <li>wykonane ćwiczenia,</li>
          <li>zapisane wyniki,</li>
          <li>ustawienia użytkownika,</li>
          <li>historia korzystania z dostępnych funkcji.</li>
        </ul>
        <p>Dane te służą wyłącznie do zapewnienia użytkownikowi spersonalizowanego doświadczenia oraz umożliwienia dalszej nauki po ponownym zalogowaniu.</p>
      </>
    ),
  },
  {
    id: "korepetytor-ai",
    title: "Funkcje sztucznej inteligencji",
    body: (
      <>
        <p>Examax może oferować funkcje wykorzystujące sztuczną inteligencję.</p>
        <p>W ramach korzystania z tych funkcji mogą być przetwarzane:</p>
        <ul>
          <li>wiadomości wysyłane przez użytkownika,</li>
          <li>odpowiedzi generowane przez system,</li>
          <li>historia rozmów związana z korzystaniem z funkcji AI.</li>
        </ul>
        <p>Dane te są wykorzystywane w celu zapewnienia działania funkcji AI oraz umożliwienia użytkownikowi dostępu do swojej historii.</p>
        <p>Rozmowy użytkownika nie są publiczne i są dostępne wyłącznie dla użytkownika posiadającego dostęp do swojego konta.</p>
        <p>Examax nie wykorzystuje prywatnych rozmów użytkowników do celów reklamowych.</p>
      </>
    ),
  },
  {
    id: "platnosci",
    title: "Płatności i subskrypcje",
    body: (
      <>
        <p>Examax może oferować płatne plany oraz funkcje dodatkowe dostępne w ramach subskrypcji.</p>
        <p>Płatności są realizowane za pomocą bezpiecznych systemów płatniczych.</p>
        <p>Examax nie przechowuje pełnych danych karty płatniczej ani innych poufnych danych płatniczych.</p>
        <p>Możemy przetwarzać informacje związane z płatnościami, takie jak:</p>
        <ul>
          <li>status subskrypcji,</li>
          <li>wybrany plan,</li>
          <li>historia transakcji,</li>
          <li>informacje potrzebne do obsługi konta oraz płatności.</li>
        </ul>
        <p>Informacje dotyczące płatności są wykorzystywane wyłącznie w celu zapewnienia prawidłowego działania zakupionych usług.</p>
      </>
    ),
  },
  {
    id: "komunikacja-e-mail",
    title: "Komunikacja e-mail",
    body: (
      <>
        <p>Examax może wysyłać wiadomości związane z działaniem platformy, takie jak:</p>
        <ul>
          <li>potwierdzenie konta,</li>
          <li>informacje dotyczące bezpieczeństwa,</li>
          <li>odzyskiwanie dostępu,</li>
          <li>informacje dotyczące płatności,</li>
          <li>ważne informacje dotyczące działania usług.</li>
        </ul>
        <p>Użytkownik może również otrzymywać opcjonalne wiadomości dotyczące:</p>
        <ul>
          <li>nowych funkcji,</li>
          <li>aktualizacji platformy,</li>
          <li>ważnych ogłoszeń.</li>
        </ul>
        <p>Użytkownik może zarządzać preferencjami dotyczącymi komunikacji w ustawieniach konta.</p>
      </>
    ),
  },
  {
    id: "cookies",
    title: "Cookies i technologie podobne",
    body: (
      <>
        <p>Examax wykorzystuje niezbędne technologie pomagające zapewnić prawidłowe działanie platformy.</p>
        <p>Możemy wykorzystywać narzędzia analityczne służące do:</p>
        <ul>
          <li>monitorowania wydajności,</li>
          <li>poprawy działania platformy,</li>
          <li>analizowania ogólnego sposobu korzystania z usług.</li>
        </ul>
        <p>Examax nie wykorzystuje obecnie narzędzi reklamowych służących do tworzenia profili użytkowników na potrzeby reklam.</p>
        <p>
          Więcej informacji znajduje się w <Link href="/legal/cookies">Polityce Cookies</Link>.
        </p>
      </>
    ),
  },
  {
    id: "udostepnianie-danych",
    title: "Udostępnianie danych",
    body: (
      <>
        <p>Examax nie sprzedaje danych osobowych użytkowników.</p>
        <p>Dane użytkowników nie są przekazywane podmiotom trzecim w celach reklamowych.</p>
        <p>Dane mogą być przetwarzane przez zaufanych dostawców usług wyłącznie wtedy, gdy jest to konieczne do:</p>
        <ul>
          <li>działania platformy,</li>
          <li>zapewnienia bezpieczeństwa,</li>
          <li>realizacji usług,</li>
          <li>obsługi użytkowników.</li>
        </ul>
        <p>Dane mogą zostać przekazane również wtedy, gdy wymagają tego obowiązujące przepisy prawa.</p>
      </>
    ),
  },
  {
    id: "bezpieczenstwo-danych",
    title: "Bezpieczeństwo danych",
    body: (
      <>
        <p>Examax stosuje odpowiednie środki techniczne i organizacyjne mające na celu ochronę danych użytkowników.</p>
        <p>Obejmuje to między innymi:</p>
        <ul>
          <li>zabezpieczenie kont użytkowników,</li>
          <li>ochronę przed nieautoryzowanym dostępem,</li>
          <li>ograniczanie nadużyć,</li>
          <li>monitorowanie bezpieczeństwa platformy.</li>
        </ul>
        <p>Żaden system internetowy nie może jednak zagwarantować całkowitego bezpieczeństwa.</p>
      </>
    ),
  },
  {
    id: "okres-przechowywania",
    title: "Okres przechowywania danych",
    body: (
      <>
        <p>Dane użytkownika są przechowywane tak długo, jak długo konto pozostaje aktywne lub do momentu zgłoszenia żądania usunięcia danych.</p>
        <p>Niektóre informacje mogą być przechowywane dłużej, jeżeli wymagają tego przepisy prawa lub uzasadnione cele, takie jak bezpieczeństwo, zapobieganie nadużyciom lub prowadzenie wymaganej dokumentacji.</p>
      </>
    ),
  },
  {
    id: "usuniecie-konta",
    title: "Usunięcie konta",
    body: (
      <>
        <p>Użytkownik może zażądać usunięcia swojego konta.</p>
        <p>Po usunięciu konta mogą zostać usunięte między innymi:</p>
        <ul>
          <li>dane konta,</li>
          <li>zapisane postępy,</li>
          <li>historia korzystania z funkcji,</li>
          <li>zapisane dane użytkownika.</li>
        </ul>
        <p>Niektóre informacje mogą zostać zachowane wyłącznie w formie wymaganej przez prawo lub jako anonimowe dane statystyczne, które nie pozwalają na identyfikację użytkownika.</p>
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
          <li>poprawienia nieprawidłowych danych,</li>
          <li>usunięcia danych,</li>
          <li>otrzymania kopii swoich danych,</li>
          <li>uzyskania informacji dotyczących przetwarzania danych,</li>
          <li>wniesienia sprzeciwu wobec określonych sposobów przetwarzania.</li>
        </ul>
        <p>W celu realizacji swoich praw należy skontaktować się:</p>
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
        <p>Examax może być używany przez użytkowników niezależnie od miejsca zamieszkania.</p>
        <p>Platforma jest przeznaczona głównie dla osób korzystających z polskich materiałów edukacyjnych i przygotowujących się do polskich egzaminów.</p>
      </>
    ),
  },
  {
    id: "zmiany-polityki",
    title: "Zmiany w Polityce Prywatności",
    body: (
      <>
        <p>Examax może aktualizować niniejszą Politykę Prywatności w związku z rozwojem platformy, wprowadzaniem nowych funkcji lub zmianami prawnymi.</p>
        <p>Aktualna wersja dokumentu będzie zawsze dostępna na stronie Examax wraz z informacją o dacie ostatniej aktualizacji.</p>
        <p>W przypadku istotnych zmian użytkownicy mogą zostać poinformowani za pomocą dostępnych kanałów komunikacji.</p>
      </>
    ),
  },
  {
    id: "kontakt",
    title: "Kontakt",
    body: (
      <>
        <p>W przypadku pytań dotyczących prywatności lub danych osobowych prosimy o kontakt:</p>
        <p>
          <Mail />
        </p>
      </>
    ),
  },
];
