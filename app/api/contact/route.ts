import {
  CONTACT_LIMITS,
  SUPPORT_CATEGORIES,
  isEmail,
  isSupportCategory,
  type ContactKind,
  type SupportCategory,
} from "@/lib/contact";
import { take } from "@/lib/rateLimit";

/*
 * POST /api/contact — the contact forms' backend. Takes the form as
 * multipart form data, checks it against the same rules the form uses, and
 * sends it through Resend's REST API to one of four Examax channels, each
 * with its own sender and inbox (set in the environment):
 *
 *   sales form                          INSTITUTIONS_FROM → INSTITUTIONS_INBOX
 *   Problem techniczny, Błąd AI         REPORT_FROM       → REPORT_INBOX
 *   Problem z kontem, Płatności         SUPPORT_FROM      → SUPPORT_INBOX
 *   Sugestia, Inne, or no category      CONTACT_FROM      → CONTACT_INBOX
 *
 * Reply-To is the visitor ("Ala Nowak" <ala@…>), so replying from the inbox
 * answers them by name. The visitor's address is never the From: only the
 * verified examax.app senders are.
 *
 * Safety, in the order a request meets it:
 *   1. Same-origin only: a POST from any other site is refused.
 *   2. Bodies over 5 MB are refused before they are read.
 *   3. Per-IP limits (every request) and per-address and overall send
 *      limits (see lib/rateLimit.ts for what they do and do not cover).
 *   4. A hidden honeypot field and a minimum fill time: bots are told
 *      "sent" and nothing is sent.
 *   5. Every field is validated; control characters are stripped; the HTML
 *      body escapes everything the visitor wrote.
 *   6. A screenshot must really be a PNG, JPEG or WebP — checked by its
 *      bytes, not its name or claimed type — and is renamed by the server,
 *      so no script, page or program can ride along as an attachment. It is
 *      never stored or executed, only forwarded.
 * The Resend key never leaves this file's process.env read, and logs carry
 * variable names and Resend's error text only, never values.
 */

type Field = "email" | "message" | "name" | "category" | "screenshot";
type Channel = "institutions" | "report" | "support" | "contact";

const CHANNELS: Record<Channel, { from: string; inbox: string; label: string }> = {
  institutions: { from: "INSTITUTIONS_FROM", inbox: "INSTITUTIONS_INBOX", label: "Instytucje" },
  report: { from: "REPORT_FROM", inbox: "REPORT_INBOX", label: "Zgłoszenie" },
  support: { from: "SUPPORT_FROM", inbox: "SUPPORT_INBOX", label: "Pomoc" },
  contact: { from: "CONTACT_FROM", inbox: "CONTACT_INBOX", label: "Kontakt" },
};

function channelFor(kind: ContactKind, category: SupportCategory | null): Channel {
  if (kind === "sales") return "institutions";
  if (category === "techniczny" || category === "ai") return "report";
  if (category === "konto" || category === "platnosci") return "support";
  return "contact";
}

const MAX_BODY_BYTES = 5 * 1024 * 1024;
/** Faster than this from the form appearing to sending, and it was not a person typing. */
const MIN_FILL_MS = 2000;

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

const RATE_LIMITED = "Wysłano zbyt wiele wiadomości. Spróbuj ponownie później.";
const NOT_SENT = "Nie udało się wysłać wiadomości.";

const json = (body: object, status = 200, headers?: HeadersInit) => Response.json(body, { status, headers });

/** Strips control characters; `multiline` keeps line breaks and tabs. */
function clean(value: FormDataEntryValue | null, multiline = false) {
  if (typeof value !== "string") return "";
  const stripped = multiline
    ? value.replace(/\r\n?/g, "\n").replace(/[\u0000-\u0008\u000B-\u001F\u007F]/g, "")
    : value.replace(/[\u0000-\u001F\u007F]/g, " ");
  return stripped.trim();
}

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]!);

