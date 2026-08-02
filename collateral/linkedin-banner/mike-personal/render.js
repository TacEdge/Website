const { chromium } = require("/home/user/Website/node_modules/playwright-core");
(async () => {
  const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  for (const [file, dsf] of [
    ["mike-linkedin-banner.png", 1],
    ["mike-linkedin-banner-2x.png", 2],
  ]) {
    const page = await browser.newPage({
      viewport: { width: 1584, height: 396 },
      deviceScaleFactor: dsf,
    });
    await page.goto("file://" + __dirname + "/mike-linkedin-banner.svg", { waitUntil: "networkidle" });
    await page.waitForTimeout(300);
    await page.screenshot({ path: __dirname + "/" + file });
    await page.close();
  }
  await browser.close();
  console.log("rendered");
})();
