import { Getters, Mutations, Actions, Module } from "vuex-smart-module";
import { config, ExchangeState, StocksRate } from "@stocks_exchange/server";
import axios from "axios";

function stateUrl() {
  return new URL("state", config.api);
}

function tradesUrl() {
  return new URL("trades", config.api);
}

export class TradesState {
  exchangeState: ExchangeState = { date: "", active: false };
  rate: StocksRate = { stocks: [], date: "" };
  history: StocksRate[] = [];
}

export class TradesGetters extends Getters<TradesState> {}

export class TradesMutations extends Mutations<TradesState> {
  setHistory(h: StocksRate[]) {
    this.state.history = h;
  }

  updateRate(rate: StocksRate) {
    if (rate.stocks.every((s) => s.cost > 0)) this.state.history.push(rate);
    this.state.rate = rate;
  }

  updateState(state: ExchangeState) {
    this.state.exchangeState = state;
  }
}

export class TradesActions extends Actions<
  TradesState,
  TradesGetters,
  TradesMutations,
  TradesActions
> {
  async fetchState() {
    this.mutations.updateState(
      (await axios.get<ExchangeState>(stateUrl().toString())).data
    );
  }

  async switchTrades() {
    return await axios.post(tradesUrl().toString());
  }
}

export const trades = new Module({
  state: TradesState,
  getters: TradesGetters,
  mutations: TradesMutations,
  actions: TradesActions,
});
