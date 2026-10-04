/**
 * Who can open an account: an address at one of the big inbox providers,
 * whose name follows that provider's own rules and reads like a person's —
 * no school, company or other custom domains, no "test@", no keyboard mash.
 * A plain local check, so it costs no request and can't be rate-limited; the
 * future sign-up endpoint should run the same one on the server. Whether the
 * inbox really exists is only proven by the code sent to it.
 */

type MailboxRule = {
  /** Length of the name, not counting a "+tag" (or, for Gmail, its dots). */
  min: number;
  max: number;
  /** Characters besides letters and digits. */
  punctuation: string;
  /** Whether the provider delivers "name+tag" to "name". */
  plusTags: boolean;
};

const GOOGLE: MailboxRule = { min: 6, max: 30, punctuation: ".", plusTags: true };
const MICROSOFT: MailboxRule = { min: 3, max: 64, punctuation: "._-", plusTags: true };
const APPLE: MailboxRule = { min: 3, max: 20, punctuation: "._", plusTags: true };
const YAHOO: MailboxRule = { min: 4, max: 32, punctuation: "._", plusTags: false };
const PROTON: MailboxRule = { min: 3, max: 40, punctuation: "._-", plusTags: true };
const POLISH_PORTAL: MailboxRule = { min: 3, max: 64, punctuation: "._-", plusTags: false };

const PROVIDERS: Record<string, MailboxRule> = {
  "gmail.com": GOOGLE,
  "googlemail.com": GOOGLE,
  "outlook.com": MICROSOFT,
  "hotmail.com": MICROSOFT,
  "live.com": MICROSOFT,
  "msn.com": MICROSOFT,
  "icloud.com": APPLE,
  "me.com": APPLE,
  "mac.com": APPLE,
  "yahoo.com": YAHOO,
  "proton.me": PROTON,
  "protonmail.com": PROTON,
  // Wirtualna Polska
  "wp.pl": POLISH_PORTAL,
  "o2.pl": POLISH_PORTAL,
  "tlen.pl": POLISH_PORTAL,
  // Onet
  "onet.pl": POLISH_PORTAL,
  "op.pl": POLISH_PORTAL,
  "vp.pl": POLISH_PORTAL,
  "onet.eu": POLISH_PORTAL,
  "poczta.onet.pl": POLISH_PORTAL,
  // Interia
  "interia.pl": POLISH_PORTAL,
  "interia.eu": POLISH_PORTAL,
  "poczta.fm": POLISH_PORTAL,
  "gazeta.pl": POLISH_PORTAL,
};

/** Names people type when they don't want to give a real one (compared without dots, digits or dashes). */
const PLACEHOLDER_NAMES = new Set([
  "test", "tests", "testing", "tester", "testowy", "testowa", "testtest",
  "something", "someone", "somebody", "anything", "anyone", "nothing", "nobody", "whatever",
  "example", "sample", "demo", "email", "mail", "user", "username", "admin", "administrator", "root",
  "fake", "spam", "junk", "trash", "temp", "tmp", "null", "none", "undefined", "noreply", "noname",
  "anonymous", "anon", "anonim", "hello", "random", "password", "login", "account",
  "abc", "abcd", "xyz", "foo", "bar", "foobar", "baz", "qwe", "asd", "zxc", "lol", "idk",
  "cos", "cokolwiek", "ktos", "ktokolwiek", "nikt", "nic", "jakis", "jakas", "przyklad", "przykladowy",
  "haslo", "konto", "imie", "nazwisko", "imienazwisko", "jankowalski", "alanowak", "examax",
]);

/** Keyboard rows and the alphabet, either way round — where mashed letters come from. */
const RUNS = ["qwertyuiop", "asdfghjkl", "zxcvbnm", "abcdefghijklmnopqrstuvwxyz"];
const MASH = new Set(
  RUNS.flatMap((row) => [row, [...row].reverse().join("")]).flatMap((row) =>
    Array.from({ length: row.length - 3 }, (_, i) => row.slice(i, i + 4)),
  ),
);
// Real words that happen to contain a run: liberty, property, Ewert.
for (const word of ["erty", "wert", "ytre", "trew"]) MASH.delete(word);

const VOWELS = /[aeiouy]/g;

/** Whether a name reads like gibberish rather than a person's handle. */
function looksMadeUp(name: string) {
  const letters = name.replace(/[^a-z]/g, "");
  if (letters.length < 2) return true;
  if (PLACEHOLDER_NAMES.has(letters)) return true;
  if (/([a-z])\1\1/.test(letters)) return true;
  for (let i = 0; i + 4 <= letters.length; i++) if (MASH.has(letters.slice(i, i + 4))) return true;
  // Polish clusters run long (szcz, chrz, tomaSZSZCZepaniak), so only seven
  // consonants in a row, or almost no vowels at all, give a mash away.
  if (/[^aeiouy]{7}/.test(letters)) return true;
  const vowels = letters.match(VOWELS)?.length ?? 0;
  if (letters.length >= 4 && vowels === 0) return true;
  if (letters.length >= 6 && vowels / letters.length < 0.15) return true;
  if (letters.length >= 8 && new Set(letters).size / letters.length < 0.35) return true;
  return false;
}

/** Whether an address is at one of the providers above at all (for the typo hint). */
export function isAllowedEmailDomain(domain: string) {
  return domain.toLowerCase() in PROVIDERS;
}

/** Whether an account can be opened with this address. */
export function canRegisterEmail(email: string) {
  const at = email.lastIndexOf("@");
  const domain = email.slice(at + 1).toLowerCase();
  const rule = PROVIDERS[domain];
  if (!rule || at < 1) return false;

  let name = email.slice(0, at).toLowerCase();
  if (rule.plusTags) name = name.split("+")[0];
  const punctuation = rule.punctuation.replace(/[-.]/g, "\\$&");
  // Letters and digits, starting and ending on one, punctuation never doubled.
  if (!new RegExp(`^[a-z0-9]+([${punctuation}][a-z0-9]+)*$`).test(name)) return false;

  const length = rule === GOOGLE ? name.replace(/\./g, "").length : name.length;
  if (length < rule.min || length > rule.max) return false;
  return !looksMadeUp(name);
}
