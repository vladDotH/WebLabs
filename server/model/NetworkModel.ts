import {
  PersonalData,
  Photo,
  Post,
  UserStatusData,
  User,
  UserData,
  Resource,
  StatusData,
  UserAuthData,
  Message,
} from "../../api";
import { Model } from "./index";
import _ from "lodash";

// Логика соц сети
export class NetworkModel {
  private users: Model<User> = new Model<User>();
  private photos: Model<Photo> = new Model<Photo>();
  private posts: Model<Post> = new Model<Post>();
  private messages: Model<Message> = new Model<Message>();

  constructor(
    users: User[],
    photos: Photo[],
    posts: Post[],
    messages: Message[]
  ) {
    users.forEach((u) => this.users.add(u));
    photos.forEach((p) => this.photos.add(p));
    posts.forEach((p) => this.posts.add(p));
    messages.forEach((m) => this.messages.add(m));
  }

  // Регистрация пользователя
  signIn(user: User): number | null {
    if (!this.users.list.find((u) => u.email == user.email))
      return this.users.add(user);
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
  updatePersonal(id: number, stat: PersonalData) {
    const user = this.getUser(id);
    if (user)
      [user.surname, user.name, user.lastName, user.email, user.birthDate] = [
        stat.surname,
        stat.name,
        stat.lastName,
        stat.email,
        stat.birthDate,
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

  private getItem<T extends Resource>(id: number, items: T[]): T | null {
    return items.find((item) => item.id == id) ?? null;
  }

  // Список id постов пользователя
  getPosts(userId: number): number[] {
    return this.getItems(userId, this.posts.list);
  }

  // Получение поста
  getPost(id: number): Post | null {
    return this.posts.find(id);
  }

  // Добавление поста
  addPost(post: Post): number {
    return this.posts.add(post);
  }

  // Список id фотографий пользователя
  getPhotos(userId: number): number[] {
    return this.getItems(userId, this.photos.list);
  }

  // Получение фотографии
  getPhoto(id: number): Photo | null {
    return this.photos.find(id);
  }

  // Добавление фотографии
  addPhoto(photo: Photo): number {
    return this.photos.add(photo);
  }

  // Список id постов друзей
  getFriendsPosts(id: number): number[] {
    return (
      this.getUser(id)
        ?.friends.map((user) => this.getPosts(user))
        .flat() ?? []
    );
  }

  private updateResourceStatus<T extends StatusData>(
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

  // Список id пользователей у которых есть чат с пользователем (есть сообщения)
  getChatsSources(userId: number): number[] {
    return Object.keys(
      _.groupBy(
        this.messages.list.filter(
          (msg) => msg.userId == userId || msg.destId == userId
        ),
        (msg) => (msg.userId == userId ? msg.destId : userId)
      )
    ).map((key) => parseInt(key));
  }

  // Список id сообщений в чате между пользователями
  getChatMessages(userId: number, companionId: number): number[] {
    return this.messages.list
      .filter(
        (msg) =>
          (msg.userId == userId && msg.destId == companionId) ||
          (msg.userId == companionId && msg.destId == userId)
      )
      .map((msg) => msg.id);
  }

  // Получение сообщения
  getMessage(id: number) {
    return this.messages.find(id);
  }

  // Добавление сообщения
  addMessage(msg: Message) {
    this.messages.add(msg);
  }
}
