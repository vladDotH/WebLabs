import { RequestType, Book, expired } from "../api";

// Класс управления книгами
export class Library {
  private id = 1;
  private books: Map<number, Book> = new Map();

  constructor(init?: Book[]) {
    if (init) for (const book of init) this.add(book);
  }

  getAll(req: RequestType): number[] {
    const books = Array.from(this.books.keys());
    switch (req) {
      case RequestType.ALL:
        return books;
      case RequestType.AVAILABLE:
        return books.filter((id) => !this.get(id)!.holder);
      case RequestType.EXPIRED:
        return books.filter((id) => expired(this.get!(id)!));
    }
    return [];
  }

  add(book: Book): number {
    book.id = this.id++;
    this.books.set(book.id, book);
    return book.id;
  }

  get(id: number): Book | null {
    return this.books.get(id) ?? null;
  }

  delete(id: number): boolean {
    return this.books.delete(id);
  }
}
