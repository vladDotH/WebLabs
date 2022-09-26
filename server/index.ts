import express from "express";
import cors from "cors";
import { libRouter } from "./libRouter";
import { config } from "../api";
import passport, { authRouter, secretKey } from "./auth";
import cookieParser from "cookie-parser";

const app = express();
const port = 3000;

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
app.use("/api", authRouter);
app.use("/api", passport.authenticate("jwt", { session: false }), libRouter);

app.listen(port, config.serverHost, function () {
  console.log(`Server started at http://${config.serverHost}:${port}`);
});
