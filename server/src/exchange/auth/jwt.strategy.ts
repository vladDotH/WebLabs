import { JwtFromRequestFunction, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { key, tokenKey } from "./auth.module";
import { Indexed, User } from "@api";
import { ExchangeService } from "../exchange.service";

// Извлечение токена из куки
export const cookieExtractor: JwtFromRequestFunction = (req) => {
  return req.signedCookies[tokenKey] ?? null;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly es: ExchangeService) {
    super({
      jwtFromRequest: cookieExtractor,
      ignoreExpiration: false,
      secretOrKey: key,
    });
  }

  async validate(payload: Indexed): Promise<User | null> {
    return this.es.getById(payload.id ?? 0);
  }
}
