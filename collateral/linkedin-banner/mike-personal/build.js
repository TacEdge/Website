const fs = require("fs");
const path = require("path");
const SITE = "/home/user/Website";
const OUT = __dirname;

// Brandmark only — no wordmark. Source viewBox "28 35 350 322".
const markSrc = fs.readFileSync(
  path.join(SITE, "public/brand/tacedge-brandmark-sage.svg"),
  "utf8"
);
const markInner = markSrc
  .replace(/^[\s\S]*?<svg[^>]*>/, "")
  .replace(/<\/svg>\s*$/, "");

const contourSrc = fs.readFileSync(
  path.join(SITE, "components/contour-paths.ts"),
  "utf8"
);
const paths = [...contourSrc.matchAll(/"(M[^"]+)"/g)].map((m) => m[1]);

// LinkedIn personal profile banner: 1584x396 (4:1)
const W = 1584, H = 396;
const MARK_W = 96;
const MARK_H = MARK_W * (322 / 350); // ≈ 88.3, preserve aspect
const MARK_INSET = 120;              // clear of LinkedIn's right-edge crop
const MARK_X = W - MARK_W - MARK_INSET;
const MARK_Y = (H - MARK_H) / 2;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="">
  <!-- Ground -->
  <rect width="${W}" height="${H}" fill="#112411"/>

  <!-- Topographic texture, low contrast -->
  <svg viewBox="0 0 1600 500" preserveAspectRatio="xMidYMid slice" x="0" y="0" width="${W}" height="${H}">
    <g fill="none" stroke="#F7F5EC" stroke-opacity="0.07" stroke-width="1.3">
      ${paths.map((d) => `<path d="${d}"/>`).join("\n      ")}
    </g>
  </svg>

  <!-- Small TACEDGE brand mark, right side, vertically centred -->
  <svg x="${MARK_X}" y="${MARK_Y.toFixed(1)}" width="${MARK_W}" height="${MARK_H.toFixed(1)}" viewBox="28 35 350 322">
    ${markInner}
  </svg>
</svg>
`;
fs.writeFileSync(path.join(OUT, "mike-linkedin-banner.svg"), svg);

const preview = `<!doctype html><html><head><meta charset="utf-8"><title>Mike Coom LinkedIn banner preview</title><style>
body{margin:0;padding:40px;background:#e9e9e2;font-family:system-ui,sans-serif;color:#333}
h2{font-size:14px;font-weight:600;margin:28px 0 10px}
img{display:block;max-width:100%;border:1px solid #ccc}
.full img{width:1584px}
.mobile img{width:420px}
</style></head><body>
<div class="full"><h2>Desktop — 1584 × 396</h2><img src="mike-linkedin-banner.svg" alt=""></div>
<div class="mobile"><h2>Mobile-style crop width — 420px</h2><img src="mike-linkedin-banner.svg" alt=""></div>
</body></html>`;
fs.writeFileSync(path.join(OUT, "mike-linkedin-banner-preview.html"), preview);
console.log("built; mark", MARK_W, "x", MARK_H.toFixed(1), "at", MARK_X, MARK_Y.toFixed(1));
