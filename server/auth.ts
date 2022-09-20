import passport from "passport";
import passportLocal from "passport-local";
const localStrategy = passportLocal.Strategy;

export interface UserLocal {
  id: number;
  name: string;
}

// Сохранение пользователя в сессии
passport.serializeUser((user, done) => {
  console.log("serialize: ", user);
  return done(null, user as UserLocal);
});
// Получение пользователя из сессии
passport.deserializeUser((user: UserLocal, done) => {
  console.log("deserialize: ", user);
  return done(null, user);
});

const id = 0;
// Данные для входа
const name = "admin";
const passwd = "admin";

// Аутентификация
passport.use(
  new localStrategy((user, password, done) => {
    console.log("auth: ", user, password);
    if (user !== name) return done(null, false);
    else if (password !== passwd) return done(null, false);
    console.log("auth success: ", user, password);
    return done(null, { id: id, name: name } as UserLocal);
  })
);

export default passport;
