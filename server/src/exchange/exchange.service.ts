import { Injectable, OnModuleInit, Inject, forwardRef } from "@nestjs/common";
import {
  ExchangeState,
  ProfitRecord,
  Roles,
  Stock,
  StockBundle,
  StockHistory,
  StockHistoryRecord,
  StockRateRecord,
  StocksRate,
  TradesConfig,
  TradesConfigExtended,
  Transaction,
  TransactionTypes,
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
  private ratesHistory: StocksRate[] = [];
  private transactions: Transaction[] = [];

  readonly storagePath = "./storage";

  @Inject(forwardRef(() => WebSocketService))
  private readonly ws: WebSocketService;

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
    this.activeStocks = Array.from(new Set(stocks));
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
    this.ratesHistory.push({ date: this.state.date, stocks: this.rates });
    this.ws.postStocksRate({ date: this.state.date, stocks: this.rates });
    this.currentDate.setDate(this.currentDate.getDate() + 1);
  }

  switchTrades() {
    this.state.active = !this.state.active;
    this.ratesHistory = [];
    this.ws.sendCurrentHistory();
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

  getRatesHistory() {
    return this.ratesHistory;
  }

  private addStocks(broker: User, bundle: StockBundle) {
    const bnd = broker.stocks.find((b) => b.key == bundle.key);
    if (bnd) bnd.amount += bundle.amount;
    else broker.stocks.push(bundle);
  }

  private delStocks(broker: User, bundle: StockBundle): boolean {
    const bnd = broker.stocks.find((b) => b.key == bundle.key);
    if (bnd && bnd.amount >= bundle.amount) {
      bnd.amount -= bundle.amount;
      return true;
    }
    return false;
  }

  transaction(brokerId: number, bundle: StockBundle, type: TransactionTypes) {
    const b = this.getBroker(brokerId),
      stock = this.rates.find((r) => r.key == bundle.key);
    let success = false;
    if (this.state.active && b && stock) {
      const sum = bundle.amount * stock.cost;
      switch (type) {
        case TransactionTypes.BUY:
          if (sum < b.balance) {
            b.balance -= sum;
            this.addStocks(b, bundle);
            success = true;
          }
          break;
        case TransactionTypes.SELL:
          if (this.delStocks(b, bundle)) {
            b.balance += sum;
            success = true;
          }
          break;
      }
      if (success) {
        this.transactions.push({
          brokerId,
          type,
          stocks: { key: bundle.key, amount: bundle.amount, cost: stock.cost },
        });
        return true;
      }
    }
    return false;
  }

  getProfit(brokerId: number): ProfitRecord[] {
    const b = this.getBroker(brokerId);
    if (b) {
      const tr = this.transactions.filter((t) => t.brokerId == brokerId);
      return Array.from(new Set(tr.map((t) => t.stocks.key))).map((key) => ({
        key,
        value:
          tr
            .filter((t) => t.stocks.key == key)
            .reduce((acc, prev) => {
              return (
                acc +
                prev.stocks.amount *
                  prev.stocks.cost *
                  (prev.type == TransactionTypes.BUY ? -1 : 1)
              );
            }, 0) +
          (b.stocks.find((s) => s.key === key)?.amount ?? 0) *
            (this.rates.find((s) => s.key === key)?.cost ?? 0),
      }));
    }
    return [];
  }
}
