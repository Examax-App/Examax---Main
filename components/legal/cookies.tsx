import type { LegalSection } from "@/components/legal/LegalDocument";

/*
 * The cookie policy (Polityka Cookies) at /legal/cookies, in the owner's own
 * words (supplied 2026-10-08), on the same LegalDocument as the privacy
 * policy. LegalDocument numbers the sections, so titles carry no numbers.
 * Every section's `id` is its anchor: keep ids stable once the page is public.
 */

/** Where every question about cookies goes. */
const COOKIES_EMAIL = "pomoc@examax.app";

/** The date the policy last changed — bump it with every edit below. */
export const COOKIES_UPDATED = "2026-10-08";

const Mail = () => <a href={`mailto:${COOKIES_EMAIL}`}>{COOKIES_EMAIL}</a>;

export const COOKIES_SECTIONS: LegalSection[] = [
  {
    id: "informacje-ogolne",
    title: "Informacje ogólne",
    body: (
      <>
        <p>Niniejsza Polityka Cookies opisuje zasady wykorzystywania plików cookies oraz podobnych technologii podczas korzystania z platformy Examax.</p>
        <p>Celem stosowania tych technologii jest zapewnienie prawidłowego działania platformy, poprawa jakości usług oraz analiza sposobu korzystania z serwisu.</p>
        <p>Korzystając z Examax, użytkownik może korzystać z technologii wspierających działanie platformy zgodnie z zasadami opisanymi w niniejszym dokumencie.</p>
      </>
    ),
  },
  {
    id: "czym-sa-cookies",
    title: "Czym są pliki cookies",
    body: (
      <>
        <p>Pliki cookies to niewielkie informacje zapisywane na urządzeniu użytkownika podczas korzystania ze stron internetowych.</p>
        <p>Pozwalają one między innymi na:</p>
        <ul>
          <li>prawidłowe działanie stron internetowych,</li>
          <li>zapamiętywanie wybranych ustawień,</li>
          <li>poprawę wydajności usług,</li>
          <li>analizowanie sposobu korzystania z platformy.</li>
        </ul>
      </>
    ),
  },
  {
    id: "wykorzystywane-technologie",
    title: "Jakie technologie wykorzystuje Examax",
    body: (
      <>
        <p>Examax wykorzystuje wyłącznie technologie, które są potrzebne do działania platformy oraz poprawy jej jakości.</p>
        <p>Możemy wykorzystywać technologie służące do:</p>
        <ul>
          <li>zapewnienia prawidłowego działania funkcji platformy,</li>
          <li>utrzymania bezpieczeństwa,</li>
          <li>analizowania ogólnej wydajności serwisu,</li>
          <li>wykrywania problemów technicznych.</li>
        </ul>
      </>
    ),
  },
  {
    id: "analityka",
    title: "Analityka",
    body: (
      <>
        <p>Examax może korzystać z narzędzi analitycznych w celu zrozumienia, jak użytkownicy korzystają z platformy.</p>
        <p>Analiza ta pomaga między innymi:</p>
        <ul>
          <li>poprawiać działanie serwisu,</li>
          <li>wykrywać problemy,</li>
          <li>rozwijać funkcje platformy,</li>
          <li>zapewniać lepsze doświadczenie użytkowników.</li>
        </ul>
        <p>Dane analityczne są wykorzystywane w celu poprawy działania usługi, a nie do tworzenia profili reklamowych użytkowników.</p>
      </>
    ),
  },
  {
    id: "brak-sledzenia-reklamowego",
    title: "Brak reklamowego śledzenia użytkowników",
    body: (
      <>
        <p>Examax nie wykorzystuje technologii służących do:</p>
        <ul>
          <li>sprzedaży danych użytkowników,</li>
          <li>tworzenia profili reklamowych,</li>
          <li>śledzenia użytkowników między różnymi stronami internetowymi w celach marketingowych.</li>
        </ul>
      </>
    ),
  },
  {
    id: "zarzadzanie-ustawieniami",
    title: "Zarządzanie ustawieniami",
    body: (
      <>
        <p>Użytkownik może zarządzać ustawieniami swojej przeglądarki, w tym ograniczyć lub usunąć zapisane pliki cookies.</p>
        <p>Należy pamiętać, że ograniczenie niektórych technologii może wpłynąć na prawidłowe działanie wybranych funkcji platformy.</p>
      </>
    ),
  },
  {
    id: "zmiany-polityki",
    title: "Zmiany w Polityce Cookies",
    body: (
      <>
        <p>Examax może aktualizować niniejszą Politykę Cookies w związku ze zmianami funkcji platformy, stosowanych rozwiązań lub obowiązujących przepisów.</p>
        <p>Aktualna wersja dokumentu będzie zawsze dostępna na stronie Examax wraz z datą ostatniej aktualizacji.</p>
      </>
    ),
  },
  {
    id: "kontakt",
    title: "Kontakt",
    body: (
      <>
        <p>W przypadku pytań dotyczących wykorzystywania cookies lub prywatności:</p>
        <p>
          <Mail />
        </p>
      </>
    ),
  },
];
