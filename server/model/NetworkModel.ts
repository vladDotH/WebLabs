import {
  PersonalData,
  Photo,
  Post,
  Resource,
  Role,
  Status,
  StatusData,
  User,
  UserAuthData,
  UserData,
  UserSignUpData,
  UserStatusData,
} from "../../api";
import { ModelCollection, nowISO } from "./index";
import fs from "fs/promises";
import path from "path";

// Логика соц сети
export class NetworkModel {
  private users: ModelCollection<User> = new ModelCollection<User>();
  private photos: ModelCollection<Photo> = new ModelCollection<Photo>();
  private posts: ModelCollection<Post> = new ModelCollection<Post>();
  readonly storagePath: string;

  constructor(
    users: User[],
    photos: Photo[],
    posts: Post[],
    storagePath: string
  ) {
    users.forEach((u) => this.users.add(u));
    photos.forEach((p) => this.photos.add(p));
    posts.forEach((p) => this.posts.add(p));
    this.storagePath = storagePath;
  }

  // Регистрация пользователя
  signUp(user: UserSignUpData): number | null {
    if (!this.users.list.find((u) => u.email == user.email))
      return this.users.add({
        id: 0,
        role: Role.USER,
        status: Status.UNCONFIRMED,
        photoId: null,
        friends: [],
        friendsRequests: [],
        name: user.name,
        surname: user.surname,
        lastName: user.lastName,
        birthDate: user.birthDate,
        email: user.email,
        password: user.password,
      });
    else return null;
  }

  // Авторизация
  authorize(data: UserAuthData): User | null {
    const user = this.users.list.find((user) => user.email == data.email);
    if (user && user.password == data.password) return user;
    return null;
  }

  // Обновление статусной информации (роль, статус)
  updateUserStatus(id: number, stat: UserStatusData) {
    const user = this.getUser(id);
    if (user) [user.status, user.role] = [stat.status, stat.role];
  }

  // Обновление персональной информации
  updatePersonal(id: number, data: PersonalData) {
    const user = this.getUser(id);
    if (user)
      [user.surname, user.name, user.lastName, user.email, user.birthDate] = [
        data.surname,
        data.name,
        data.lastName,
        data.email,
        data.birthDate,
      ];
  }

  // Получение объекта пользователя (вместе с паролем)
  private getUser(id: number): User | null {
    return this.users.find(id);
  }

  // Список id пользователей
  getUsers(): number[] {
    return this.users.getIds();
  }

  // Данные пользователя (без пароля)
  getUserData(id: number): UserData | null {
    const user = this.getUser(id);
    return user
      ? ({
          ...user,
          password: undefined,
        } as UserData)
      : null;
  }

  // id друзей пользователя
  getFriends(id: number): number[] | null {
    return this.getUser(id)?.friends ?? null;
  }

  private getItems<T extends Resource>(userId: number, items: T[]): number[] {
    return items.filter((item) => item.userId == userId).map((item) => item.id);
  }

  // Список id постов пользователя
  getPosts(userId: number): number[] {
    return this.getItems(userId, this.posts.list).reverse();
  }

  // Получение поста
  getPost(id: number): Post | null {
    return this.posts.find(id);
  }

  // Добавление поста
  addPost(id: number, text: string, photosId: number[]): number {
    return this.posts.add({
      id: 0,
      text: text,
      userId: id,
      photosId: photosId,
      time: nowISO(),
      status: Status.ACTIVE,
    });
  }

  // Список id фотографий пользователя
  getPhotos(userId: number): number[] {
    return this.getItems(userId, this.photos.list).reverse();
  }

  // Получение фотографии
  getPhoto(id: number): Photo | null {
    return this.photos.find(id);
  }

  // Добавление фотографии
  addPhoto(id: number, path: string): number {
    return this.photos.add({
      id: 0,
      status: Status.ACTIVE,
      time: nowISO(),
      file: path,
      userId: id,
    });
  }

  // Список id постов друзей
  getFriendsPosts(id: number): number[] {
    return (
      this.getUser(id)
        ?.friends.map((user) => this.getPosts(user))
        .flat() ?? []
    ).sort((a, b) => b - a);
  }

  private updateResourceStatus<T extends Resource>(
    res: T | null,
    sd: StatusData
  ) {
    if (res) res.status = sd.status;
  }

  // Обновление статуса поста
  updatePostStatus(id: number, sd: StatusData) {
    this.updateResourceStatus(this.getPost(id), sd);
  }

  // Обновление статуса фотографии
  updatePhotoStatus(id: number, sd: StatusData) {
    this.updateResourceStatus(this.getPhoto(id), sd);
  }

  deletePhoto(id: number) {
    const photo = this.getPhoto(id);
    if (photo) fs.unlink(path.resolve(this.storagePath, photo.file));
    this.photos.remove(id);
  }

  // Обновление фотографии профиля
  updateAvatar(id: number, path: string) {
    const user = this.getUser(id);
    if (user) {
      if (user.photoId) this.deletePhoto(user.photoId);
      user.photoId = this.addPhoto(id, path) ?? user.photoId;
    }
  }

  deleteAvatar(id: number) {
    const user = this.getUser(id);
    if (user?.photoId) {
      this.deletePhoto(user.photoId);
      user.photoId = null;
    }
  }

  // Запрос/принятие дружбы
  friendRequest(id: number, friendId: number) {
    const u1 = this.getUser(id),
      u2 = this.getUser(friendId);
    if (u1 && u2) {
      if (u1.friendsRequests.includes(u2.id)) {
        u1.friendsRequests.splice(u1.friendsRequests.indexOf(u2.id), 1);
        u1.friends.push(u2.id);
        u2.friends.push(u1.id);
      } else {
        u2.friendsRequests.push(u1.id);
      }
    }
  }

  // Отклонение запроса дружбы / удаление из друзей
  friendDecline(id: number, friendId: number) {
    if (id !== friendId) {
      const u1 = this.getUser(id),
        u2 = this.getUser(friendId);
      if (u1 && u2) {
        if (u1.friends.includes(u2.id)) {
          u1.friends.splice(u1.friends.indexOf(u2.id), 1);
          u2.friends.splice(u2.friends.indexOf(u1.id), 1);
        } else if (u1.friendsRequests.includes(u2.id)) {
          u1.friendsRequests.splice(u1.friendsRequests.indexOf(u2.id), 1);
        } else if (u2.friendsRequests.includes(u1.id)) {
          u2.friendsRequests.splice(u2.friendsRequests.indexOf(u1.id), 1);
        }
      }
    }
  }
}
