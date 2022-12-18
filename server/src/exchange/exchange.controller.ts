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
import {
  ExchangeState,
  Roles,
  Stock,
  StockBundle,
  StockHistory,
  TradesConfig,
  TradesConfigExtended,
  TransactionTypes,
  User,
} from "@api";
import { AuthService } from "./auth/auth.service";
import { RequireRoles } from "./auth/roles.decorator";
import { RolesGuard } from "./auth/roles.guard";

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
    return req.user;
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("login")
  loginCheck(@Req() req): User {
    return req.user;
  }

  @UseGuards(AuthGuard("jwt"))
  @Delete("login")
  async logout(@Req() req, @Res({ passthrough: true }) res: Response) {
    this.as.deleteToken(res);
  }

  @RequireRoles(Roles.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard("jwt"))
  @Get("brokers")
  getBrokers(): number[] {
    return this.exchange.getBrokersIds();
  }

  @RequireRoles(Roles.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard("jwt"))
  @Post("brokers")
  addBrokers(@Body() broker: User): number {
    return this.exchange.addBroker(broker);
  }

  @RequireRoles(Roles.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard("jwt"))
  @Get("broker/:id")
  getBroker(@Param("id") id: string): User | null {
    return this.exchange.getBroker(parseInt(id));
  }

  @RequireRoles(Roles.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard("jwt"))
  @Get("profit/:id")
  getProfit(@Param("id") id: string) {
    return this.exchange.getProfit(parseInt(id));
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("profit")
  getSelfProfit(@Req() req) {
    return this.exchange.getProfit(req.user.id);
  }

  @RequireRoles(Roles.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard("jwt"))
  @Put("broker/:id")
  updateBroker(@Param("id") id: string, @Body() broker: User): boolean {
    const idn = parseInt(id);
    return this.exchange.updateBroker(idn, broker);
  }

  @RequireRoles(Roles.ADMIN)
  @UseGuards(RolesGuard)
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

  @RequireRoles(Roles.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard("jwt"))
  @Put("active-stocks")
  setActiveStocks(@Body() stocks: string[]) {
    return this.exchange.setActiveStocks(stocks);
  }

  @Get("state")
  getExchangeState(): ExchangeState {
    return this.exchange.getState();
  }

  @Get("trades-config")
  getTradesConfig(): TradesConfigExtended {
    return this.exchange.getTradesConfig();
  }

  @RequireRoles(Roles.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard("jwt"))
  @Put("trades-config")
  setTradesConfig(@Body() config: TradesConfig) {
    return this.exchange.setTradesConfig(config);
  }

  @RequireRoles(Roles.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard("jwt"))
  @Post("trades")
  switchTrades() {
    this.exchange.switchTrades();
  }

  @RequireRoles(Roles.BROKER)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard("jwt"))
  @Post("buy")
  buyStocks(@Req() req, @Body() bundle: StockBundle) {
    this.exchange.transaction(req.user.id, bundle, TransactionTypes.BUY);
  }

  @RequireRoles(Roles.BROKER)
  @UseGuards(RolesGuard)
  @UseGuards(AuthGuard("jwt"))
  @Post("sell")
  sellStocks(@Req() req, @Body() bundle: StockBundle) {
    this.exchange.transaction(req.user.id, bundle, TransactionTypes.SELL);
  }
}
