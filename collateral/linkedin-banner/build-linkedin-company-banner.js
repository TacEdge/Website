const fs = require("fs");
const path = require("path");

const SITE = "/home/user/Website";
const fontB64 = (f) =>
  fs.readFileSync(path.join(SITE, "app/fonts", f)).toString("base64");
const lockup = fs
  .readFileSync(path.join(SITE, "public/brand/tacedge-lockup-cream.svg"), "utf8")
  .replace(/<svg /, '<svg class="lockup" ');

const contourSrc = fs.readFileSync(
  path.join(SITE, "components/contour-paths.ts"),
  "utf8"
);
const paths = [...contourSrc.matchAll(/"(M[^"]+)"/g)].map((m) => m[1]);
const contourSvg = `<svg class="contour" viewBox="0 0 1600 500" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${paths
  .map((d) => `<path d="${d}" />`)
  .join("")}</svg>`;

// LinkedIn company-page cover: 1128x191 logical (≈5.9:1), rendered @2x.
const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:Play;font-weight:700;src:url(data:font/woff2;base64,${fontB64(
  "play-700.woff2"
)}) format("woff2")}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1128px;height:191px}
.banner{position:relative;width:1128px;height:191px;background:#112411;overflow:hidden;
  display:flex;align-items:center;justify-content:center}
.contour{position:absolute;inset:0;width:100%;height:100%;z-index:0}
.contour path{fill:none;stroke:rgba(247,245,236,.08);stroke-width:1.1}
.block{position:relative;z-index:1;display:flex;flex-direction:column;align-items:center;
  gap:15px;transform:translateX(70px)}
.lockup{width:300px;height:auto;display:block}
.tag{font-family:Play;font-weight:700;font-size:29px;letter-spacing:.01em;color:#F7F5EC}
</style></head><body>
<div class="banner">
  ${contourSvg}
  <div class="block">
    ${lockup}
    <div class="tag">Shared Clarity.</div>
  </div>
</div>
</body></html>`;
fs.writeFileSync(path.join(__dirname, "linkedin-company-banner.html"), html);
console.log("built");
