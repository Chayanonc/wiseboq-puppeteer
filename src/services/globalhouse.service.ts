import * as puppeteer from "puppeteer";
import { categoriesGlobal } from "../constants/globalhouse.constant";
import { v4 as uuidv4 } from "uuid";
import { appDataSource, clientPostgres } from "../configs/database";
import { Products } from "../entities/items.entity";

interface IItem {
  link: string;
  title: string;
  price: string;
  unit: string;
}

const mainGlobal = async (browser: puppeteer.Browser) => {
  // const client = clientPostgres();
  // await client.connect();
  let pageIndex = 1;
  const mainUrl = "https://globalhouse.co.th/category/";

  for (let i = 0; i < 10000; i++) {
    const url = mainUrl + i + 1;
    const mapArr: any[] = await Promise.all(
      categoriesGlobal[i].urls.map((url) => {
        return new Promise(async (resolve, reject) => {
          const page = await browser.newPage();
          let items: IItem[] = [];
          // Set screen size
          await page.setViewport({ width: 1080, height: 1024 });

          await page.goto(url);

          const max = await getPages(page);
          const contents = await contentGlobal(page);
          console.log("contents", contents.length);

          items = [...items, ...contents];

          if (max && max > 1) {
            for (let i = 1; i < max; i++) {
              await page.goto(url + `?page=${i + 1}`);
              const contents = await contentGlobal(page);
              items = [...items, ...contents];
              console.log(`contents page${i + 1}`, contents.length);
            }
          }

          console.log("item ====>", items[0]);

          resolve(items);
        });
      })
    );

    for (let i = 0; i < mapArr.length; i++) {
      const max: number = mapArr[i].length as number;
      console.log({ max });

      for (let j = 0; j < max; j++) {
        const item = mapArr[i][j];
        // console.log(`data map ${i+1} ==> `, mapArr[i].length);
        const product = new Products();
        product.name = item.title;
        product.url = item.link;
        product.price = item.price;
        product.unit = item.unit;

        await appDataSource.getRepository(Products).save(product);

        // const text = `INSERT INTO "Test_items" (name, url, price, unit) VALUES ($1, $2, $3, $4) RETURNING *`;
        // const values = [item.title, item.link, item.price, item.unit];
        // const res = await client.query(text, values);
        // console.log(res.rows[0]);
      }
    }
    // await client.end();
    console.log(mapArr.length);
  }
};

const getPages = async (page: puppeteer.Page) => {
  await page.waitForSelector("section>div:nth-child(2)>div:nth-child(2)>nav");
  const pagesEle = await page.$(
    "section>div:nth-child(2)>div:nth-child(2)>nav"
  );

  const pagesArr = await pagesEle?.$$eval("ul>li", (nodes) => {
    return nodes.map((n) => n.textContent);
  });

  const maxPage = pagesArr?.reduce((pre, cur) => {
    if (pre > (cur ? +cur : 0)) {
      return pre;
    }
    return cur ? +cur : 0;
  }, 0);

  return maxPage;
};

const contentGlobal = async (page: puppeteer.Page) => {
  await page.waitForSelector(
    "section>div:nth-child(2)>div:nth-child(2)>div:nth-child(2)"
  );
  const itemsEle = await page.$(
    "section>div:nth-child(2)>div:nth-child(2)>div:nth-child(2)"
  );

  const arr =
    (await itemsEle?.$$eval("article>div:nth-child(2)>div", (nodes) =>
      nodes.map((n) => {
        if (n) {
          const price = n?.querySelector(
            " div.flex.items-end.justify-end.mt-1 > div.flex.flex-col.items-baseline > div > div.flex.items-baseline.gap-1"
          )?.textContent;
          return {
            link: decodeURIComponent(n?.querySelector("a")?.href || ""),
            title: n?.querySelector("a>div")?.textContent,
            price: price?.split("/")[0],
            unit: price?.split("/")[1],
          };
        }
      })
    )) || [];

  return arr as IItem[];
};

export { mainGlobal };
