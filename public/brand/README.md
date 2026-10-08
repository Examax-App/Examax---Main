# Brand assets

In-app imagery, plus the master of the favicon set. The set itself sits at the
root of `public/` and is declared in `app/layout.tsx` (`icons`, `manifest`).

## Favicon and app icons

`examax-logo-source.svg` is the original logo (508×512, rounded black square,
three white slabs). Every icon below is rendered from its three paths, with the
square widened to 512×512 and the slabs shifted 1.84px right to stay centred —
Google Search rejects favicons that are not exactly square.

| File | Shape | Used by |
| --- | --- | --- |
| `favicon.svg` | Rounded square, vector | Browsers and Google Search (`rel="icon"`) |
| `web-app-manifest-192x192.png` | Rounded square | Google Search and Safari (`rel="icon"`), the manifest (`any`) |
| `web-app-manifest-512x512.png` | Rounded square | The manifest (`any`), the Organization logo in `lib/seo.ts` |
| `favicon.ico` | Rounded square, 16/32/48px | Clients that request `/favicon.ico` by name; not declared |
| `favicon-96x96.png` | Rounded square | No longer declared; kept so the URL Google cached keeps resolving |
| `apple-touch-icon.png` | Full-bleed square, 180px | iOS home screen (iOS rounds the corners itself) |
| `maskable-icon-*.png` | Full-bleed square | The manifest (`maskable`); the slabs sit inside the 80% safe zone |

The PNGs are rendered with sharp (librsvg) at 4× and downsampled with Lanczos.
After regenerating, bump the `?v=` in `app/layout.tsx`.

## In-app imagery

| File | Role |
| --- | --- |
| `agent-icon.png` | The agent mark the UI renders, via `components/ui/AgentIcon.tsx`. |
| `agent-icon-source.png` | The Figma export it is derived from. Not referenced by any code. |
| `agent-icon-source.svg` | Same artwork exported as SVG. Not a vector — it wraps a base64 PNG — so it is kept for reference only. |
| `exam-e8.png` | The Egzamin Ósmoklasisty mark, via `components/ui/E8Icon.tsx`. |
| `exam-e8-source.png` | The 1536x1024 original it is derived from. Not referenced by any code. |
| `exam-matura.png` | The Matura mark, via `components/ui/MaturaIcon.tsx`. |
| `exam-matura-source.png` | The 1536x1024 original it is derived from. Not referenced by any code. |
| `exam-cke.png` | The Centralna Komisja Egzaminacyjna mark (yellow block, white "CKE"), via `components/ui/CkeIcon.tsx`. |
| `exam-cke-source.png` | The 512x705 original from cke.gov.pl (`logo-cke-strona.png`). Not referenced by any code. |

`agent-icon.png`, `exam-e8.png`, `exam-matura.png` and `exam-cke.png` are all **derived**:
cropped to the artwork's alpha bounds, so the mark fills its box instead of
sitting in dead space, then resampled to 256px wide — they render at roughly
24px and their masters run to over 1 MB each. Replacing a source alone will
not change anything on screen; the crop and resample have to be re-run
against it.
