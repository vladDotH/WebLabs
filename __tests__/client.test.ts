import { describe, expect, test } from "@jest/globals";
import { Browser, Builder } from "selenium-webdriver";
import { adminAction, buyStocks } from "../e2e";
import { AuthData } from "@stocks_exchange/server/dist/api";

const admin: AuthData = { login: "admin", password: "admin" },
  targetBroker = "vladDotH",
  balance = 10_000,
  broker: AuthData = { login: "vladDotH", password: "vladik" },
  targetStock = "TSLA",
  amount = 5,
  delay = 5000;

jest.setTimeout(60000);

describe("Тестирование клиента", () => {
  test(`Действия администратора ${admin.login}: дать брокеру ${targetBroker} ${balance}$, активировать все акции и запустить торги`, async () => {
    const driver = await new Builder().forBrowser(Browser.CHROME).build();
    const res = await adminAction(
      driver,
      { login: "admin", password: "admin" },
      "vladDotH",
      10000
    );
    await driver.quit();
    expect(res).toBe(true);
  });

  test(`Действия брокера ${broker.login}: купить ${amount} акций ${targetStock} и ждать ${delay}мс.`, async () => {
    const driver = await new Builder().forBrowser(Browser.CHROME).build();
    const res = await buyStocks(driver, broker, targetStock, amount, delay);
    await driver.quit();
    expect(res?.profit).toBeCloseTo(
      (res.endCost - res.startCost) * res.amount,
      0.5
    );
  });
});
