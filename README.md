# Examax

**Examax** to platforma do nauki na egzamin ósmoklasisty i maturę — oparta na oryginalnych arkuszach CKE, z roadmapą ułożoną pod termin egzaminu, symulacjami i Korepetytorem AI, który prowadzi krok po kroku zamiast podawać gotowe odpowiedzi.

This repository is the Examax website and front-end: the public marketing site at [examax.app](https://examax.app), the product pages, and the auth screens. The project is in **public preview** — the learning platform is not open yet (see [`PRODUCT.md`](PRODUCT.md)).

---

## Stack

- [Next.js 16](https://nextjs.org) (App Router, Turbopack) and React 19
- TypeScript, Tailwind CSS 4
- [Remotion](https://www.remotion.dev) for the product films, played in the page with `@remotion/player`
- Fonts self-hosted at build time (Satoshi, Inter, Geist Mono)

Accounts run on [Supabase Auth](https://supabase.com/docs/guides/auth) (project `eijggddzbwjtmpifoalj`): e-mail and password, sign-in links, Google, Microsoft and passkeys (Facebook appears once it is switched on in Supabase), password reset, address change and account deletion. Cloudflare Turnstile guards sign-up, sign-in, links, resets and passkey sign-in; Supabase verifies every token itself (Attack Protection → CAPTCHA), so there is no secret on our side. The pieces:

- `lib/supabase/` — the browser, server and admin (secret-key, server-only) clients, and the session refresh the root `proxy.ts` runs on the account pages only, so the marketing site stays static.
- `lib/auth/` — where auth sends people (`redirect.ts`, with `safeNext` against open redirects), Polish error messages, the provider switchboard read from Supabase, passkey helpers, the Google flow on our own domain (`google.ts`, so Google's screen names Examax rather than supabase.co; on with `GOOGLE_SIGN_IN_VIA_SITE=true`), and the server actions.
- `app/login`, `app/signup` — the forms; `app/auth/callback` (OAuth and PKCE codes), `app/auth/google` (the Google flow), `app/auth/confirm` (every e-mail link: it confirms by itself on open, then lands with a toast), `app/verify` (expired links, resend, the halfway point of an address change), `app/reset-password`, `app/account-deleted` (a session whose account is gone), and `app/welcome`, the temporary signed-in page with the account settings and passkeys.
- `supabase/templates/` — the auth e-mails, pasted into the Supabase dashboard (its README lists the subjects). The logo is served from Supabase Storage (bucket `email`).
- `components/dev/` — the Examax dev panel, localhost only: the corner button opens every auth screen, dialog, e-mail and message, rendered from the real components in a preview mode that sends nothing. Production builds do not contain it.

Passkeys belong to `examax.app` (Supabase's relying party), so they can be added and used there only; on localhost the prompt is refused and the forms say so.

Copy `.env.example` to `.env.local` for the variable names; `.env.local` is gitignored, like every `.env*` file except the example — never commit real values. Without the Supabase variables the marketing site still builds and runs; the account pages need them.

Content (the changelog at `/updates`, to start) comes from [Sanity](https://www.sanity.io), project `64k3ozib`, dataset `production`. The Studio is a separate repo, [Examax-App/Examax---CMS](https://github.com/Examax-App/Examax---CMS), checked out at `~/Developer/Other/studio-examax` (`npm run dev` there, http://localhost:3333), and is hosted at [examax.sanity.studio](https://examax.sanity.studio). Its README explains how posts are written and how they reach the site. The app reads it through `lib/sanity`: `sanityFetch` and `<SanityLive />` from `lib/sanity/live.ts` for live content, `urlFor` for images. After changing the schema or a GROQ query, run `npm run typegen` in the Studio to regenerate `sanity.types.ts`. It reads `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET` (public; they fall back to `64k3ozib` / `production`, so CI and preview builds work without them) and `SANITY_API_READ_TOKEN` (a viewer token, server-only, never sent to the browser).

For AI coding agents, `.mcp.json` registers the Supabase MCP server (run `/mcp` in Claude Code and authenticate), and `.claude/skills/` holds Supabase's agent skills.

## Getting started

Requirements: Node.js 20.9 or newer (22 recommended, see `.nvmrc`) and [pnpm](https://pnpm.io) 11.

```bash
pnpm install
pnpm dev          # http://localhost:3000
```

## Scripts

| Script | What it does |
| --- | --- |
| `pnpm dev` | Development server with hot reload |
| `pnpm build` | Production build |
| `pnpm start` | Serve the production build |
| `pnpm lint` / `pnpm lint:fix` | ESLint (Next.js rules) |
| `pnpm typecheck` | TypeScript, no emit |
| `pnpm check` | Typecheck, lint and build — run before every push |
| `pnpm audit:prod` | Audit production dependencies for known vulnerabilities |
| `pnpm film:studio` | Open Remotion Studio for the launch film |
| `pnpm film:audio` | Synthesise the film's soundtrack (Python 3 with numpy and scipy) |
| `pnpm film:render` | Render the launch film to `public/about/examax-film.mp4` |
| `pnpm film:poster` | Render the film's poster frame |

## Project structure

```
app/           Routes (App Router). One folder per page; robots.ts and sitemap.ts
components/    UI, by area: layout, sections, ui, and one folder per page or product
lib/           Shared data and helpers — pricing, routes, hooks
public/        Static assets: brand marks, mockup photos, the launch film
remotion/      Remotion entry and audio tooling for the launch film
DesignRules/   Design references and DESIGN.md — the source of truth for visuals
```

Product behaviour and decisions are documented in [`PRODUCT.md`](PRODUCT.md); development rules for contributors and AI agents in [`CLAUDE.md`](CLAUDE.md) and [`AGENTS.md`](AGENTS.md).

## Security

Every response carries a strict Content Security Policy and the standard security headers (`next.config.ts`). The site is static apart from the RSS feed and one API route, `POST /api/contact`, which forwards the contact forms to the team's inboxes through Resend; it accepts same-origin requests only and is rate-limited, size-limited and validated (see the comment at the top of `app/api/contact/route.ts`). The server-side secrets — the Resend key, the Sanity read token, the Supabase secret key and the Google client secret — are read from the environment and never sent to the browser; the Supabase admin client is marked `server-only`, so the build fails if client code imports it. Nothing loads from third-party origins except Sanity (its image CDN and the project's API), Supabase (the auth forms' API calls) and Cloudflare Turnstile (its script and challenge frame). Account pages are behind the session check in `proxy.ts` and verify the user again on the server; the dashboard is not part of the public build.

Found a vulnerability? Please report it privately — see [`SECURITY.md`](SECURITY.md).

## Deployment

The site is built for [Vercel](https://vercel.com): import the repository and deploy. Set the Sanity variables there too (the token is optional while the site shows only published content). Add every variable from `.env.example` under Project → Settings → Environment Variables (secrets server-only, never `NEXT_PUBLIC_`), and keep Supabase's Site URL (`https://examax.app`) and Redirect URLs (Authentication → URL Configuration) in step with the domains the app is served from. Any host that runs `pnpm build && pnpm start` on Node 20.9+ works too.

## License

Proprietary. © Examax. All rights reserved — this code may not be copied, modified or distributed without permission.
