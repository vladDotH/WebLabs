import { Module, forwardRef } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { ExchangeService } from "./exchange.service";
import { ExchangeController } from "./exchange.controller";
import { WebSocketService } from "./web-socket.service";

@Module({
  imports: [forwardRef(() => AuthModule)],
  providers: [ExchangeService, WebSocketService],
  controllers: [ExchangeController],
  exports: [ExchangeService],
})
export class ExchangeModule {}
