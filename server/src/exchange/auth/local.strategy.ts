import { Strategy } from "passport-local";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { User } from "@api";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private as: AuthService) {
    super({
      usernameField: "login",
    });
  }

  async validate(login: string, password: string): Promise<User> {
    const user = await this.as.validateUser({
      login,
      password,
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
