import axios from "axios";
import { ILoader, IndexedLoader } from "./base";
import {
  config,
  Indexed,
  PersonalData,
  Photo,
  Post,
  Resource,
  Status,
  StatusData,
  UserData,
  UserStatusData,
} from "@/../api";

// Абстрактный загрузчик объектов
export abstract class ObjectLoader<T> implements ILoader, IndexedLoader {
  id: number;
  data: T | null = null;

  constructor(id: number) {
    this.id = id;
  }

  abstract get endpoint(): string;

  get url(): URL {
    return new URL(this.endpoint + `${this.id}/`, config.server);
  }

  async fetch() {
    this.data = (await axios.get<T>(this.url.toString())).data;
  }
}

// Загрузчик пользователя
export class UserLoader extends ObjectLoader<UserData> {
  get endpoint(): string {
    return config.endpoints.user;
  }

  get avatarUrl(): string {
    return new URL(
      config.endpoints.photo + `${this.data?.photoId}`,
      config.server
    ).toString();
  }

  get fullName() {
    return this.data
      ? `${this.data.surname} ${this.data.name} ${this.data.lastName ?? ""}`
      : "";
  }

  updateStatus() {
    return axios.patch<UserStatusData>(this.url.toString(), {
      status: this.data?.status,
      role: this.data?.role,
    } as UserStatusData);
  }

  updatePersonal() {
    return axios.put<PersonalData>(this.url.toString(), {
      name: this.data?.name,
      surname: this.data?.surname,
      lastName: this.data?.lastName,
      birthDate: this.data?.birthDate,
      email: this.data?.email,
    } as PersonalData);
  }
}

// Загрузчик собственного id пользователя
export class SelfLoader {
  readonly self = new URL(config.endpoints.self, config.server);
  id: number | null = null;
  async fetch() {
    this.id = (await axios.get<Indexed>(this.self.toString())).data.id;
  }
}

abstract class ResourceLoader<T extends Resource> extends ObjectLoader<T> {}

// Загрузчик ресурсов
abstract class PublicResourceLoader<
  T extends Resource & StatusData
> extends ResourceLoader<T> {
  updateStatus(s: Status) {
    if (this.data) this.data.status = s;
    return axios.patch<StatusData>(this.url.toString(), {
      status: s,
    } as StatusData);
  }
}

// Загрузчик поста
export class PostLoader extends PublicResourceLoader<Post> {
  get endpoint(): string {
    return config.endpoints.post;
  }
}

// Загрузчик фотографии (достаточно использовать сгенерированный url)
export class PhotoLoader extends ObjectLoader<Blob> {
  get endpoint(): string {
    return config.endpoints.photo;
  }
}

// Загрузчик информации о фотографии
export class PhotoInfoLoader extends PublicResourceLoader<Photo> {
  get endpoint(): string {
    return config.endpoints.photoInfo;
  }
}
