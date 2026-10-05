/** Where the site's contact links and forms send mail: support and everything general. */
export const CONTACT_EMAIL = "pomoc@examax.app";
/** Schools and institutions: the sales form and the contact hub's Sales card. */
export const SALES_EMAIL = "instytucje@examax.app";

/*
 * The contact form's rules, shared by the form in the browser and the
 * /api/contact route on the server, so the two can never disagree on what a
 * valid message is.
 */

export type ContactKind = "sales" | "support";

export type SupportCategory = "techniczny" | "konto" | "platnosci" | "ai" | "sugestia" | "inne";

export const SUPPORT_CATEGORIES: Array<{ key: SupportCategory; label: string }> = [
  { key: "techniczny", label: "Problem techniczny" },
  { key: "konto", label: "Problem z kontem" },
  { key: "platnosci", label: "Płatności" },
  { key: "ai", label: "Błąd AI" },
  { key: "sugestia", label: "Sugestia" },
  { key: "inne", label: "Inne" },
];

export const CONTACT_LIMITS = {
  name: 100,
  message: 5000,
  /** One screenshot, kept under Vercel's 4.5 MB request body limit with room for the text fields. */
  screenshotBytes: 4 * 1024 * 1024,
} as const;

export const SCREENSHOT_TYPES = ["image/png", "image/jpeg", "image/webp"] as const;

/**
 * The HTML standard's e-mail grammar, plus a dot in the domain: no spaces,
 * quotes, commas or angle brackets, so an address can never smuggle a second
 * recipient or a display name into a mail header.
 */
export const isEmail = (email: string) => {
  const value = email.trim();
  return (
    value.length <= 254 &&
    /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)+$/.test(value)
  );
};

export const isSupportCategory = (value: unknown): value is SupportCategory =>
  SUPPORT_CATEGORIES.some((category) => category.key === value);

export const isScreenshotType = (type: string): boolean => (SCREENSHOT_TYPES as readonly string[]).includes(type);
