// Информация о пользователе библиотеки (кто берёт книги)
export interface Holder {
  holder: string | null;
  returnDate: string | null;
}

// Функция проверки сроки сдачи книги
export function expired(holder: Holder): boolean {
  return holder.returnDate != null && new Date() > new Date(holder.returnDate);
}

// Основная информация о книге
export interface BookData {
  id?: number;
  title: string;
  author: string;
  year: number;
}

// Вся информация о книге (отправляется клиенту)
export interface BookSchema extends Holder, BookData {}

// Информация о книге дополненная название файла обложки (хранится на сервере)
export interface Book extends BookSchema {
  cover?: string;
}

// Тип выбора списка книг
export enum RequestType {
  ALL,
  AVAILABLE,
  EXPIRED,
}

// Настройки клиент-серверного взаимодействия
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

// Данные для входа
export interface User {
  login: string;
  pwd: string;
}
