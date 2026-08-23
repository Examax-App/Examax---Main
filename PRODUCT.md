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
app/               App Router root — layout, landing page, global styles, icons
  contact/ help/   Marketing pages
  login/ signup/   Auth screens
  start/           Onboarding
  components/      Component gallery (dev reference)
  dashboard/       The product area — everything under /dashboard
    (main)/        Tasks, subjects, analytics, activity, results, folders,
                   labels, templates
    (settings)/    Account and settings screens
components/
  layout/          Navbar, Footer
  sections/        Landing-page sections (Hero, Pricing, Faq, …)
  mockups/         Product UI mockups rendered inside feature sections
  app/             Product-area shell (sidebar, rail, modals)
  ui/              Primitives (Button, Container, Logo, Reveal, …)
lib/               cn() helper, shared hooks, nav config, type ramps
fonts/             Self-hosted Satoshi woff2 files (via next/font/local)
public/            Static assets served from the site root
  favicon.ico      Legacy favicon (browsers request /favicon.ico directly)
  icons/           icon.svg, icon-96/192/512.png, apple-touch-icon.png
  manifest.webmanifest
```

Icons live in `public/` rather than as `app/` file conventions, so they are
declared explicitly in `metadata.icons` in `app/layout.tsx`. Adding or renaming
an icon means editing that list too — the file-based convention would sync
automatically, but keeps the assets scattered across `app/`.

Routes, folders and identifiers are English throughout; only user-facing copy
is Polish. The product area lives at `app/dashboard/` rather than `app/app/` —
the latter is valid App Router structure but reads as a duplicated folder.

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
