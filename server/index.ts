// import express from "express";
// import bodyParser from "body-parser";
// import cors from "cors";
// import multer from "multer";
// import fs from "fs";
// import passport from "passport";
//
// const upload = multer({ dest: "uploads/" });
// const app = express();
//
// const port = 3000;
// const corsOptions = {
//   origin: "http://localhost:8080",
// };
//
// app.use(cors(corsOptions));
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
//
// app.get("/api/img", (req, res) => {
//   res.writeHead(200, {
//     "Content-Type": "image/webp",
//     "Content-Length": 0,
//   });
//   res.end();
//   // const readStream = fs.createReadStream("uploads/img.webp");
//   // readStream.pipe(res);
// });
//
// app.post("/api", upload.single("file"), (req, res) => {
//   console.log(req.body);
//   console.log(req.file);
//   // const data = req.body
//   res.send("Responsed successfully");
// });
//
// app.listen(port, () => {
//   console.log("App is running at http://localhost:%d", port);
// });

import express from "express";
import session from "express-session";
import cors from "cors";
import multer from "multer";
import passport from "./auth";

const app = express();

const host = "127.0.0.1";
const port = 3000;
const corsOptions = {
  origin: "http://localhost/",
};
const upload = multer();

// Установка служебных middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({ secret: "@s3cR3t_K3y", resave: true, saveUninitialized: false })
);
app.use(passport.initialize());
app.use(passport.session());

app.get("/login", (req, res) => {
  console.log("login get");
  res.send("Login page. Please, authorize.");
});

app.post("/login", passport.authenticate("local", {}), (req, res) => {
  console.log("login post");
  console.log(req.body);
  console.log(req.user);
  res.json({ name: "pirodr", id: 1 });
});

// Проверка авторизации
app.use((req, res, next) => {
  if (req.user) next();
  else res.sendStatus(401);
});

// Получение списка id книг
app.get("/api/books", (req, res) => {
  console.log("books");
  res.send("Home page. You're authorized.");
});

// Получение информации о книге
app.get("/api/book/:id", (req, res) => {
  console.log("book + ", req.params.id);
  res.send("Home page. You're authorized.");
});

// Добавление книги
app.post("/api/book", (req, res) => {
  console.log("post book");
  res.send("Home page. You're authorized.");
});

// Обновление книги
app.put("/book/:id", (req, res) => {
  console.log("put book + ", req.params.id);
  res.send("Home page. You're authorized.");
});

app.listen(port, host, function () {
  console.log(`Server started at http://${host}:${port}`);
});
