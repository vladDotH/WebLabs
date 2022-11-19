// Роли пользователей
import { EventsMap } from "socket.io/dist/typed-events";

export enum Role {
  // Пользователь
  USER,
  // Администратор
  ADMIN,
}

// Статус пользователя / ресурса
export enum Status {
  // Активный
  ACTIVE,
  // Неподтверждённый
  UNCONFIRMED,
  // Заблокированный
  BLOCKED,
}

// Индексируемый объект
export interface Indexed {
  id: number;
}

// Объект со статусом
export interface StatusData {
  status: Status;
}

// Статусные данные пользователя
export interface UserStatusData extends StatusData {
  role: Role;
}

// Персональные данные пользователя
export interface PersonalData {
  surname: string;
  name: string;
  lastName: string;
  email: string;
  birthDate: string;
}

// Данные пользователя соц. сети
export interface UserData extends Indexed, UserStatusData, PersonalData {
  friends: number[];
  friendsRequests: number[];
  photoId: number | null;
}

// Объект пользователя на сервере
export interface User extends UserData {
  password: string;
}

// Объект ресурса (фотография/пост)
export interface Resource extends Indexed, StatusData {
  userId: number;
  time: string;
}

// Фотография
export interface Photo extends Resource {
  file: string;
}

// Новость
export interface Post extends Resource {
  text: string;
  photosId: number[];
}

// Авторизационные данные
export interface UserAuthData {
  email: string;
  password: string;
}

// Данные для регистрации
export interface UserSignUpData extends PersonalData, UserAuthData {}

// Настройки клиент-серверного взаимодействия
export const config = {
  // Адрес хоста сервера
  serverHost: "localhost",
  // Адрес вебсокета
  webSocket: "http://localhost:3000/",
  // Адрес api
  server: "http://localhost:3000/api/",
  // Адрес клиентского приложения
  client: "http://localhost:8080",
  // Точки запросов
  endpoints: {
    // Получение пользователем своего объекта пользователя
    self: "self/",
    // Вход в систему
    login: "login/",
    // Регистрация
    signUp: "signup/",
    // Список всех пользователей
    usersList: "users/",
    // Информация о пользователе (по id)
    user: "user/",
    // Загрузка фотографии профиля
    avatar: "avatar/",
    // Список id постов пользователя
    postsList: "posts/",
    // Получение / публикация поста
    post: "post/",
    // Список id фотографий пользователя
    photosList: "photos/",
    // Получение фотографии
    photo: "photo/",
    // Информация о фотографии
    photoInfo: "photoinfo/",
    // Список id друзей пользователя
    friends: "friends/",
    // Список id постов друзей
    friendsPosts: "friendsposts/",
    // Управление друзьями
    friend: "friend/",
  },
};

// События отправляемые сервером по Вебсокету
export interface ServerToClientEvents {
  post: (user: UserData) => void;
}

export type ClientToServerEvents = EventsMap;
