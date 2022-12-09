import { AuthData, config, User } from "@stocks_exchange/server";
import axios from "axios";

export class UserController {
  static readonly loginUrl = new URL("login", config.api);

  // Аутентификация
  static async login(user: AuthData): Promise<boolean> {
    try {
      await axios.post(this.loginUrl.toString(), user);
      return true;
    } catch (err) {
      return false;
    }
  }

  // Проверка аутентификации
  static async check() {
    try {
      await axios.head(this.loginUrl.toString());
      return true;
    } catch (err) {
      return false;
    }
  }

  // Получение собственных данных
  static async getSelf() {
    return (await axios.get<User>(this.loginUrl.toString())).data;
  }

  // Выход
  static async logout() {
    return await axios.delete(this.loginUrl.toString());
  }
}
