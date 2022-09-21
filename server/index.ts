import express from "express";
// import session from "express-session";
import cors from "cors";
import fs from "fs";
import path from "path";
import multer from "multer";
// import passport from "./auth";
import { Library } from "./library";
import { Book, BookData, Holder, RequestType } from "@/../api";

const app = express();

const host = "127.0.0.1";
const port = 3000;
const corsOptions = {
  origin: "http://localhost:8080",
};
const storagePath = "./storage";
const upload = multer({ dest: storagePath });

const library = new Library(
  JSON.parse(
    fs.readFileSync(path.resolve(storagePath, "library.json"), "utf-8")
  ) as Book[]
);

// Установка служебных middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use(
//   session({ secret: "@s3cR3t_K3y", resave: true, saveUninitialized: false })
// );
// app.use(passport.initialize());
// app.use(passport.session());

// app.get("/api/login", (req, res) => {
//   console.log("login get");
//   res.send("Login page. Please, authorize.");
// });
//
// app.post("/api/login", (req, res) => {
//   console.log("login post");
//   console.log(req.body);
//   res.json({ name: "admin", id: 1 });
// });

// // Проверка авторизации
// app.use((req, res, next) => {
//   console.log("check: ", req.user);
//   if (req.user) next();
//   else res.sendStatus(401);
// });

// Получение списка id книг
app.get("/api/books", (req, res) => {
  console.log("get books", req.query.type);
  res.json(
    library.getAll(parseInt((req.query.type ?? "0") as string) as RequestType)
  );
});

// Получение информации о книге
app.get("/api/book/:id", (req, res) => {
  console.log("get book + ", req.params.id);
  const id = parseInt(req.params.id);
  res.json(library.get(id));
});

// Обложки книг
app.use("/api/covers", express.static(storagePath));

// Добавление книги
app.post("/api/book", upload.single("cover"), (req, res) => {
  console.log("post book", req.file);
  console.log("body: ", req.body);
  const book = req.body as Book;
  console.log(book);
  book.cover = req.file?.filename;
  res.json(library.add(book));
});

// Обновление книги
app.put("/api/book/:id", upload.single("cover"), (req, res) => {
  console.log("put book + ", req.params.id, req.file);
  const id = parseInt(req.params.id),
    book = req.body as BookData,
    storedBook = library.get(id);
  book.cover = req.file?.filename;

  if (storedBook) {
    // Удаление предыдущей обложки
    if (book.cover) {
      if (storedBook.cover)
        fs.unlink(path.resolve(storagePath, storedBook.cover), (err) => {
          console.log("Cover deleting error", err);
        });
      storedBook.cover = book.cover;
    }
    [storedBook.title, storedBook.author, storedBook.year] = [
      book.title,
      book.author,
      book.year,
    ];
  }

  res.send("Book updated");
});

// Выдача/возврат книги
app.patch("/api/book/:id", (req, res) => {
  const data = req.body as Holder;
  const id = parseInt(req.params.id),
    book = library.get(id);
  if (book) {
    book.holder = data.holder;
    book.returnDate = data.returnDate;
  }
  res.sendStatus(200);
});

// Удаление книги
app.delete("/api/book/:id", (req, res) => {
  console.log("delete book + ", req.params.id);
  const id = parseInt(req.params.id);
  const book = library.get(id);
  if (book) {
    if (book.cover)
      fs.unlink(path.resolve(storagePath, book.cover), (err) => {
        console.log("Cover deleting error", err);
      });
    library.delete(id);
  }
  res.send("Book deleted");
});

app.listen(port, host, function () {
  console.log(`Server started at http://${host}:${port}`);
});
