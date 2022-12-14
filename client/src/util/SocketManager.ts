import { io, Socket } from "socket.io-client";
import {
  ClientToServerEvents,
  config,
  ServerToClientEvents,
  StocksRate,
} from "@stocks_exchange/server";
import { Store } from "vuex";
import { RootState } from "@/store/root";

export class SocketManager {
  private socket: Socket<ServerToClientEvents, ClientToServerEvents>;
  private store: Store<RootState> | null = null;

  constructor(store: Store<RootState>) {
    this.store = store;
    this.socket = io(config.webSocket);
    this.socket.on("postStocksRate", (rate: StocksRate) => {
      this.store?.commit("trades/updateRate", rate);
      this.store?.dispatch("trades/fetchState");
    });
  }
}
