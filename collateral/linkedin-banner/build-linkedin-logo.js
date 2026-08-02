const fs = require("fs");
const path = require("path");
const SITE = "/home/user/Website";
const mark = fs
  .readFileSync(path.join(SITE, "public/brand/tacedge-brandmark-sage.svg"), "utf8")
  .replace(/<svg /, '<svg class="mark" ');

// 400x400 logical, rendered @2x -> 800x800. Forest ground, brandmark centred
// with breathing room so LinkedIn's rounded-corner mask never clips it.
const html = `<!doctype html><html><head><meta charset="utf-8"><style>
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:400px;height:400px}
.tile{width:400px;height:400px;background:#112411;display:flex;align-items:center;justify-content:center}
.mark{width:264px;height:auto;display:block}
</style></head><body><div class="tile">${mark}</div></body></html>`;
fs.writeFileSync(path.join(__dirname, "linkedin-logo.html"), html);
console.log("built");
