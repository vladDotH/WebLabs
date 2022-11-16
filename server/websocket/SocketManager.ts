import io from "socket.io";
import cookieParser from "cookie-parser";
import { passport } from "../auth";
import { InterServerEvents, SocketData, wrapSocketMW } from "./index";
import {
  ClientToServerEvents,
  ServerToClientEvents,
  UserData,
} from "../../api";

// Класс управления web-сокетом
export class SocketManager {
  // Пул сокетов для пользователей по их id
  private pool: Map<number, io.Socket> = new Map();

  constructor(
    public readonly server: io.Server<
      ServerToClientEvents,
      ClientToServerEvents,
      InterServerEvents,
      SocketData
    >,
    secretKey: string
  ) {
    this.server
      .use(wrapSocketMW(cookieParser(secretKey)))
      .use(wrapSocketMW(passport.initialize()))
      // Проверка токена пользователя
      .use((socket, next) =>
        wrapSocketMW(
          passport.authenticate("jwt", (err, user, info) => {
            console.log("socket user:", user);
            if (user) {
              socket.data.user = user;
              next();
            }
          })
        )(socket, next)
      )
      // Обработка подключения, добавление сокета в пул
      .on("connection", (socket) => {
        console.log("connection");
        if (socket.data.user) {
          this.pool.set(socket.data.user.id, socket);
          socket.on("disconnect", (reason) => {
            console.log("disconnect");
            this.pool.delete(socket.data.user!.id);
          });
        }
      });
  }

  // Оповещение друзьям пользователя о новости
  post(user: UserData) {
    user.friends.forEach((f) => {
      this.pool.get(f)?.emit("post", user);
    });
  }
}