/** What a file's first bytes say it is — the only thing about an upload that is trusted. */
function sniffImage(bytes: Uint8Array): { type: string; extension: string } | null {
  const starts = (signature: number[], offset = 0) => signature.every((byte, i) => bytes[offset + i] === byte);
  if (starts([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) return { type: "image/png", extension: "png" };
  if (starts([0xff, 0xd8, 0xff])) return { type: "image/jpeg", extension: "jpg" };
  if (starts([0x52, 0x49, 0x46, 0x46]) && starts([0x57, 0x45, 0x42, 0x50], 8)) return { type: "image/webp", extension: "webp" };
  return null;
}

function isSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  if (!origin || !host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

function clientIp(request: Request) {
  return request.headers.get("x-real-ip") ?? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}

function tooMany(retryAfter: number) {
  return json({ error: RATE_LIMITED }, 429, { "Retry-After": String(retryAfter) });
}

/** A sender must be an address ("Name <a@b>" or "a@b"), so a misplaced key can never be sent as one. */
const isSender = (value: string | undefined): value is string =>
  !!value && /^(?:[^<>@\r\n]*<[^<>\s@]+@[^<>\s@]+>|[^<>\s@]+@[^<>\s@]+)$/.test(value.trim());

function readConfig(channel: Channel) {
  const names = CHANNELS[channel];
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env[names.from];
  const inbox = process.env[names.inbox];
  const missing = [
    !apiKey ? "RESEND_API_KEY" : null,
    !isSender(from) ? names.from : null,
    !(inbox && isEmail(inbox)) ? names.inbox : null,
  ].filter((name): name is string => name !== null);
  return missing.length ? { missing } : { missing: null, apiKey: apiKey!, from: from!.trim(), inbox: inbox!.trim() };
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return json({ error: "Niedozwolone źródło zgłoszenia." }, 403);

  if (Number(request.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) {
    return json({ error: "Zgłoszenie jest za duże." }, 413);
  }

  const ip = clientIp(request);
  const perIp = take([
    { key: `contact:ip:10m:${ip}`, max: 5, windowMs: 10 * MINUTE },
    { key: `contact:ip:1d:${ip}`, max: 20, windowMs: DAY },
  ]);
  if (!perIp.ok) return tooMany(perIp.retryAfter);

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return json({ error: "Nieprawidłowe zgłoszenie." }, 400);
  }

  // Bots: answered as if sent, so they learn nothing; nothing is sent.
  const elapsed = Number(clean(form.get("elapsed")));
  if (clean(form.get("website")) !== "" || !Number.isFinite(elapsed) || elapsed < MIN_FILL_MS) return json({ ok: true });

  const kind: ContactKind = clean(form.get("kind")) === "sales" ? "sales" : "support";
  const email = clean(form.get("email"));
  const message = clean(form.get("message"), true);
  const name = clean(form.get("name")).replace(/["<>\\]/g, "");
  const rawCategory = clean(form.get("category"));
  const category = isSupportCategory(rawCategory) ? rawCategory : null;
  const upload = form.get("screenshot");
  const file = kind === "support" && upload instanceof File && upload.size > 0 ? upload : null;

  const errors: Partial<Record<Field, string>> = {};
  if (!isEmail(email)) errors.email = "Podaj poprawny adres e-mail.";
  if (!message) errors.message = "Napisz wiadomość.";
  else if (message.length > CONTACT_LIMITS.message) errors.message = `Wiadomość może mieć najwyżej ${CONTACT_LIMITS.message} znaków.`;
  if (name.length > CONTACT_LIMITS.name) errors.name = `Imię może mieć najwyżej ${CONTACT_LIMITS.name} znaków.`;
  if (rawCategory && !category) errors.category = "Wybierz kategorię z listy.";

  let attachment: { filename: string; content: string; content_type: string } | null = null;
  if (file) {
    if (file.size > CONTACT_LIMITS.screenshotBytes) errors.screenshot = "Zrzut ekranu może mieć najwyżej 4 MB.";
    else {
      const bytes = new Uint8Array(await file.arrayBuffer());
      const image = sniffImage(bytes);
      if (!image) errors.screenshot = "Zrzut ekranu musi być obrazem PNG, JPG lub WebP.";
      else attachment = { filename: `zrzut-ekranu.${image.extension}`, content: Buffer.from(bytes).toString("base64"), content_type: image.type };
    }
  }
  if (Object.keys(errors).length) return json({ error: "Popraw zaznaczone pola.", fields: errors }, 400);

  const channel = channelFor(kind, category);
  const config = readConfig(channel);
  if (config.missing) {
    console.error(`[contact] Channel "${channel}" is not configured; missing or invalid: ${config.missing.join(", ")}`);
    return json({ error: "Formularz jest chwilowo niedostępny." }, 503);
  }

  const perSend = take([
    { key: `contact:email:1h:${email.toLowerCase()}`, max: 3, windowMs: HOUR },
    { key: "contact:all:1h", max: 60, windowMs: HOUR },
  ]);
  if (!perSend.ok) return tooMany(perSend.retryAfter);

  const categoryLabel = SUPPORT_CATEGORIES.find((c) => c.key === category)?.label ?? null;
  const sender = name ? `${name} <${email}>` : email;
  const subject = [CHANNELS[channel].label, categoryLabel, name || email].filter(Boolean).join(" — ").slice(0, 150);

  const details: Array<[string, string]> = [
    ["Od", sender],
    ["Formularz", kind === "sales" ? "Instytucje" : "Wsparcie"],
    ...(categoryLabel ? ([["Kategoria", categoryLabel]] as Array<[string, string]>) : []),
    ...(attachment ? ([["Załącznik", attachment.filename]] as Array<[string, string]>) : []),
  ];
  const text = `${details.map(([label, value]) => `${label}: ${value}`).join("\n")}\n\n${message}`;
  const html = `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:14px;line-height:1.55;color:#171717">
<table cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:0 0 16px">
${details.map(([label, value]) => `<tr><td style="padding:2px 16px 2px 0;color:#737373;vertical-align:top">${escapeHtml(label)}</td><td style="padding:2px 0">${escapeHtml(value)}</td></tr>`).join("\n")}
</table>
<div style="border-top:1px solid #e5e5e5;padding-top:16px;white-space:pre-wrap">${escapeHtml(message)}</div>
</div>`;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${config.apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: config.from,
        to: [config.inbox],
        reply_to: name ? `"${name}" <${email}>` : email,
        subject,
        text,
        html,
        attachments: attachment ? [attachment] : undefined,
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) {
      const detail: { name?: string; message?: string } = await response.json().catch(() => ({}));
      console.error(`[contact] Resend refused (${response.status}) ${detail.name ?? ""}: ${(detail.message ?? "").slice(0, 200)}`);
      return json({ error: NOT_SENT }, 502);
    }
  } catch (error) {
    console.error(`[contact] Resend request failed: ${error instanceof Error ? error.name : "unknown error"}`);
    return json({ error: NOT_SENT }, 502);
  }

  return json({ ok: true });
}
