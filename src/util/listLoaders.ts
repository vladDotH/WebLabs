import { config } from "@/../api";
import axios from "axios";
import { ILoader, IndexedLoader } from "./base";

// Абстрактный загрузчик списка
export abstract class ListLoader implements ILoader {
  readonly list: number[] = [];

  abstract get url(): URL;

  async fetch() {
    if (this.url)
      this.list.splice(
        0,
        this.list.length,
        ...(await axios.get<number[]>(this.url.toString())).data
      );
  }
}

// Загрузчик списка пользователей
export class UsersListLoader extends ListLoader {
  get url(): URL {
    return new URL(config.endpoints.usersList, config.server);
  }
}

// Абстрактный загрузчик списков данных пользователя
abstract class UserDataListLoader extends ListLoader implements IndexedLoader {
  readonly id: number;

  constructor(id: number) {
    super();
    this.id = id;
  }

  abstract get endpoint(): string;

  get url(): URL {
    return new URL(
      config.endpoints.user + `${this.id}/` + this.endpoint,
      config.server
    );
  }
}

// Загрузчик списка постов пользователя
export class PostsLoader extends UserDataListLoader {
  get endpoint(): string {
    return config.endpoints.postsList;
  }
}

// Загрузчик списка фотографий пользователя
export class PhotosLoader extends UserDataListLoader {
  get endpoint(): string {
    return config.endpoints.photosList;
  }
}

// Загрузчик списка друзей пользователя
export class FriendsLoader extends UserDataListLoader {
  get endpoint(): string {
    return config.endpoints.friends;
  }
}

// Загрузчик списка запросов в друзья
export class FriendsRequestsLoader extends UserDataListLoader {
  get endpoint(): string {
    return config.endpoints.friendsRequests;
  }
}

// Загрузчик постов друзей пользователя
export class FriendsPostsLoader extends PostsLoader {
  get endpoint(): string {
    return config.endpoints.friendsPosts;
  }
}
