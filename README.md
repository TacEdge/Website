# TacEdge website

Five-page marketing site for TacEdge. Next.js, no backend.

## Run

```bash
npm install
npm run dev
```

## Where things live

- `content/` — all copy, in editable files. `home.ts` is the homepage copy, locked to the approved deck. `site.ts` is nav, CTA and footer.
- `app/globals.css` — the design tokens (colour, type, shape) from the product design system. Do not add colours.
- `app/styleguide` — internal style reference page (not linked from the site, not indexed).
- `public/brand/` — logo assets, SVG only.
- `components/` — header, footer, contour motif, shared pieces.

## Rules that bind this repo

See the master brief (homepage refinement revision). In short: primary CTA is
"arrange a demonstration" (secondary "see the workflow" scrolls to the spine),
the Configure · Capture · Confirm spine only (release is the outcome of
Confirm, never a fourth stage), no claims beyond drilling and anchoring in
production in New Zealand and Samoa, Rock Control namable as field partner
only, ochre/brick never decorative, NZ spelling, no em dashes.

Product imagery in `public/product/` is captured from the real Geotech V2
prototype (element screenshots at 2x, exported WebP). Third-party names in
the prototype's worked example are replaced with generic role labels
(Principal, Consulting engineer) before capture. Regenerate rather than
hand-edit these images.
