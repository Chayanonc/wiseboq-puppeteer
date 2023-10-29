import puppeteer, { PuppeteerLaunchOptions } from "puppeteer";
import { mainGlobal } from "./services/globalhouse.service";
import * as dotenv from "dotenv";

(async () => {
  dotenv.config();
  // Launch the browser and open a new blank page
  const puppeteerConfig: PuppeteerLaunchOptions = {
    // executablePath: "/usr/bin/google-chrome",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    headless: "new",
    slowMo: 40,
  };
  const browser = await puppeteer.launch(puppeteerConfig);

  await mainGlobal(browser);

  await browser.close();
})();
