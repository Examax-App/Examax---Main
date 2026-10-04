# Pending design changes

Agreed directions not yet implemented. Read this before touching the surfaces
below, and delete an entry once it has shipped.

---

## Landing · all four feature quotes (on hold until real testimonials)

Removed 2026-09-26: we have no official testimonials yet. When there is a real,
approved quote, put each band back in `app/page.tsx`:

```tsx
{/* after the #practice FeatureSection, before #roadmap */}
<Testimonial {...PLACEHOLDER_QUOTES.practice} />

{/* after the #roadmap FeatureSection, before #progress */}
<Testimonial {...PLACEHOLDER_QUOTES.roadmap} />

{/* after the #progress FeatureSection, before #agent */}
<Testimonial {...PLACEHOLDER_QUOTES.progress} />

{/* after the #agent FeatureSection */}
<Testimonial {...PLACEHOLDER_QUOTES.agent} />
```

The landing page no longer imports `Testimonial` or `PLACEHOLDER_QUOTES`; add
the import back with the first quote you restore.

The component (`components/sections/Testimonial.tsx`) and all four entries in
`PLACEHOLDER_QUOTES` are unchanged. Swap the placeholder name, role and
quote for the real ones, rather than shipping the placeholder again.

No placeholder quote is live anywhere now. The /training one was removed
outright on 2026-09-30, the /roadmap one went with the page's rebuild on
2026-10-01, and the /simulation one (`<Testimonial {...PLACEHOLDER_QUOTES.practice}
layout="feature" />`) went with its rebuild on 2026-10-02. No restore is
planned on any of the three; a real quote would go where dub.co/solutions/creators
has its first one, between `SheetSection` and `ReportSection`.
