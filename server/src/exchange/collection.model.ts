import { Indexed } from "@api";

export class CollectionModel<T extends Indexed> {
  readonly list: T[] = [];
  private id = 1;

  add(obj: T): number {
    this.list.push({ ...obj, id: this.id });
    return this.id++;
  }

  find(id: number): T | null {
    return this.list.find((obj) => obj.id === id) ?? null;
  }

  remove(id: number) {
    const i = this.list.findIndex((e) => e.id === id);
    if (i !== -1) this.list.splice(i, 1);
  }

  getIds(): number[] {
    return this.list.map((obj) => obj.id!);
  }
}
