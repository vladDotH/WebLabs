import { beforeEach, describe, expect, test } from "@jest/globals";
import { load, NetworkModel } from "../server/model";
import * as _ from "lodash";
import {
  PersonalData,
  Photo,
  Post,
  Role,
  Status,
  UserStatusData,
  User,
  StatusData,
} from "../api";

const storagePath = "./storage",
  users = load("users.json", storagePath) as User[],
  photos = load("photos.json", storagePath) as Photo[],
  posts = load("posts.json", storagePath) as Post[];

let model: NetworkModel | null = null;

describe("Тестирование модели соц.сети", () => {
  beforeEach(() => {
    model = new NetworkModel(users, photos, posts, storagePath);
  });

  test("Регистрация", () => {
    expect(
      model?.signUp({
        name: "Игорь",
        surname: "Летов",
        lastName: "Фёдорович",
        birthDate: "10.09.1964",
        email: "igor@mail.ru",
        password: "pryg_skok",
      })
    ).toBe(9);
  });

  test("Регистрация существующего пользователя", () => {
    expect(
      model?.signUp({
        name: "Владислав",
        surname: "Болкунов",
        lastName: "Олегович",
        birthDate: "08.10.2002",
        email: "vladbolkunovv@gmail.com",
        password: "vladik",
      })
    ).toBe(null);
  });

  test("Авторизация", () => {
    expect(
      model?.authorize({ email: "vladbolkunovv@gmail.com", password: "vladik" })
    ).not.toBe(null);
  });

  test("Некорректная авторизация", () => {
    expect(
      model?.authorize({
        email: "vladbolkunovv@gmail.com",
        password: "password",
      })
    ).toBe(null);
  });

  test("Обновление статусной информации", () => {
    model?.updateUserStatus(7, { role: Role.ADMIN, status: Status.BLOCKED });
    const user = model?.getUserData(7);
    expect({
      status: user?.status,
      role: user?.role,
    } as UserStatusData).toEqual({
      status: Status.BLOCKED,
      role: Role.ADMIN,
    } as UserStatusData);
  });

  test("Обновление персональной информации", () => {
    const data: PersonalData = {
      name: "Илья",
      surname: "Комаров",
      lastName: "Владимирович",
      email: "example@mail.com",
      birthDate: "1970-01-01",
    };
    model?.updatePersonal(7, data);
    const user = model?.getUserData(7);
    expect({
      name: user?.name,
      surname: user?.surname,
      lastName: user?.lastName,
      email: user?.email,
      birthDate: user?.birthDate,
    } as PersonalData).toEqual(data);
  });

  test("Список id пользователей", () => {
    expect(model?.getUsers()).toEqual(_.range(1, 9));
  });

  test("Получение данных пользователя", () => {
    const user = model?.getUserData(7);
    expect(user).toEqual({
      id: 7,
      name: "Владислав",
      surname: "Болкунов",
      lastName: "Олегович",
      email: "vladbolkunovv@gmail.com",
      birthDate: "2002-10-08",
      status: 0,
      role: 0,
      friends: [2, 6, 8],
      friendsRequests: [],
      photoId: 14,
    });
  });

  test("Список друзей пользователя", () => {
    expect(model?.getFriends(7)).toEqual([2, 6, 8]);
  });

  test("Список постов пользователя", () => {
    expect(model?.getPosts(7)).toEqual([3, 2]);
  });

  test("Получение поста", () => {
    expect(model?.getPost(2)).toEqual({
      id: 2,
      userId: 7,
      text: "We are anonymous.",
      photosId: [4],
      status: 2,
      time: "2020-06-23T15:30:30",
    } as Post);
  });

  test("Добавление поста", () => {
    expect(model?.addPost(2, "Post text", [1, 2, 3])).toBe(8);
  });

  test("Список фотографий пользователя", () => {
    expect(model?.getPhotos(7)).toEqual([14, 7, 5, 4]);
  });

  test("Получение фото", () => {
    expect(model?.getPhoto(5)).toEqual({
      id: 5,
      userId: 7,
      file: "5.jpg",
      status: 2,
      time: "2020-06-20T12:30:30",
    } as Photo);
  });

  test("Добавление фото", () => {
    expect(model?.addPhoto(2, "path")).toBe(15);
  });

  test("Список постов друзей", () => {
    expect(model?.getFriendsPosts(7)).toEqual([6, 5]);
  });

  test("Обновление статуса поста", () => {
    model?.updatePostStatus(3, { status: Status.BLOCKED });
    const post = model?.getPost(3);
    expect({ status: post?.status } as StatusData).toEqual({
      status: 2,
    } as StatusData);
  });

  test("Обновление статуса фото", () => {
    model?.updatePhotoStatus(4, { status: Status.BLOCKED });
    const photo = model?.getPhoto(4);
    expect({ status: photo?.status } as StatusData).toEqual({
      status: 2,
    } as StatusData);
  });

  test("Принятие дружбы", () => {
    model?.friendRequest(4, 7);
    const u1 = model?.getUserData(4),
      u2 = model?.getUserData(7);
    expect(u1?.friends?.includes(7) && u2?.friends?.includes(4)).toBe(true);
  });

  test("Удаление из друзей", () => {
    model?.friendDecline(7, 6);
    const u1 = model?.getUserData(7),
      u2 = model?.getUserData(6);
    expect(!u1?.friends?.includes(6) && !u2?.friends?.includes(7)).toBe(true);
  });

  test("Запрос дружбы", () => {
    model?.friendRequest(7, 1);
    const u = model?.getUserData(1);
    expect(u?.friendsRequests?.includes(7)).toBe(true);
  });

  test("Отклонение запроса", () => {
    model?.friendDecline(1, 6);
    const u = model?.getUserData(1);
    expect(!u?.friendsRequests?.includes(6)).toBe(true);
  });
});
