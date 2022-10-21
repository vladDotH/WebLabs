import passport from "passport";
import { JwtFromRequestFunction, Strategy as JwtStrategy } from "passport-jwt";
import { Router } from "express";
import jwt from "jsonwebtoken";
import { Indexed, Role, UserAuthData } from "../api";
import { Controller } from "./Controller";

// Закрытый ключ
export const secretKey = "#S3cR3t_K3y#";

// Извлечение токена из куки
const cookieExtractor: JwtFromRequestFunction = function (req): string {
  return req.signedCookies?.token ?? null;
};

export { passport };

export function createAuthRouter(controller: Controller): Router {
  const authRouter = Router();

  // Проверка токена и роли пользователя
  passport.use(
    new JwtStrategy(
      {
        jwtFromRequest: cookieExtractor,
        secretOrKey: secretKey,
      },
      (payload: Indexed, done) => {
        if (controller.getUserData(payload.id)?.role == Role.ADMIN)
          done(null, { id: payload.id });
        else done(null, false);
      }
    )
  );

  // Вход по email и паролю, устанавливает токен в куки
  authRouter.post("/login", (req, res) => {
    const data = req.body as UserAuthData,
      user = controller.authorize(data);
    if (user?.role == Role.ADMIN) {
      const token = jwt.sign({ id: user.id }, secretKey, {
        expiresIn: "1h",
      });
      res.cookie("token", token, {
        maxAge: 60 * 60 * 1000,
        httpOnly: true,
        signed: true,
      });

      res.sendStatus(200);
    } else res.sendStatus(401);
  });

  // Точка проверки действительности токена
  authRouter.get(
    "/login",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      res.sendStatus(200);
    }
  );

  return authRouter;
}
