# Brand assets

In-app imagery. The favicon and PWA set lives elsewhere: the browser icons use
the app/ file conventions (`app/favicon.ico`, `app/icon0.svg`, `app/icon1.png`,
`app/apple-icon.png`), and the installable icons `manifest.webmanifest` points
at sit at the root of `public/` as `web-app-manifest-*.png`.

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
