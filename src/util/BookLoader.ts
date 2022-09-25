import axios from "axios";
import { Book, BookData, BookSchema, config, Holder } from "@/../api";

/* Класс-контроллер для книг, осуществляет загрузку и выгрузку данных о книге
 (при использовании в компонентах поле book становится реактивным)*/
export class BookLoader {
  readonly id: number;
  book: Book | null = null;

  constructor(id: number) {
    this.id = id;
  }

  get url() {
    return new URL(config.endpoints.book + this.id, config.server).toString();
  }

  get coverUrl() {
    return new URL(config.endpoints.covers + this.id, config.server).toString();
  }

  async fetch() {
    this.book = {
      ...(await axios.get<BookSchema>(this.url)).data,
      cover:
        (await axios.head(this.coverUrl)).status == 200
          ? this.coverUrl
          : undefined,
    } as Book;
  }

  async deleteBook() {
    if (this.book) {
      await axios.delete(this.url.toString());
      this.book = null;
    }
  }

  // Обновление информации о клиенте (кто взял)
  async patchBook(data: Holder) {
    if (this.book) {
      await axios.patch(this.url.toString(), data);
      [this.book.holder, this.book.returnDate] = [data.holder, data.returnDate];
    }
  }

  // Обновление информации о самой книге
  async putBook(bd: BookData, cover: File | null) {
    if (this.book) {
      const form = new FormData();
      if (this.book) {
        form.append("title", bd.title);
        form.append("author", bd.author);
        form.append("year", bd.year.toString());
        if (cover) {
          form.append("cover", cover);
        }
      }
      await axios.put(this.url.toString(), form);
      [this.book.title, this.book.author, this.book.year, this.book.cover] = [
        bd.title,
        bd.author,
        bd.year,
        (await axios.head(this.coverUrl)).status == 200
          ? this.coverUrl
          : undefined,
      ];
    }
  }
}
