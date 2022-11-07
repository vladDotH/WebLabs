import { Indexed } from "../../api";

export class Model<T extends Indexed> {
  readonly list: T[] = [];
  private id = 1;

  add(obj: T): number {
    this.list.push({ ...obj, id: this.id });
    return this.id++;
  }

  find(id: number): T | null {
    return this.list.find((obj) => obj.id == id) ?? null;
  }

  getIds(): number[] {
    return this.list.map((obj) => obj.id);
  }
}

export * from "./NetworkModel";
