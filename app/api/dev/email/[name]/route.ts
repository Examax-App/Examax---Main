import { readFile } from "node:fs/promises";
import path from "node:path";

/*
 * The auth e-mails (supabase/templates/*.html) filled with sample values,
 * for the dev panel (components/dev/DevTools.tsx). Development only: a
 * production build answers 404 and never reads the files.
 */

const TEMPLATES = new Set(["confirmation", "magic_link", "recovery", "email_change"]);

const SAMPLE: Record<string, string> = {
  "{{ .RedirectTo }}": "#",
  "{{ .TokenHash }}": "podglad",
  "{{ .Email }}": "ala.nowak@gmail.com",
  "{{ .NewEmail }}": "ala.nowak@outlook.com",
  "{{ .SiteURL }}": "https://examax.app",
};

export async function GET(_request: Request, { params }: { params: Promise<{ name: string }> }) {
  if (process.env.NODE_ENV === "production") return new Response("Not found", { status: 404 });
  const { name } = await params;
  if (!TEMPLATES.has(name)) return new Response("Not found", { status: 404 });

  let html = await readFile(path.join(process.cwd(), "supabase", "templates", `${name}.html`), "utf8");
  for (const [placeholder, value] of Object.entries(SAMPLE)) html = html.replaceAll(placeholder, value);
  return new Response(html, { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" } });
}
