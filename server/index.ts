import express from "express";
import cors from "cors";
import { config } from "../api";
import { createAuthRouter, passport, secretKey } from "./auth";
import cookieParser from "cookie-parser";
import { createNetworkRouter } from "./router";
import { NetworkModel, load } from "./model";
import multer from "multer";
import io from "socket.io";
import { SocketManager } from "./websocket";

const app = express();
const port = 3000;

const storagePath = "./storage";
export const uploader = multer({ dest: storagePath });

const model = new NetworkModel(
  load("users.json", storagePath),
  load("photos.json", storagePath),
  load("posts.json", storagePath),
  storagePath
);

const httpServer = app.listen(port, config.serverHost, function () {
  console.log(`Server started at http://${config.serverHost}:${port}`);
});

const socket = new SocketManager(
  new io.Server(httpServer, {
    cors: { origin: config.client, credentials: true },
  }),
  secretKey
);

app.use(
  cors({
    origin: config.client,
    credentials: true,
  })
);
app.use(cookieParser(secretKey));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use("/api", createAuthRouter(model));
// Подключение маршрутизатора соцсети и передача всем его обработчикам объекта авторизованного пользователя
app.use(
  "/api",
  (req, res, next) =>
    passport.authenticate("jwt", { session: false }, (err, user, info) => {
      res.locals.user = user;
      next();
    })(req, res, next),
  createNetworkRouter(model, socket, storagePath, uploader)
);
