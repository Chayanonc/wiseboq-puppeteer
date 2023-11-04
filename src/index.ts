import puppeteer, { PuppeteerLaunchOptions } from "puppeteer";
import { mainGlobal } from "./services/globalhouse.service";
import * as dotenv from "dotenv";

import express from "express";
import path from "path";
import { appDataSource } from "./configs/database";
import { DataSource } from "typeorm";
import { Products } from "./entities/items.entity";
dotenv.config();

const PORT = process.env.PORT || 4004;
const app = express();
appDataSource
  .initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((err) => {
    console.log(err);
  });

app.get("/health", (req, res) => {
  res.send("ok");
});

app.get("/check-puppeteer", async (req, res) => {
  const puppeteerConfig: PuppeteerLaunchOptions = {
    // executablePath: "/usr/bin/google-chrome",
    // executablePath: "/usr/bin/chromium",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    headless: false,
    slowMo: 40,
  };
  const browser = await puppeteer.launch(puppeteerConfig);
  try {
    const page = await browser.newPage();
    const time = new Date().getTime();
    const imgPath = path.join(__dirname, `images/${time}.png`);
    await page.goto("https://globalhouse.co.th/category/321");

    await page.waitForSelector(
      "#__next > main > div > section > div.flex.items-start.justify-center.w-full > div.jsx-634a7a5a66127520.w-full.md\\:w-4\\/5 > div.w-full > div > h2",
      {
        timeout: 5000,
      }
    );

    const text = await page.$eval(
      "#__next > main > div > section > div.flex.items-start.justify-center.w-full > div.jsx-634a7a5a66127520.w-full.md\\:w-4\\/5 > div.w-full > div > h2",
      (el) => {
        return el.textContent;
      }
    );

    await browser.close();
    res.send(text.includes("ค้นหาไม่พบ"));

    //document.querySelector("#__next > main > div > section > div.flex.items-start.justify-center.w-full > div.jsx-634a7a5a66127520.w-full.md\\:w-4\\/5 > div.w-full > div > h2")
  } catch (error) {
    console.log(error);
    await browser.close()
    res.send(error);
  }
});

app.get("/global", async (req, res) => {
  try {
    await main();
    res.send({
      success: true,
    });
  } catch (error) {
    res.send({
      success: false,
    });
  }
});

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});

const main = async () => {
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
};
