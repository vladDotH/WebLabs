import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ExchangeService } from './exchange.service';
import { ExchangeController } from './exchange.controller';
import { WebSocketService } from './web-socket.service';

@Module({
  imports: [AuthModule],
  providers: [ExchangeService, WebSocketService],
  controllers: [ExchangeController],
})
export class ExchangeModule {}
