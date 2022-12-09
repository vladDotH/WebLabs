import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import { Response } from "express";
import { AuthGuard } from "@nestjs/passport";
import { ExchangeService } from "./exchange.service";
import { Stock, StockHistory, TradesConfig, User } from "@api";
import { AuthService } from "./auth/auth.service";

@Controller()
export class ExchangeController {
  constructor(
    private readonly as: AuthService,
    private readonly exchange: ExchangeService
  ) {}

  @UseGuards(AuthGuard("local"))
  @Post("login")
  loginPost(@Req() req, @Res({ passthrough: true }) res: Response) {
    this.as.giveToken(req.user, res);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("login")
  loginCheck(@Req() req) {
    return req.user;
  }

  @UseGuards(AuthGuard("jwt"))
  @Delete("login")
  async logout(@Req() req, @Res({ passthrough: true }) res: Response) {
    this.as.deleteToken(res);
  }

  @Get("brokers")
  getBrokers(): number[] {
    return this.exchange.getBrokersIds();
  }

  @UseGuards(AuthGuard("jwt"))
  @Post("broker")
  addBrokers(@Body() broker: User): number {
    return this.exchange.addBroker(broker);
  }

  @Get("broker/:id")
  getBroker(@Param("id") id: string): User | null {
    return this.exchange.getBroker(parseInt(id));
  }

  @UseGuards(AuthGuard("jwt"))
  @Put("broker/:id")
  updateBroker(@Param("id") id: string, @Body() broker: User): boolean {
    const idn = parseInt(id);
    return this.exchange.updateBroker(idn, broker);
  }

  @UseGuards(AuthGuard("jwt"))
  @Delete("broker/:id")
  deleteBroker(@Param("id") id: string) {
    this.exchange.deleteBroker(parseInt(id));
  }

  @Get("available-stocks")
  getAvailableStocks(): Stock[] {
    return this.exchange.getAvailableStocks();
  }

  @Get("history/:key")
  getHistory(@Param("key") key: string): StockHistory | null {
    return this.exchange.getStockHistory(key);
  }

  @Get("active-stocks")
  getActiveStocks(): string[] {
    return this.exchange.getActiveStocks();
  }

  @UseGuards(AuthGuard("jwt"))
  @Put("active-stocks")
  setActiveStocks(@Body() stocks: string[]) {
    return this.exchange.setActiveStocks(stocks);
  }

  @Get("trades-config")
  getTradesConfig(): TradesConfig {
    return this.exchange.getTradesConfig();
  }

  @UseGuards(AuthGuard("jwt"))
  @Put("trades-config")
  setTradesConfig(@Body() config: TradesConfig) {
    return this.exchange.setTradesConfig(config);
  }

  @UseGuards(AuthGuard("jwt"))
  @Post("trades")
  switchTrades() {
    this.exchange.switchTrades();
  }
}
