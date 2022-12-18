import { By, Key, promise, until, WebDriver } from "selenium-webdriver";
import { AuthData } from "@stocks_exchange/server/dist/api";
import { authenticate } from "./index";

// Обновление баланса брокера (требует загруженной страницы брокеров)
export async function setBrokerBalance(
  driver: WebDriver,
  broker: string,
  balance: number
) {
  // Ждём появления карточки брокера
  await driver.wait(until.elementLocated(By.id(`updateBtn${broker}`)), 5000);
  // Заходим в настройки выбранного брокера
  await driver.findElement(By.id(`updateBtn${broker}`)).click();
  // Ждём пока откроется окно редактирования
  await promise.delayed(1000);
  // Выдаём заданному брокеру заданый баланс
  const balanceInput = await driver.findElement(By.id(`brokerModalBalance`));
  await balanceInput.click();
  await balanceInput.sendKeys(Key.CONTROL + "a");
  await balanceInput.sendKeys(Key.DELETE);
  await balanceInput.sendKeys(balance.toString());
  await driver.findElement(By.id(`modalSubmitBtn`)).click();
}

// Выбор всех акций (требует загруженной страницы акций)
export async function selectAllStocks(driver: WebDriver) {
  let offcanvas = false;
  // В случае если экран меньше lg
  try {
    // Ждём загрузки страницы
    await driver.wait(until.elementLocated(By.id("offCanvasButton")), 5000);
    // Открываем вкладку с акциями
    await driver.findElement(By.id("offCanvasButton")).click();
    offcanvas = true;
    // Ждём пока откроются акции
    await promise.delayed(1000);
  } catch (err) {
    console.log("no offcanvas");
  }
  // Находим чекбоксы
  const inputs = await driver.findElements(By.css("input"));
  // Нажимаем все нажимаемые и неактивные чекбоксы (выбор всех акций)
  await Promise.all(
    inputs.map(async (i) => {
      try {
        return (await i.isSelected()) || (await i.click());
      } catch (err) {
        console.log(`${i} checkbox unselected`);
      }
    })
  );
  if (offcanvas)
    await driver.findElement(By.id("stocksOffCanvasDismiss")).click();
}

// Тестирование админа: установка баланса выбранному брокеру, выбор всех акций и старт торгов
export async function adminAction(
  driver: WebDriver,
  ad: AuthData,
  broker: string,
  balance: number
) {
  try {
    // Заходим на сайт
    await driver.get("http://localhost:8080");
    // Ждём прогрузки
    await driver.wait(until.elementsLocated(By.css("input")), 5000);
    // Входим в систему
    await authenticate(driver, ad);
    // Ждём загрузки страницы брокеров
    await driver.wait(until.urlMatches(/brokers/), 5000);
    // Устанавливаем брокеру баланс
    await setBrokerBalance(driver, broker, balance);
    // Переходим на страницу акций
    await driver.findElement(By.linkText("Акции")).click();
    // Активируем все акции
    await selectAllStocks(driver);
    // Заходим на страницу торгов
    await driver.findElement(By.linkText("Торги")).click();
    await driver.wait(until.elementLocated(By.id("tradesSwitcher")), 5000);
    const tradesSwitcher = await driver.findElement(By.id("tradesSwitcher"));
    // Запускаем торги если они не запущены
    if (!(await tradesSwitcher.isSelected())) await tradesSwitcher.click();
    await promise.delayed(1000);
    // Выходим из системы
    await driver.findElement(By.id("logoutBtn")).click();
    return true;
  } catch (err) {
    console.log("Error during admin test: ", err);
  }
  return false;
}
