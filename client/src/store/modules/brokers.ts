import { Getters, Mutations, Actions, Module } from "vuex-smart-module";
import {
  config,
  ProfitInfo,
  ProfitRecord,
  User,
} from "@stocks_exchange/server";
import axios from "axios";

function brokersUrl(): URL {
  return new URL("brokers", config.api);
}

function brokerUrl(id: number) {
  return new URL(`broker/${id}`, config.api);
}

function profitUrl(id: number) {
  return new URL(`profit/${id}`, config.api);
}

export class BrokersState {
  brokers: User[] = [];
  profits: ProfitInfo[] = [];
}

export class BrokersGetters extends Getters<BrokersState> {}

export class BrokersMutations extends Mutations<BrokersState> {
  pushBroker(data: User) {
    this.state.brokers.push(data);
  }

  unshiftBroker(data: User) {
    this.state.brokers.unshift(data);
  }

  setBrokers(brokers: User[]) {
    this.state.brokers = brokers;
  }

  removeBroker(id: number) {
    const index = this.state.brokers.findIndex((b) => b.id === id);
    if (index !== -1) this.state.brokers.splice(index, 1);
  }

  updateBroker(data: User) {
    const index = this.state.brokers.findIndex((b) => b.id === data.id);
    if (index !== -1) this.state.brokers.splice(index, 1, data);
  }

  setProfits(p: ProfitInfo[]) {
    this.state.profits = p;
  }
}

export class BrokersActions extends Actions<
  BrokersState,
  BrokersGetters,
  BrokersMutations,
  BrokersActions
> {
  async fetch() {
    const ids = (await axios.get<number[]>(brokersUrl().toString())).data;
    this.mutations.setBrokers(
      await Promise.all(
        ids.map(
          async (id) => (await axios.get<User>(brokerUrl(id).toString())).data
        )
      )
    );
  }

  async addBroker(data: User): Promise<boolean> {
    const id = (await axios.post<number>(brokersUrl().toString(), data)).data;
    if (id) {
      this.mutations.unshiftBroker({ ...data, id });
      return true;
    }
    return false;
  }

  async removeBroker(id: number) {
    this.mutations.removeBroker(id);
    return (await axios.delete(brokerUrl(id).toString())).data;
  }

  async updateBroker(data: User): Promise<boolean> {
    if (data.id) {
      const res = (
        await axios.put<boolean>(brokerUrl(data.id).toString(), data)
      ).data;
      if (res) this.mutations.updateBroker(data);
      return res;
    }
    return false;
  }

  async fetchProfits() {
    this.mutations.setProfits(
      await Promise.all(
        this.state.brokers.map(
          async (b) =>
            ({
              id: b.id,
              profits: (
                await axios.get<ProfitRecord[]>(profitUrl(b.id ?? 0).toString())
              ).data,
            } as ProfitInfo)
        )
      )
    );
  }
}

export const brokers = new Module({
  state: BrokersState,
  getters: BrokersGetters,
  mutations: BrokersMutations,
  actions: BrokersActions,
});
