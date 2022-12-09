import Vue from "vue";
import Vuex from "vuex";
import { StocksRate } from "@stocks_exchange/server";
import { TradesConfigLoader } from "@/util";

Vue.use(Vuex);

export interface State {
  rate: StocksRate | null;
  cfg: TradesConfigLoader;
  authorized: boolean;
}

export default new Vuex.Store<State>({
  state: {
    rate: null,
    cfg: new TradesConfigLoader(),
    authorized: false,
  },
  getters: {},
  mutations: {
    updateRate(state: State, payload: StocksRate) {
      state.rate = { ...payload };
    },
    refresh(state: State) {
      state.rate = null;
    },
    updateAuth(state: State, payload: boolean) {
      state.authorized = payload;
    },
  },
  actions: {},
  modules: {},
});
