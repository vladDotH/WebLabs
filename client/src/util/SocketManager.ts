import { io, Socket } from "socket.io-client";
import {
  ClientToServerEvents,
  config,
  ServerToClientEvents,
  StocksRate,
} from "@stocks_exchange/server";
import { Store } from "vuex";
import { State } from "@/store";

export class SocketManager {
  private socket: Socket<ServerToClientEvents, ClientToServerEvents>;
  private store: Store<State> | null = null;

  constructor(store: Store<State>) {
    this.store = store;
    this.socket = io(config.webSocket);
    this.socket.on("postStocksRate", (rate: StocksRate) => {
      this.store?.commit("updateRate", rate);
      this.store?.state.cfg.fetch();
    });
  }
}
