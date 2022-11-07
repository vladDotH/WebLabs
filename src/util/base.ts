// Интерфейс загрузчика
export interface ILoader {
  get url(): URL;
  fetch(): void;
}

// Интерфейс загрузчика индексируемых данных
export interface IndexedLoader {
  readonly id: number;
  get endpoint(): string;
}
