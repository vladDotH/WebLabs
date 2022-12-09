import {
  User,
  config,
  Stock,
  TradesConfig,
  StockHistory,
} from "@stocks_exchange/server";
import axios from "axios";

// Интерфейс загрузчика
export interface Loader {
  get url(): URL;
  fetch(): Promise<void>;
}

// Загрузчик списка брокеров
export class BrokersListLoader implements Loader {
  readonly ids: number[] = [];

  get url(): URL {
    return new URL("brokers", config.api);
  }

  async fetch() {
    if (this.url)
      this.ids.splice(
        0,
        this.ids.length,
        ...(await axios.get<number[]>(this.url.toString())).data
      );
  }

  async add(broker: User): Promise<number> {
    const res = await BrokerLoader.add(broker);
    if (res) this.ids.splice(0, 0, res);
    return res;
  }

  async remove(id: number) {
    const index = this.ids.indexOf(id);
    if (index !== -1) this.ids.splice(index, 1);
  }
}

// Загрузчик брокера
export class BrokerLoader implements Loader {
  data: User | null = null;

  constructor(readonly id: number) {}

  get url(): URL {
    return new URL(`broker/${this.id}`, config.api);
  }

  async fetch() {
    this.data = (await axios.get<User>(this.url.toString())).data;
  }

  static addUrl = new URL("broker", config.api);
  static async add(broker: User): Promise<number> {
    return (await axios.post<number>(this.addUrl.toString(), broker)).data;
  }

  async update(broker: User): Promise<boolean> {
    const res = (await axios.put<boolean>(this.url.toString(), broker)).data;
    if (this.data && res)
      [this.data.login, this.data.password, this.data.balance] = [
        broker.login,
        broker.password,
        broker.balance,
      ];
    return res;
  }

  async remove() {
    return await axios.delete(this.url.toString());
  }
}

// Загрузчик доступных акций
export class AvailableStocksLoader {
  data: Stock[] = [];

  get url(): URL {
    return new URL("available-stocks", config.api);
  }

  async fetch() {
    this.data = (await axios.get<Stock[]>(this.url.toString())).data;
  }
}

// Загрузчик активных акций
export class ActiveStocksLoader {
  keys: Set<string> = new Set();

  async fetch() {
    this.keys = new Set((await axios.get<string[]>(this.url.toString())).data);
  }

  get url(): URL {
    return new URL("active-stocks", config.api);
  }

  async switchStock(key: string) {
    if (this.keys.has(key)) this.keys.delete(key);
    else this.keys.add(key);
    return await axios.put(this.url.toString(), Array.from(this.keys));
  }
}

// Загрузчик исторических данных акции
export class StockHistoryLoader implements Loader {
  constructor(readonly key: string) {}
  data: StockHistory | null = null;

  get url(): URL {
    return new URL(`history/${this.key}`, config.api);
  }

  async fetch() {
    this.data = (await axios.get<StockHistory>(this.url.toString())).data;
  }
}

export class TradesConfigLoader implements Loader {
  config: TradesConfig | null = null;

  get url(): URL {
    return new URL("trades-config", config.api);
  }

  async fetch() {
    this.config = (await axios.get<TradesConfig>(this.url.toString())).data;
  }

  async save() {
    return await axios.put(this.url.toString(), this.config);
  }

  get switchTradesUrl(): URL {
    return new URL("trades", config.api);
  }

  async switchTrades() {
    if (this.config) {
      this.config.active = !this.config.active;
      return await axios.post(this.switchTradesUrl.toString());
    }
  }
}
