import { By, promise, until, WebDriver } from "selenium-webdriver";
import { authenticate } from "./index";
import { AuthData } from "@stocks_exchange/server/dist/api";

export interface BrokerTestData {
  startBalance: number;
  endBalance: number;
  amount: number;
  startCost: number;
  endCost: number;
  profit: number;
}

// Тестирование брокера: покупка акций
export async function buyStocks(
  driver: WebDriver,
  ad: AuthData,
  stock: string,
  amount: number,
  delay = 5000
): Promise<BrokerTestData | undefined> {
  try {
    await driver.get("http://localhost:8080");
    await driver.wait(until.elementsLocated(By.css("input")), 5000);
    // Входим в систему
    await authenticate(driver, ad);
    // Ждём появления заданной акции
    await driver.wait(until.elementsLocated(By.id(`amountOf${stock}`)), 5000);
    // Читаем начальный баланс и начальную стоимость акции
    const startBalance = await driver
        .findElement(By.id("brokerBalance"))
        .getText(),
      startCost = await driver.findElement(By.id(`costOf${stock}`)).getText();

    const input = await driver.findElement(By.id(`amountOf${stock}`));
    await input.click();
    // Покупаем заданное количество акций
    await input.sendKeys(amount.toString());
    const submit = await driver.findElement(By.id(`submitTo${stock}`));
    await submit.click();
    // Ждём заданное время
    await promise.delayed(delay);
    // Получаем количество, стоимость, доход выбранной акции и итоговый баланс
    const profit = await driver
        .findElement(By.id(`profitOf${stock}`))
        .getText(),
      endCost = await driver.findElement(By.id(`costOf${stock}`)).getText(),
      count = await driver.findElement(By.id(`countOf${stock}`)).getText(),
      endBalance = await driver.findElement(By.id("brokerBalance")).getText();

    return {
      startBalance: parseFloat(startBalance.split(" ")[1].split("$")[0]),
      endBalance: parseFloat(endBalance.split(" ")[1].split("$")[0]),
      startCost: parseFloat(startCost.split("$")[0]),
      endCost: parseFloat(endCost.split("$")[0]),
      amount: parseInt(count),
      profit: parseFloat(profit.split("$")[0].split(" ").join("")),
    };
  } catch (err) {
    console.log("Error during broker test");
  }
  return undefined;
}
