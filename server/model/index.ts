import { Indexed } from "../../api";
import fs from "fs";
import path from "path";

// Текущее время в формате iso
export function nowISO() {
  return new Date().toISOString();
}

// Загрузка JSON файла
export function load<T>(file: string, storagePath: string): T {
  return JSON.parse(
    fs.readFileSync(path.resolve(storagePath, file), "utf-8")
  ) as T;
}

// Коллекция объектов модели
export class ModelCollection<T extends Indexed> {
  readonly list: T[] = [];
  private id = 1;

  add(obj: T): number {
    this.list.push({ ...obj, id: this.id });
    return this.id++;
  }

  find(id: number): T | null {
    return this.list.find((obj) => obj.id == id) ?? null;
  }

  remove(id: number) {
    const i = this.list.findIndex((e) => e.id === id);
    if (i !== -1) this.list.splice(i, 1);
  }

  getIds(): number[] {
    return this.list.map((obj) => obj.id);
  }
}

export * from "./NetworkModel";
