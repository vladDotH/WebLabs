import { Router } from "express";
import { Book, BookData, BookSchema, Holder, RequestType } from "../api";
import path from "path";
import fs from "fs";
import { Library } from "./Library";
import multer from "multer";

export const storagePath = "./storage";
export const uploader = multer({ dest: storagePath });

const library = new Library(
  JSON.parse(
    fs.readFileSync(path.resolve(storagePath, "library.json"), "utf-8")
  ) as BookSchema[]
);

export const libRouter = Router();

// Получение списка id книг
libRouter.get("/books", (req, res) => {
  res.json(
    library.getAll(parseInt((req.query.type ?? "0") as string) as RequestType)
  );
});

// Обложки книг
libRouter.get("/covers/:id", (req, res) => {
  const book = library.get(parseInt(req.params.id));
  if (book?.cover) res.download(path.resolve(storagePath, book.cover));
  else res.sendStatus(204);
});

// Добавление книги
libRouter.post("/book", uploader.single("cover"), (req, res) => {
  const book = req.body as BookData;
  res.json(
    library.add({
      ...book,
      cover: req.file?.filename,
      holder: null,
      returnDate: null,
    } as Book)
  );
});

// Действия с книгой
libRouter
  .route("/book/:id")
  .all((req, res, next) => {
    res.locals.book = library.get(parseInt(req.params.id));
    next();
  })
  // Получение информации о книге
  .get((req, res) => {
    res.json({ ...res.locals.book, cover: undefined } as BookSchema);
  })
  // Обновление книги
  .put(uploader.single("cover"), (req, res) => {
    const cover = req.file?.filename,
      book = req.body as BookData;

    if (res.locals.book) {
      if (cover) {
        // Удаление предыдущей обложки
        if (res.locals.book.cover)
          fs.unlink(path.resolve(storagePath, res.locals.book.cover), (err) => {
            if (err) console.log("Cover deleting error", err);
          });
        res.locals.book.cover = cover;
      }
      [res.locals.book.title, res.locals.book.author, res.locals.book.year] = [
        book.title,
        book.author,
        book.year,
      ];
      res.sendStatus(200);
    } else {
      res.sendStatus(204);
    }
  })
  // Выдача/возврат книги
  .patch((req, res) => {
    const data = req.body as Holder;
    if (res.locals.book) {
      [res.locals.book.holder, res.locals.book.returnDate] = [
        data.holder,
        data.returnDate,
      ];
      res.sendStatus(200);
    } else {
      res.sendStatus(204);
    }
  })
  // Удаление книги
  .delete((req, res) => {
    if (res.locals.book) {
      if (res.locals.book.cover)
        fs.unlink(path.resolve(storagePath, res.locals.book.cover), (err) => {
          console.log(`Cover ${res.locals.book.id} deleting error`, err);
        });
      library.delete(res.locals.book.id);
      res.sendStatus(200);
    } else {
      res.sendStatus(204);
    }
  });
