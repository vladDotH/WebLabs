import { Injectable, OnModuleInit } from "@nestjs/common";
import {
  ExchangeState,
  Roles,
  Stock,
  StockHistory,
  StockHistoryRecord,
  StockRateRecord,
  TradesConfig,
  TradesConfigExtended,
  User,
} from "@api";
import { CollectionModel } from "./collection.model";
import * as fs from "fs";
import * as path from "path";
import { WebSocketService } from "./web-socket.service";

@Injectable()
export class ExchangeService implements OnModuleInit {
  private users: CollectionModel<User> = new CollectionModel<User>();
  private availableStocks: Stock[] = [];
  private activeStocks: string[] = [];
  private stocksHistory: StockHistory[] = [];
  private tradesConfig: TradesConfig = {
    startDate: "2021-01-03",
    dayDelay: 1000,
  };
  private state: ExchangeState = {
    date: "",
    active: false,
  };
  private dateRange: [string, string] = ["", ""];
  private currentDate: Date = new Date();
  private rates: StockRateRecord[] = [];
  private timerId: NodeJS.Timer | null = null;

  readonly storagePath = "./storage";

  constructor(private readonly ws: WebSocketService) {}

  onModuleInit() {
    this.availableStocks = JSON.parse(
      fs.readFileSync(path.join(this.storagePath, "stocks.json"), "utf-8")
    ) as Stock[];
    (
      JSON.parse(
        fs.readFileSync(path.join(this.storagePath, "users.json"), "utf-8")
      ) as User[]
    ).forEach((u) => this.users.add(u));

    for (const i of this.availableStocks) {
      this.stocksHistory.push({
        stock: i,
        records: (
          JSON.parse(
            fs.readFileSync(
              path.join(this.storagePath, `${i.key}.json`),
              "utf-8"
            )
          ) as StockHistoryRecord[]
        ).reverse(),
      });
    }
    const sample = this.stocksHistory[0];
    if (sample)
      this.dateRange = [
        sample.records[0].date,
        sample.records[sample.records.length - 1].date,
      ];
    else throw new Error("empty data");
  }

  getByLogin(login: string): User | null {
    return this.users.list.find((u) => u.login === login) ?? null;
  }

  getById(id: number): User | null {
    return this.users.find(id);
  }

  getBrokersIds(): number[] {
    return this.users.list
      .filter((u) => u.role === Roles.BROKER)
      .map((u) => u.id!);
  }

  getBroker(id: number): User | null {
    return this.users.find(id);
  }

  addBroker(user: User): number {
    if (this.users.list.find((u) => u.login === user.login)) return 0;
    return this.users.add({
      login: user.login,
      password: user.password,
      balance: user.balance,
      role: Roles.BROKER,
      stocks: [],
    });
  }

  deleteBroker(id: number) {
    this.users.remove(id);
  }

  updateBroker(id: number, user: User): boolean {
    if (this.users.list.find((u) => u.login === user.login && id !== u.id))
      return false;
    const u = this.users.find(id);
    if (u) {
      [u.login, u.password, u.balance] = [
        user.login,
        user.password,
        user.balance,
      ];
    }
    return true;
  }

  getAvailableStocks(): Stock[] {
    return this.availableStocks;
  }

  getActiveStocks(): string[] {
    return this.activeStocks;
  }

  setActiveStocks(stocks: string[]) {
    this.activeStocks = stocks;
  }

  getStockHistory(key: string): StockHistory | null {
    return this.stocksHistory.find((s) => s.stock.key === key) ?? null;
  }

  getTradesConfig(): TradesConfigExtended {
    return { ...this.tradesConfig, dateRange: this.dateRange };
  }

  getState() {
    return this.state;
  }

  setTradesConfig(tc: TradesConfig) {
    if (!this.state.active)
      [this.tradesConfig.startDate, this.tradesConfig.dayDelay] = [
        new Date(tc.startDate) < new Date(this.dateRange[0])
          ? this.dateRange[0]
          : tc.startDate,
        tc.dayDelay,
      ];
  }

  getDateRange(): [string, string] {
    return this.dateRange;
  }

  private updateTrades() {
    if (this.currentDate > new Date(this.dateRange[1])) {
      return this.switchTrades();
    }
    this.state.date = this.currentDate.toISOString().split("T")[0];
    const rates = this.activeStocks.map((key) => ({
      key,
      cost:
        this.stocksHistory
          .find((s) => s.stock.key === key)
          ?.records.find((r) => r.date === this.state.date)?.cost ?? 0,
    }));
    if (rates.every((s) => s.cost > 0)) this.rates = rates;
    this.ws.postStocksRate({ date: this.state.date, stocks: this.rates });
    this.currentDate.setDate(this.currentDate.getDate() + 1);
  }

  switchTrades() {
    this.state.active = !this.state.active;
    if (this.state.active) {
      this.currentDate = new Date(this.tradesConfig.startDate);
      this.updateTrades();
      this.timerId = setInterval(
        this.updateTrades.bind(this),
        this.tradesConfig.dayDelay
      );
    } else {
      if (this.timerId) clearInterval(this.timerId);
      this.ws.postStocksRate({
        date: this.currentDate.toISOString().split("T")[0],
        stocks: [],
      });
    }
  }
}
