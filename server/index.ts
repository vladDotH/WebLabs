import express from "express";
import cors from "cors";
import { config } from "../api";
import { createAuthRouter, passport, secretKey } from "./auth";
import cookieParser from "cookie-parser";
import { createNetworkRouter } from "./router";
import fs from "fs";
import path from "path";
import { NetworkModel } from "./model";
import multer from "multer";

const app = express();
const port = 3000;

const storagePath = "./storage";
export const uploader = multer({ dest: storagePath });

function load<T>(file: string): T {
  return JSON.parse(
    fs.readFileSync(path.resolve(storagePath, file), "utf-8")
  ) as T;
}

const model = new NetworkModel(
  load("users.json"),
  load("photos.json"),
  load("posts.json"),
  load("messages.json")
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
app.use(
  "/api",
  (req, res, next) =>
    passport.authenticate("jwt", { session: false }, (err, user, info) => {
      res.locals.user = user;
      next();
    })(req, res, next),
  createNetworkRouter(model, storagePath, uploader)
);

app.listen(port, config.serverHost, function () {
  console.log(`Server started at http://${config.serverHost}:${port}`);
});
