import { Getters, Mutations, Actions, Module } from "vuex-smart-module";
import {
  config,
  TradesConfig,
  TradesConfigExtended,
} from "@stocks_exchange/server";
import axios from "axios";

function tradesConfigUrl() {
  return new URL("trades-config", config.api);
}

export class ConfigState {
  config: TradesConfigExtended = {
    startDate: "",
    dayDelay: 1000,
    dateRange: ["", ""],
  };
}

export class ConfigGetters extends Getters<ConfigState> {}

export class ConfigMutations extends Mutations<ConfigState> {
  updateConfig(config: TradesConfig) {
    Object.assign(this.state.config, config);
  }

  updateConfigExtended(config: TradesConfigExtended) {
    this.state.config = config;
  }
}

export class ConfigActions extends Actions<
  ConfigState,
  ConfigGetters,
  ConfigMutations,
  ConfigActions
> {
  async fetch() {
    const config = (
      await axios.get<TradesConfigExtended>(tradesConfigUrl().toString())
    ).data;
    this.mutations.updateConfigExtended({
      startDate: config.startDate,
      dayDelay: config.dayDelay,
      dateRange: config.dateRange,
    });
  }

  async update(config: TradesConfig) {
    this.mutations.updateConfig(config);
    return (await axios.put(tradesConfigUrl().toString(), config)).data;
  }
}

export const tradesConfig = new Module({
  state: ConfigState,
  getters: ConfigGetters,
  mutations: ConfigMutations,
  actions: ConfigActions,
});
