import { io, Socket } from "socket.io-client";
import {
  ClientToServerEvents,
  config,
  ServerToClientEvents,
  UserData,
} from "../../api";

export class SocketManager {
  private socket: Socket<ServerToClientEvents, ClientToServerEvents>;

  constructor() {
    this.socket = io(config.webSocket, { withCredentials: true });
  }

  addListener(cb: (user: UserData) => void) {
    this.socket.on("post", cb);
  }

  removeListener(cb: (user: UserData) => void) {
    this.socket.removeListener("post", cb);
  }
}
