import express from "express";
import cors from "cors";
import { config } from "../api";
import { createAuthRouter, passport, secretKey } from "./auth";
import cookieParser from "cookie-parser";
import { createAdminRouter } from "./router";
import fs from "fs";
import path from "path";
import { Controller } from "./Controller";

const app = express();
const port = 3000;

const storagePath = "./storage";

function load<T>(file: string): T {
  return JSON.parse(
    fs.readFileSync(path.resolve(storagePath, file), "utf-8")
  ) as T;
}

const controller = new Controller(
  load("users.json"),
  load("photos.json"),
  load("posts.json")
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
app.use("/api", createAuthRouter(controller));
app.use(
  "/api",
  passport.authenticate("jwt", { session: false }),
  createAdminRouter(controller, storagePath)
);

app.listen(port, config.serverHost, function () {
  console.log(`Server started at http://${config.serverHost}:${port}`);
});
