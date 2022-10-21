// Роли пользователей
export enum Role {
  USER,
  ADMIN,
}

// Статус пользователя / ресурса
export enum Status {
  ACTIVE,
  UNCONFIRMED,
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

export interface Photo extends Resource {
  file: string;
}

export interface Post extends Resource {
  text: string;
  photosId: number[];
}

// Авторизационные данные
export interface UserAuthData {
  email: string;
  password: string;
}

// Настройки клиент-серверного взаимодействия
export const config = {
  serverHost: "localhost",
  server: "http://localhost:3000/api/",
  client: "http://localhost:8080",
  endpoints: {
    login: "login/",
    usersList: "users/",
    user: "user/",
    avatar: "avatar/",
    postsList: "posts/",
    post: "post/",
    photosList: "photos/",
    photo: "photo/",
    photoInfo: "photoinfo/",
    friends: "friends/",
    friendsPosts: "friendsposts/",
  },
};
