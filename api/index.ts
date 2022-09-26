export interface Holder {
  holder: string | null;
  returnDate: string | null;
}

export function expired(holder: Holder): boolean {
  return holder.returnDate != null && new Date() > new Date(holder.returnDate);
}

export interface BookData {
  id?: number;
  title: string;
  author: string;
  year: number;
}

export interface BookSchema extends Holder, BookData {}

export interface Book extends BookSchema {
  cover?: string;
}

export enum RequestType {
  ALL,
  AVAILABLE,
  EXPIRED,
}

export const config = {
  serverHost: "localhost",
  server: "http://localhost:3000/api/",
  client: "http://localhost:8080",
  reqTypeName: "type",
  endpoints: {
    login: "login/",
    bookList: "books/",
    covers: "covers/",
    book: "book/",
  },
};

export interface User {
  login: string;
  pwd: string;
}
