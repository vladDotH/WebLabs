import passport from "passport";
import { JwtFromRequestFunction, Strategy as JwtStrategy } from "passport-jwt";
import { Router } from "express";
import jwt from "jsonwebtoken";
import { Indexed, UserAuthData, UserSignUpData } from "../api";
import { NetworkModel } from "./model";

// Закрытый ключ
export const secretKey = "#S3cR3t_K3y#";

// Извлечение токена из куки
const cookieExtractor: JwtFromRequestFunction = function (req): string {
  return req.signedCookies?.token ?? null;
};

export { passport };

export function createAuthRouter(model: NetworkModel): Router {
  const authRouter = Router();

  // Проверка токена пользователя
  passport.use(
    new JwtStrategy(
      {
        jwtFromRequest: cookieExtractor,
        secretOrKey: secretKey,
      },
      (payload: Indexed, done) => {
        done(null, model.getUserData(payload.id) ?? false);
      }
    )
  );

  // Регистрация пользователя
  authRouter.post("/signup", (req, res) => {
    const user = req.body as UserSignUpData;
    const id = model.signUp(user);
    console.log("signup: ", user, id);
    res.status(id ? 200 : 401).end();
  });

  // Вход по email и паролю, устанавливает токен в куки
  authRouter.post("/login", (req, res) => {
    const data = req.body as UserAuthData,
      user = model.authorize(data);
    console.log("login: ", data);
    if (user) {
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
