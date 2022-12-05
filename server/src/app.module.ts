import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { ExchangeModule } from './exchange/exchange.module';

@Module({
  imports: [
    ExchangeModule,
    RouterModule.register([{ path: 'api', module: ExchangeModule }]),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
