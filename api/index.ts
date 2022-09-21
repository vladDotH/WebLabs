export interface Holder {
  holder: string | null;
  returnDate: string | null;
}

export interface BookData {
  id?: number;
  title: string;
  author: string;
  year: number;
  cover?: string;
}

export interface Book extends Holder, BookData {}

export enum RequestType {
  ALL,
  AVAILABLE,
  EXPIRED,
}

export const config = {
  server: "http://localhost:3000/api/",
  client: "http://localhost:8080/",
  reqTypeName: "type",
  endpoints: {
    bookList: "books/",
    covers: "covers/",
    book: "book/",
  },
};

export const BookTemplate: Book = {
  title: "<Название>",
  author: "<Автор>",
  year: 1970,
  holder: null,
  returnDate: null,
};
