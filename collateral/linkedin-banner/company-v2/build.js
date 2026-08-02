const fs = require("fs");
const path = require("path");
const SITE = "/home/user/Website";
const OUT = __dirname;

const fontB64 = (f) =>
  fs.readFileSync(path.join(SITE, "app/fonts", f)).toString("base64");

// Lockup: strip the outer <svg> wrapper, keep the artwork paths
const lockupSrc = fs.readFileSync(
  path.join(SITE, "public/brand/tacedge-lockup-cream.svg"),
  "utf8"
);
const lockupInner = lockupSrc
  .replace(/^[\s\S]*?<svg[^>]*>/, "")
  .replace(/<\/svg>\s*$/, "");

// Topographic contours from the site motif
const contourSrc = fs.readFileSync(
  path.join(SITE, "components/contour-paths.ts"),
  "utf8"
);
const paths = [...contourSrc.matchAll(/"(M[^"]+)"/g)].map((m) => m[1]);

// Layout constants — LinkedIn company cover, 1128x191 logical
const W = 1128, H = 191;
const LOCKUP_W = 230;                      // ~23% smaller than the 300px current banner
const LOCKUP_H = LOCKUP_W * (391 / 1978);  // preserve lockup aspect (≈45.5)
const LOCKUP_X = (W - LOCKUP_W) / 2;
const LOCKUP_Y = 24;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="TACEDGE — Shared Clarity for Ground Engineering Delivery">
  <defs>
    <style>
      @font-face { font-family: "Play"; font-weight: 700; src: url(data:font/woff2;base64,${fontB64("play-700.woff2")}) format("woff2"); }
      @font-face { font-family: "Be Vietnam Pro"; font-weight: 400; src: url(data:font/woff2;base64,${fontB64("be-vietnam-pro-400.woff2")}) format("woff2"); }
    </style>
  </defs>

  <!-- Ground -->
  <rect width="${W}" height="${H}" fill="#112411"/>

  <!-- Topographic texture, very understated -->
  <svg viewBox="0 0 1600 500" preserveAspectRatio="xMidYMid slice" x="0" y="0" width="${W}" height="${H}">
    <g fill="none" stroke="#F7F5EC" stroke-opacity="0.07" stroke-width="1.1">
      ${paths.map((d) => `<path d="${d}"/>`).join("\n      ")}
    </g>
  </svg>

  <!-- TACEDGE lockup, top centre -->
  <svg x="${LOCKUP_X}" y="${LOCKUP_Y}" width="${LOCKUP_W}" height="${LOCKUP_H}" viewBox="0 0 1978 391">
    ${lockupInner}
  </svg>

  <!-- Headline -->
  <text x="${W / 2}" y="124" text-anchor="middle" font-family="Play" font-weight="700" font-size="44" letter-spacing="0.5" fill="#F7F5EC">Shared Clarity</text>

  <!-- Supporting line -->
  <text x="${W / 2}" y="158" text-anchor="middle" font-family="Be Vietnam Pro" font-weight="400" font-size="17" letter-spacing="0.3" fill="#B2B594">for Ground Engineering Delivery</text>
</svg>
`;
fs.writeFileSync(path.join(OUT, "tacedge-linkedin-banner.svg"), svg);

// Preview page — full size and mobile-style width
const preview = `<!doctype html><html><head><meta charset="utf-8"><title>TACEDGE LinkedIn banner preview</title><style>
body{margin:0;padding:40px;background:#e9e9e2;font-family:system-ui,sans-serif;color:#333}
h2{font-size:14px;font-weight:600;margin:28px 0 10px}
img{display:block;max-width:100%;border:1px solid #ccc}
.full img{width:1128px}
.mobile img{width:420px}
</style></head><body>
<div class="full"><h2>Full size — 1128 × 191</h2><img src="tacedge-linkedin-banner.svg" alt="TACEDGE banner at full size"></div>
<div class="mobile"><h2>Mobile-style width — 420px</h2><img src="tacedge-linkedin-banner.svg" alt="TACEDGE banner at mobile width"></div>
</body></html>`;
fs.writeFileSync(path.join(OUT, "tacedge-linkedin-banner-preview.html"), preview);
console.log("built svg + preview; lockup", LOCKUP_W, "x", LOCKUP_H.toFixed(1), "at x", LOCKUP_X);
