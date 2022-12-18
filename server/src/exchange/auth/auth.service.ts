import { Injectable } from "@nestjs/common";
import { ExchangeService } from "../exchange.service";
import { AuthData, User } from "@api";
import { JwtService } from "@nestjs/jwt";
import { Response } from "express";
import { expire, tokenKey } from "./auth.module";

@Injectable()
export class AuthService {
  constructor(
    private readonly es: ExchangeService,
    private readonly jwt: JwtService
  ) {}

  validateUser(ad: AuthData): User | null {
    const user = this.es.getByLogin(ad.login);
    if (user && user.password === ad.password) return user;
    return null;
  }

  giveToken(user: User, res: Response) {
    const token = this.jwt.sign({ id: user.id });
    res.cookie(tokenKey, token, {
      maxAge: expire,
      httpOnly: true,
      signed: true,
    });
  }

  deleteToken(res: Response) {
    res.clearCookie(tokenKey);
  }
}
