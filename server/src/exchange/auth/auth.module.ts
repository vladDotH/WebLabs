import { Module, forwardRef } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { PassportModule } from "@nestjs/passport";
import { ExchangeModule } from "../exchange.module";
import { LocalStrategy } from "./local.strategy";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./jwt.strategy";

export const key = "$s3cr3t_key$";
export const expire = 60 * 60 * 1000;
export const tokenKey = "token";

@Module({
  imports: [
    forwardRef(() => ExchangeModule),
    PassportModule,
    JwtModule.register({
      secret: key,
      signOptions: { expiresIn: expire },
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
