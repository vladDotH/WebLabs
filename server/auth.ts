import passport from "passport";
import passportLocal from "passport-local";
const localStrategy = passportLocal.Strategy;

export interface UserLocal {
  id: number;
  name: string;
}

// Сохранение пользователя в сессии
passport.serializeUser((user, done) => {
  return done(null, user as UserLocal);
});
// Получение пользователя из сессии
passport.deserializeUser((user: UserLocal, done) => {
  done(null, user);
});

const id = 0;
// Данные для входа
const name = "admin";
const passwd = "admin_password";

// Аутентификация
passport.use(
  new localStrategy((user, password, done) => {
    console.log(user, password);
    if (user !== name) return done(null, false);
    else if (password !== passwd) return done(null, false);

    return done(null, { id: id, name: name } as UserLocal);
  })
);

export default passport;
