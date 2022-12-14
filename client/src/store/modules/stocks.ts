import { Getters, Mutations, Actions, Module } from "vuex-smart-module";
import { config, Stock, StockHistory } from "@stocks_exchange/server";
import axios from "axios";

function availableUrl() {
  return new URL("available-stocks", config.api);
}

function activeUrl() {
  return new URL("active-stocks", config.api);
}

function historyUrl(key: string) {
  return new URL(`history/${key}`, config.api);
}

export class StocksState {
  available: Stock[] = [];
  active: string[] = [];
  history: StockHistory[] = [];
}

export class StocksGetters extends Getters<StocksState> {}

export class StocksMutations extends Mutations<StocksState> {
  updateAvailable(stocks: Stock[]) {
    this.state.available.splice(0, this.state.available.length, ...stocks);
  }

  updateHistory(history: StockHistory[]) {
    this.state.history.splice(0, this.state.history.length, ...history);
  }

  addActive(key: string) {
    this.state.active.push(key);
  }

  removeActive(key: string) {
    this.state.active.splice(this.state.active.indexOf(key), 1);
  }
}

export class StocksActions extends Actions<
  StocksState,
  StocksGetters,
  StocksMutations,
  StocksActions
> {
  async fetch() {
    this.mutations.updateAvailable(
      (await axios.get<Stock[]>(availableUrl().toString())).data
    );
    this.mutations.updateHistory(
      await Promise.all(
        this.state.available.map(
          async (s) =>
            (
              await axios.get<StockHistory>(historyUrl(s.key).toString())
            ).data
        )
      )
    );
    (await axios.get<string[]>(activeUrl().toString())).data.forEach((key) =>
      this.mutations.addActive(key)
    );
  }

  async switchStock(key: string) {
    if (this.state.active.includes(key)) this.mutations.removeActive(key);
    else this.mutations.addActive(key);
    return await axios.put(
      activeUrl().toString(),
      Array.from(this.state.active)
    );
  }
}

export const stocks = new Module({
  state: StocksState,
  getters: StocksGetters,
  mutations: StocksMutations,
  actions: StocksActions,
});
