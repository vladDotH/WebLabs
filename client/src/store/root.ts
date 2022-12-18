import {
  AuthData,
  config,
  ProfitRecord,
  StockBundle,
  TransactionTypes,
  User,
} from "@stocks_exchange/server/";
import { trades } from "@/store/modules/trades";
import { Actions, Getters, Module, Mutations } from "vuex-smart-module";
import axios from "axios";

function loginUrl() {
  return new URL("login", config.api);
}

function profitUrl() {
  return new URL("profit", config.api);
}

function transactionUrl(type: TransactionTypes) {
  return new URL(type === TransactionTypes.BUY ? "buy" : "sell", config.api);
}

export class RootState {
  self: User | null = null;
  profit: ProfitRecord[] = [];
}

export class RootGetters extends Getters<RootState> {}

export class RootMutations extends Mutations<RootState> {
  updateUser(user: User) {
    this.state.self = user;
  }

  updateProfit(profit: ProfitRecord[]) {
    this.state.profit = profit;
  }

  reset() {
    this.state.self = null;
  }
}

export class RootActions extends Actions<
  RootState,
  RootGetters,
  RootMutations,
  RootActions
> {
  async login(ad: AuthData) {
    try {
      this.mutations.updateUser(
        (await axios.post<User>(loginUrl().toString(), ad)).data
      );
      return true;
    } catch (err) {
      return false;
    }
  }

  async fetch() {
    try {
      this.mutations.updateUser(
        (await axios.get<User>(loginUrl().toString())).data
      );
      return true;
    } catch (err) {
      return false;
    }
  }

  async check() {
    try {
      await axios.head(loginUrl().toString());
      return true;
    } catch (err) {
      this.mutations.reset();
      return false;
    }
  }

  async logout() {
    return (await axios.delete(loginUrl().toString())).data;
  }

  async fetchProfit() {
    this.mutations.updateProfit(
      (await axios.get<ProfitRecord[]>(profitUrl().toString())).data
    );
  }

  async buy(bundle: StockBundle) {
    return await axios.post(
      transactionUrl(TransactionTypes.BUY).toString(),
      bundle
    );
  }

  async sell(bundle: StockBundle) {
    return await axios.post(
      transactionUrl(TransactionTypes.SELL).toString(),
      bundle
    );
  }
}

export const root = new Module({
  state: RootState,
  getters: RootGetters,
  mutations: RootMutations,
  actions: RootActions,
  modules: { trades },
});
