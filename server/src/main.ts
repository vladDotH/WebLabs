import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { config } from "@api";
import * as cookieParser from "cookie-parser";
import { key } from "./exchange/auth/auth.module";

(async () => {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: config.client, credentials: true });
  app.use(cookieParser(key));
  await app.listen(3000);
})();
