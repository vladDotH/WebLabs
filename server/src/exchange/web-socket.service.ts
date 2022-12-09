import {
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from "@nestjs/websockets";
import { Socket, Server } from "socket.io";
import { EventsMap } from "socket.io/dist/typed-events";
import { ClientToServerEvents, ServerToClientEvents, StocksRate } from "@api";

@WebSocketGateway({ cors: true })
export class WebSocketService
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  private server: Server<
    ServerToClientEvents,
    ClientToServerEvents,
    EventsMap,
    EventsMap
  >;
  private connections: Socket[] = [];

  postStocksRate(rates: StocksRate) {
    this.server.emit("postStocksRate", rates);
  }

  afterInit(server: Server) {
    /**/
  }

  handleConnection(client: Socket) {
    this.connections.push(client);
  }

  handleDisconnect(client: Socket) {
    const index = this.connections.indexOf(client);
    if (index !== -1) this.connections.splice(index, 1);
  }
}
