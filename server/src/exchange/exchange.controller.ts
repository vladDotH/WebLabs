import { Controller, Get } from '@nestjs/common';

/**
 post broker
 put broker
 delete broker
 get broker
 get stocks_list
 put active_stocks
 put config
 post start
 post stop
 6: buy, sell, profit?
*/

@Controller('exchange')
export class ExchangeController {
  @Get()
  hello2() {
    return 'hello2';
  }

  @Get('hello')
  hello() {
    return 'hello';
  }
}
