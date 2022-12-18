import { By, WebDriver } from "selenium-webdriver";
import { AuthData } from "@stocks_exchange/server/dist/api";

// Авторизация в системе (требует загруженной страницы входа)
export async function authenticate(driver: WebDriver, ad: AuthData) {
  // Вводим данные для входа
  const [login, pwd] = await driver.findElements(By.css("input"));
  await login.click();
  await login.sendKeys(ad.login);
  await pwd.click();
  await pwd.sendKeys(ad.password);
  // Заходим в систему
  await driver.findElement(By.id("loginButton")).click();
}

export * from "./admin";
export * from "./broker";
