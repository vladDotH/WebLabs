import { AuthData, config, User } from "@stocks_exchange/server/dist/api";
import { trades } from "@/store/modules/trades";
import { Module, Getters, Mutations, Actions } from "vuex-smart-module";
import axios from "axios";

function loginUrl() {
  return new URL("login", config.api);
}

export class RootState {
  self: User | null = null;
}

export class RootGetters extends Getters<RootState> {}

export class RootMutations extends Mutations<RootState> {
  updateUser(user: User) {
    this.state.self = user;
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
      await axios.post(loginUrl().toString(), ad);
      this.actions.fetch();
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
}

export const root = new Module({
  state: RootState,
  getters: RootGetters,
  mutations: RootMutations,
  actions: RootActions,
  modules: { trades },
});
