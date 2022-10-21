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
} from "../api";

// Логика соц сети
export class Controller {
  private users: User[] = [];
  private photos: Photo[] = [];
  private posts: Post[] = [];

  constructor(users: User[], photos: Photo[], posts: Post[]) {
    this.users = users;
    this.photos = photos;
    this.posts = posts;
  }

  authorize(data: UserAuthData): User | null {
    const user = this.users.find((user) => user.email == data.email);
    if (user && user.password == data.password) return user;
    return null;
  }

  updateUserStatus(id: number, stat: UserStatusData) {
    const user = this.getUser(id);
    if (user) [user.status, user.role] = [stat.status, stat.role];
  }

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

  private getUser(id: number): User | null {
    return this.users.find((user) => user.id == id) ?? null;
  }

  getUsers(): number[] {
    return this.users.map((user) => user.id);
  }

  getUserData(id: number): UserData | null {
    const user = this.getUser(id);
    return user
      ? ({
          ...user,
          password: undefined,
        } as UserData)
      : null;
  }

  getFriends(id: number): number[] | null {
    return this.getUser(id)?.friends ?? null;
  }

  private getItems<T extends Resource>(userId: number, items: T[]): number[] {
    return items.filter((item) => item.userId == userId).map((item) => item.id);
  }

  private getItem<T extends Resource>(id: number, items: T[]): T | null {
    return items.find((item) => item.id == id) ?? null;
  }

  getPosts(userId: number): number[] {
    return this.getItems(userId, this.posts);
  }

  getPost(id: number): Post | null {
    return this.getItem(id, this.posts);
  }

  getPhotos(userId: number): number[] {
    return this.getItems(userId, this.photos);
  }

  getPhoto(id: number): Photo | null {
    return this.getItem(id, this.photos);
  }

  getFriendsPosts(id: number): number[] {
    return (
      this.getUser(id)
        ?.friends.map((user) => this.getPosts(user))
        .flat() ?? []
    );
  }

  private updateResourceStatus(res: Resource | null, sd: StatusData) {
    if (res) res.status = sd.status;
  }

  updatePostStatus(id: number, sd: StatusData) {
    this.updateResourceStatus(this.getPost(id), sd);
  }

  updatePhotoStatus(id: number, sd: StatusData) {
    this.updateResourceStatus(this.getPhoto(id), sd);
  }
}
