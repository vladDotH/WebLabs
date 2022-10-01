import { config, RequestType } from "@/../api";
import axios from "axios";

// Контроллер списка книг
export class ListLoader {
  readonly books: number[] = [];

  listUrl(): URL {
    return new URL(config.endpoints.bookList, config.server);
  }

  get addUrl(): string {
    return new URL(config.endpoints.book, config.server).toString();
  }

  // Загрузка списка с заданным фильтром
  async fetch(req: RequestType) {
    const url = this.listUrl();
    url.searchParams.append(config.reqTypeName, req.toString());
    const res = await axios.get<number[]>(url.toString());
    this.books.splice(0, this.books.length, ...res.data);
  }

  // Добавление книги
  async add(book: FormData) {
    const res = await axios.post<number>(this.addUrl, book);
    this.books.unshift(res.data);
  }

  // Удаление книги
  remove(id?: number) {
    const index = id ? this.books.indexOf(id) : -1;
    if (index !== -1) this.books.splice(index, 1);
  }
}
