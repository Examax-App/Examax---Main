# Examax

The Examax marketing site — a Next.js 16 (App Router) app styled with Tailwind CSS v4.

## Getting Started

This project uses **pnpm**. Install it once with `brew install pnpm` (or `corepack enable pnpm`), then:

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the site. The page auto-updates as you edit.

### Scripts

| Command          | What it does                              |
| ---------------- | ----------------------------------------- |
| `pnpm dev`       | Start the dev server (Turbopack)          |
| `pnpm build`     | Production build                          |
| `pnpm start`     | Serve the production build                |
| `pnpm lint`      | ESLint                                    |
| `pnpm typecheck` | `tsc --noEmit`                            |

## Project structure

```
app/          Routes — root layout, landing page, global styles, icon
components/
  layout/     Navbar, Footer
  sections/   Landing-page sections (Hero, Pricing, Faq, …)
  mockups/    Product UI mockups rendered inside feature sections
  ui/         Primitives (Button, Container, Logo, Reveal, …)
lib/          cn() class helper and shared React hooks
fonts/        Self-hosted Satoshi woff2 files (loaded via next/font/local)
```

`@/*` is aliased to the repo root, so imports look like `@/components/ui/Button`.

## Design system

Design tokens (colors, type scale, radii, shadows) live in the `@theme` block of
`app/globals.css` and are consumed as Tailwind utilities — e.g. `text-charcoal`,
`rounded-cards`, `shadow-subtle`, `text-heading-lg`.

Typography: **Satoshi** (display, local) with **Inter** and **Geist Mono** from
`next/font/google`.

## Deploy

Deploy on [Vercel](https://vercel.com/new). See the
[Next.js deployment docs](https://nextjs.org/docs/app/getting-started/deploying) for details.
