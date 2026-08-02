const { chromium } = require("/home/user/Website/node_modules/playwright-core");
(async () => {
  const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  for (const [file, dsf] of [
    ["tacedge-linkedin-banner-b.png", 1],
    ["tacedge-linkedin-banner-b-2x.png", 2],
  ]) {
    const page = await browser.newPage({
      viewport: { width: 1128, height: 191 },
      deviceScaleFactor: dsf,
    });
    await page.goto("file://" + __dirname + "/tacedge-linkedin-banner-b.svg", { waitUntil: "networkidle" });
    await page.waitForTimeout(400);
    await page.screenshot({ path: __dirname + "/" + file });
    await page.close();
  }
  await browser.close();
  console.log("rendered");
})();
