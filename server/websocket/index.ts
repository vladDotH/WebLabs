import { UserData } from "../../api";
import { EventsMap } from "socket.io/dist/typed-events";
import { Handler, NextFunction, Request, Response } from "express";
import io from "socket.io";
import { ExtendedError } from "socket.io/dist/namespace";

export type InterServerEvents = EventsMap;

export interface SocketData {
  user: UserData;
}

// Декоратор exporess-обработчиков для работы с socket.io
export function wrapSocketMW(mw: Handler) {
  return (
    socket: io.Socket,
    next: (err?: ExtendedError | undefined) => void
  ) => {
    mw(socket.request as Request, {} as Response, next as NextFunction);
  };
}

export * from "./SocketManager";
