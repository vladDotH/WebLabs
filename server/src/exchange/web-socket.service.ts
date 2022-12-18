import {
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from "@nestjs/websockets";
import { Inject, forwardRef } from "@nestjs/common";
import { Socket, Server } from "socket.io";
import { EventsMap } from "socket.io/dist/typed-events";
import { ClientToServerEvents, ServerToClientEvents, StocksRate } from "@api";
import { ExchangeService } from "./exchange.service";

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

  constructor(
    @Inject(forwardRef(() => ExchangeService))
    private readonly es: ExchangeService
  ) {}

  postStocksRate(rates: StocksRate) {
    this.server.emit("postStocksRate", rates);
  }

  sendCurrentHistory(client?: Socket) {
    (client ?? this.server).emit(
      "sendCurrentHistory",
      this.es.getRatesHistory()
    );
  }

  afterInit(server: Server) {
    /**/
  }

  handleConnection(client: Socket) {
    this.sendCurrentHistory(client);
    this.connections.push(client);
  }

  handleDisconnect(client: Socket) {
    const index = this.connections.indexOf(client);
    if (index !== -1) this.connections.splice(index, 1);
  }
}
