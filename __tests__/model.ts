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
} from "../api";

const storagePath = "./storage";
let model: NetworkModel | null = null;

describe("Тестирование модели соц.сети", () => {
  beforeEach(() => {
    model = new NetworkModel(
      load("users.json", storagePath),
      load("photos.json", storagePath),
      load("posts.json", storagePath),
      storagePath
    );
  });

  test("Регистрация", () => {
    expect(
      model?.signUp({
        name: "Игорь",
        surname: "Летов",
        lastName: "Фёдорович",
        birthDate: "10.09.1964",
        email: "igor@mail.ru",
        password: "moya_oborona",
      })
    ).toBe(9);
  });

  test("Авторизация", () => {
    expect(
      model?.authorize({ email: "vladbolkunovv@gmail.com", password: "vladik" })
    ).not.toBe(null);
  });

  test("Обновление статусной информации", () => {
    model?.updateUserStatus(7, { role: Role.ADMIN, status: Status.BLOCKED });
    const user = model?.getUserData(7);
    expect({
      status: user?.status,
      role: user?.role,
    } as UserStatusData).toStrictEqual({
      status: Status.BLOCKED,
      role: Role.ADMIN,
    } as UserStatusData);
  });

  test("Обновление персональной информации", () => {
    model?.updatePersonal(7, {
      name: "Илья",
      surname: "Комаров",
      lastName: "Владимирович",
      email: "example@mail.com",
      birthDate: "1970-01-01",
    });
    const user = model?.getUserData(7);
    expect({
      name: user?.name,
      surname: user?.surname,
      lastName: user?.lastName,
      email: user?.email,
      birthDate: user?.birthDate,
    } as PersonalData).toStrictEqual({
      name: "Илья",
      surname: "Комаров",
      lastName: "Владимирович",
      email: "example@mail.com",
      birthDate: "1970-01-01",
    } as PersonalData);
  });

  test("Список id пользователей", () => {
    expect(model?.getUsers()).toStrictEqual(_.range(1, 9));
  });

  test("Получение данных пользователя", () => {
    const user = model?.getUserData(7);
    expect(user).toStrictEqual({
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
      password: undefined,
    });
  });

  test("Список друзей пользователя", () => {
    expect(model?.getFriends(7)).toStrictEqual([2, 6, 8]);
  });

  test("Список постов пользователя", () => {
    expect(model?.getPosts(7)).toStrictEqual([3, 2]);
  });

  test("Получение поста", () => {
    expect(model?.getPost(2)).toStrictEqual({
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
    expect(model?.getPhotos(7)).toStrictEqual([14, 7, 5, 4]);
  });

  test("Получение фото", () => {
    expect(model?.getPhoto(5)).toStrictEqual({
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
    expect(model?.getFriendsPosts(7)).toStrictEqual([6, 5]);
  });

  // test("Обновление статуса поста", () => {});
  // test("Обновление статуса фото", () => {});
  // test("Удаление фотографи", () => {});
  // test("Обновление фотографии профиля", () => {});
  // test("Удаление фотографии профиля", () => {});
  // test("Запрос/Принятие дружбы", () => {});
  // test("Отклонение запроса/удаление из друзей", () => {});
});
