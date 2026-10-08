import type { LegalSection } from "@/components/legal/LegalDocument";

/*
 * The GDPR notice (RODO) at /legal/gdpr, in the owner's own words (supplied
 * 2026-10-08), on the same LegalDocument as the privacy policy.
 * LegalDocument numbers the sections, so titles carry no numbers. Every
 * section's `id` is its anchor: keep ids stable once the page is public.
 */

/** Where every data-protection question goes. */
const GDPR_EMAIL = "pomoc@examax.app";

/** The date the notice last changed — bump it with every edit below. */
export const GDPR_UPDATED = "2026-10-08";

const Mail = () => <a href={`mailto:${GDPR_EMAIL}`}>{GDPR_EMAIL}</a>;

export const GDPR_SECTIONS: LegalSection[] = [
  {
    id: "informacje-ogolne",
    title: "Informacje ogólne",
    body: (
      <>
        <p>Examax przykłada dużą wagę do ochrony prywatności użytkowników oraz przetwarzania danych osobowych zgodnie z obowiązującymi przepisami, w szczególności zgodnie z Rozporządzeniem Parlamentu Europejskiego i Rady (UE) 2016/679 (RODO).</p>
        <p>Niniejszy dokument przedstawia najważniejsze informacje dotyczące zasad ochrony danych osobowych użytkowników korzystających z platformy Examax.</p>
      </>
    ),
  },
  {
    id: "administrator-danych",
    title: "Administrator danych osobowych",
    body: (
      <>
        <p>Administratorem danych osobowych użytkowników jest podmiot odpowiedzialny za prowadzenie platformy Examax.</p>
        <p>Kontakt w sprawach dotyczących ochrony danych osobowych:</p>
        <p>
          <Mail />
        </p>
        <p>Użytkownik może skontaktować się z administratorem w sprawach dotyczących swoich danych oraz realizacji praw wynikających z RODO.</p>
      </>
    ),
  },
  {
    id: "przetwarzane-dane",
    title: "Jakie dane mogą być przetwarzane",
    body: (
      <>
        <p>Zakres przetwarzanych danych zależy od sposobu korzystania z platformy.</p>
        <p>Mogą to być między innymi:</p>
        <ul>
          <li>dane potrzebne do utworzenia i obsługi konta,</li>
          <li>informacje dotyczące uwierzytelniania,</li>
          <li>informacje związane z korzystaniem z platformy,</li>
          <li>zapisane postępy nauki,</li>
          <li>dane związane z korzystaniem z dostępnych funkcji,</li>
          <li>informacje wymagane do obsługi płatności.</li>
        </ul>
        <p>Examax przetwarza wyłącznie dane niezbędne do realizacji określonych celów.</p>
      </>
    ),
  },
  {
    id: "cele-przetwarzania",
    title: "Cele przetwarzania danych",
    body: (
      <>
        <p>Dane osobowe mogą być przetwarzane w celu:</p>
        <ul>
          <li>utworzenia i utrzymania konta użytkownika,</li>
          <li>zapewnienia dostępu do usług,</li>
          <li>umożliwienia korzystania z funkcji edukacyjnych,</li>
          <li>obsługi płatności,</li>
          <li>zapewnienia bezpieczeństwa,</li>
          <li>komunikacji z użytkownikiem,</li>
          <li>ulepszania jakości platformy.</li>
        </ul>
      </>
    ),
  },
  {
    id: "podstawy-prawne",
    title: "Podstawy prawne przetwarzania danych",
    body: (
      <>
        <p>Dane osobowe mogą być przetwarzane na podstawie:</p>
        <p>
          <strong>Wykonania umowy</strong>
        </p>
        <p>Gdy przetwarzanie jest konieczne do zapewnienia użytkownikowi dostępu do usług Examax.</p>
        <p>
          <strong>Zgody użytkownika</strong>
        </p>
        <p>W przypadkach, w których przepisy wymagają uzyskania zgody użytkownika.</p>
        <p>
          <strong>Obowiązków prawnych</strong>
        </p>
        <p>Jeżeli przechowywanie lub przetwarzanie danych jest wymagane przez obowiązujące przepisy.</p>
        <p>
          <strong>Prawnie uzasadnionych interesów</strong>
        </p>
        <p>W celu zapewnienia bezpieczeństwa, ochrony platformy, zapobiegania nadużyciom oraz poprawy jakości usług.</p>
      </>
    ),
  },
  {
    id: "udostepnianie-danych",
    title: "Udostępnianie danych",
    body: (
      <>
        <p>Examax nie sprzedaje danych osobowych użytkowników.</p>
        <p>Dane mogą być przekazywane wyłącznie wtedy, gdy jest to konieczne do działania platformy, realizacji usług lub wymagane przez prawo.</p>
        <p>Examax wymaga, aby podmioty przetwarzające dane przestrzegały zasad ochrony prywatności oraz bezpieczeństwa.</p>
      </>
    ),
  },
  {
    id: "okres-przechowywania",
    title: "Okres przechowywania danych",
    body: (
      <>
        <p>Dane osobowe są przechowywane przez okres korzystania z konta użytkownika lub do momentu zgłoszenia żądania ich usunięcia.</p>
        <p>Niektóre informacje mogą być przechowywane dłużej, jeżeli jest to wymagane przez przepisy prawa lub konieczne do ochrony uzasadnionych interesów, takich jak bezpieczeństwo lub rozliczenia.</p>
      </>
    ),
  },
  {
    id: "twoje-prawa",
    title: "Prawa użytkownika",
    body: (
      <>
        <p>Na podstawie RODO użytkownik ma prawo do:</p>
        <ul>
          <li>dostępu do swoich danych,</li>
          <li>otrzymania kopii danych,</li>
          <li>poprawienia nieprawidłowych danych,</li>
          <li>usunięcia danych,</li>
          <li>ograniczenia przetwarzania,</li>
          <li>wniesienia sprzeciwu wobec określonych sposobów przetwarzania,</li>
          <li>przenoszenia danych, jeżeli ma to zastosowanie.</li>
        </ul>
        <p>W celu skorzystania z tych praw należy skontaktować się:</p>
        <p>
          <Mail />
        </p>
      </>
    ),
  },
  {
    id: "usuniecie-danych",
    title: "Usunięcie danych i konta",
    body: (
      <>
        <p>Użytkownik może zażądać usunięcia swojego konta.</p>
        <p>Po zakończeniu procesu usuwania mogą zostać usunięte:</p>
        <ul>
          <li>dane konta,</li>
          <li>zapisane postępy,</li>
          <li>dane związane z korzystaniem z platformy.</li>
        </ul>
        <p>Niektóre dane mogą zostać zachowane wyłącznie wtedy, gdy wymagają tego przepisy prawa lub gdy zostały pozbawione możliwości identyfikacji użytkownika.</p>
      </>
    ),
  },
  {
    id: "bezpieczenstwo-danych",
    title: "Bezpieczeństwo danych",
    body: (
      <>
        <p>Examax stosuje odpowiednie środki mające na celu ochronę danych użytkowników przed:</p>
        <ul>
          <li>nieautoryzowanym dostępem,</li>
          <li>utratą,</li>
          <li>niewłaściwym wykorzystaniem.</li>
        </ul>
        <p>Pomimo stosowania zabezpieczeń żadna usługa internetowa nie może zagwarantować całkowitego bezpieczeństwa.</p>
      </>
    ),
  },
  {
    id: "prawo-do-skargi",
    title: "Prawo do wniesienia skargi",
    body: (
      <>
        <p>Jeżeli użytkownik uważa, że jego dane są przetwarzane niezgodnie z obowiązującymi przepisami, ma prawo złożyć skargę do właściwego organu nadzorczego.</p>
        <p>W Polsce organem właściwym jest:</p>
        <p>
          <strong>Prezes Urzędu Ochrony Danych Osobowych (UODO)</strong>
        </p>
      </>
    ),
  },
  {
    id: "zmiany-dokumentu",
    title: "Zmiany dokumentu",
    body: (
      <>
        <p>Examax może aktualizować informacje dotyczące ochrony danych osobowych w związku z rozwojem platformy, zmianami funkcji lub zmianami prawnymi.</p>
        <p>Aktualna wersja dokumentu będzie dostępna na stronie Examax.</p>
      </>
    ),
  },
  {
    id: "kontakt",
    title: "Kontakt",
    body: (
      <>
        <p>W sprawach dotyczących ochrony danych osobowych:</p>
        <p>
          <Mail />
        </p>
      </>
    ),
  },
];
