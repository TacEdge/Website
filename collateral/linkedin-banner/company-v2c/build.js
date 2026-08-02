const fs = require("fs");
const path = require("path");
const SITE = "/home/user/Website";
const OUT = __dirname;

const fontB64 = (f) =>
  fs.readFileSync(path.join(SITE, "app/fonts", f)).toString("base64");
const lockupInner = fs
  .readFileSync(path.join(SITE, "public/brand/tacedge-lockup-cream.svg"), "utf8")
  .replace(/^[\s\S]*?<svg[^>]*>/, "")
  .replace(/<\/svg>\s*$/, "");
const contourSrc = fs.readFileSync(
  path.join(SITE, "components/contour-paths.ts"),
  "utf8"
);
const paths = [...contourSrc.matchAll(/"(M[^"]+)"/g)].map((m) => m[1]);

// LinkedIn company cover 1128x191. Option C: the lockup is the hero;
// the message sits beneath, clearly subordinate in size.
const W = 1128, H = 191;
const LOCKUP_W = 400;
const LOCKUP_H = LOCKUP_W * (391 / 1978); // ≈ 79.1
const LOCKUP_X = (W - LOCKUP_W) / 2;
const LOCKUP_Y = 26;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="TACEDGE — Shared Clarity for Ground Engineering Delivery">
  <defs>
    <style>
      @font-face { font-family: "Play"; font-weight: 700; src: url(data:font/woff2;base64,${fontB64("play-700.woff2")}) format("woff2"); }
      @font-face { font-family: "Be Vietnam Pro"; font-weight: 400; src: url(data:font/woff2;base64,${fontB64("be-vietnam-pro-400.woff2")}) format("woff2"); }
    </style>
  </defs>

  <rect width="${W}" height="${H}" fill="#112411"/>

  <svg viewBox="0 0 1600 500" preserveAspectRatio="xMidYMid slice" x="0" y="0" width="${W}" height="${H}">
    <g fill="none" stroke="#F7F5EC" stroke-opacity="0.07" stroke-width="1.1">
      ${paths.map((d) => `<path d="${d}"/>`).join("\n      ")}
    </g>
  </svg>

  <!-- Hero lockup -->
  <svg x="${LOCKUP_X}" y="${LOCKUP_Y}" width="${LOCKUP_W}" height="${LOCKUP_H.toFixed(1)}" viewBox="0 0 1978 391">
    ${lockupInner}
  </svg>

  <!-- Subordinate message -->
  <text x="${W / 2}" y="139" text-anchor="middle" font-family="Play" font-weight="700" font-size="24" letter-spacing="0.5" fill="#F7F5EC">Shared Clarity</text>
  <text x="${W / 2}" y="165" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="400" font-size="14" letter-spacing="0.3" fill="#B2B594">for Ground Engineering Delivery</text>
</svg>
`;
fs.writeFileSync(path.join(OUT, "tacedge-linkedin-banner-c.svg"), svg);

const preview = `<!doctype html><html><head><meta charset="utf-8"><title>TACEDGE banner — option C preview</title><style>
body{margin:0;padding:40px;background:#e9e9e2;font-family:system-ui,sans-serif;color:#333}
h2{font-size:14px;font-weight:600;margin:28px 0 10px}
img{display:block;max-width:100%;border:1px solid #ccc}
.full img{width:1128px}
.mobile img{width:420px}
</style></head><body>
<div class="full"><h2>Full size — 1128 × 191</h2><img src="tacedge-linkedin-banner-c.svg" alt=""></div>
<div class="mobile"><h2>Mobile-style width — 420px</h2><img src="tacedge-linkedin-banner-c.svg" alt=""></div>
</body></html>`;
fs.writeFileSync(path.join(OUT, "tacedge-linkedin-banner-c-preview.html"), preview);
console.log("built");
