# Examax

**Examax** to platforma do nauki na egzamin ósmoklasisty i maturę — oparta na oryginalnych arkuszach CKE, z roadmapą ułożoną pod termin egzaminu, symulacjami i Korepetytorem AI, który prowadzi krok po kroku zamiast podawać gotowe odpowiedzi.

This repository is the Examax website and front-end: the public marketing site at [examax.app](https://examax.app), the product pages, and the auth screens. The project is in **public preview** — the learning platform is not open yet (see [`PRODUCT.md`](PRODUCT.md)).

---

## Stack

- [Next.js 16](https://nextjs.org) (App Router, Turbopack) and React 19
- TypeScript, Tailwind CSS 4
- [Remotion](https://www.remotion.dev) for the product films, played in the page with `@remotion/player`
- Fonts self-hosted at build time (Satoshi, Inter, Geist Mono)

The backend will be [Supabase](https://supabase.com) (project `eijggddzbwjtmpifoalj`). It is connected but not used yet: no code calls it, so the site still builds and runs without any environment variables. Its keys go in `.env.local`, which is gitignored, like every `.env*` file; never commit real values.

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

Every response carries a strict Content Security Policy and the standard security headers (`next.config.ts`). The site is fully static apart from the RSS feed, has no API routes and no server-side secrets, and loads nothing from third-party origins. The dashboard is not part of the public build.

Found a vulnerability? Please report it privately — see [`SECURITY.md`](SECURITY.md).

## Deployment

The site is built for [Vercel](https://vercel.com): import the repository and deploy. Once code uses Supabase, add the variables from `.env.local` under Project → Settings → Environment Variables (the secret key server-only, never `NEXT_PUBLIC_`). Any host that runs `pnpm build && pnpm start` on Node 20.9+ works too.

## License

Proprietary. © Examax. All rights reserved — this code may not be copied, modified or distributed without permission.
