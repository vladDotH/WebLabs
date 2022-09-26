import passport from "passport";
import { JwtFromRequestFunction, Strategy as JwtStrategy } from "passport-jwt";
import { Router } from "express";
import jwt from "jsonwebtoken";
import { User } from "../api";

export const authRouter = Router();

// Данные для входа
const admin: User = {
  login: "admin",
  pwd: "admin",
};

// Закрытый ключ
export const secretKey = "#S3cR3t_K3y#";

// Извлечение токена из куки
const cookieExtractor: JwtFromRequestFunction = function (req): string {
  return req.signedCookies?.token ?? null;
};

// Проверка токена
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: cookieExtractor,
      secretOrKey: secretKey,
    },
    (payload, done) => {
      done(null, { name: admin.login });
    }
  )
);

// Вход по логину и паролю, устанавливает токен в куки
authRouter.post("/login", (req, res) => {
  const data = req.body as User;
  console.log(data);
  if (data.login == admin.login && data.pwd == admin.pwd) {
    const token = jwt.sign({ name: admin.login }, secretKey, {
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

export default passport;
