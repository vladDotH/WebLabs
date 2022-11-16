import { config, Indexed, Role, UserAuthData, UserSignUpData } from "../../api";
import axios from "axios";
import { UserLoader } from "@/util/loaders/dataLoaders";

export class UserController {
  readonly self = new URL(config.endpoints.self, config.server);
  id: number | null = null;
  loader: UserLoader | null = null;

  async fetchId() {
    this.id = (await axios.get<Indexed>(this.self.toString())).data.id;
    this.loader = new UserLoader(this.id);
  }

  get isAdmin(): boolean {
    return this.loader?.data?.role === Role.ADMIN;
  }

  static readonly signUpUrl = new URL(config.endpoints.signUp, config.server);
  static async signUp(user: UserSignUpData): Promise<boolean> {
    try {
      await axios.post<Indexed>(this.signUpUrl.toString(), user);
      return true;
    } catch (err) {
      return false;
    }
  }

  static readonly loginUrl = new URL(config.endpoints.login, config.server);
  static async login(user: UserAuthData): Promise<boolean> {
    try {
      await axios.post<Indexed>(this.loginUrl.toString(), user);
      return true;
    } catch (err) {
      return false;
    }
  }

  static readonly avatarUrl = new URL(config.endpoints.avatar, config.server);
  async updateAvatar(file: File) {
    const fd = new FormData();
    fd.append("avatar", file);
    await axios.put(UserController.avatarUrl.toString(), fd);
  }

  async deleteAvatar() {
    await axios.delete(UserController.avatarUrl.toString());
  }

  getFriendUrl(id: number): URL {
    return new URL(config.endpoints.friend + id, config.server);
  }

  async requestFriend(loader: UserLoader) {
    await axios.post(this.getFriendUrl(loader.id).toString());
    await this.loader?.fetch();
    await loader.fetch();
  }

  async declineFriend(loader: UserLoader) {
    await axios.delete(this.getFriendUrl(loader.id).toString());
    await this.loader?.fetch();
    await loader.fetch();
  }

  // makePost() {}
}
