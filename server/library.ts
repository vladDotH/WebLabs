import { Book, RequestType } from "../api";

export class Library {
  private id = 0;
  private books: Map<number, Book> = new Map();

  constructor(init?: Book[]) {
    if (init) for (const book of init) this.add(book);
  }

  getAll(req: RequestType): number[] {
    const books = Array.from(this.books.keys());
    switch (req) {
      case RequestType.AVAILABLE:
        return books.filter((id) => !this.get(id)!.holder);
      case RequestType.EXPIRED:
        return books.filter(
          (id) =>
            this.get(id)!.returnDate &&
            new Date(this.get(id)!.returnDate!) < new Date()
        );
    }
    return books;
  }

  add(book: Book): number {
    book.id = this.id++;
    this.books.set(book.id, book);
    return book.id;
  }

  get(id: number): Book | null {
    return this.books.get(id) ?? null;
  }

  update(id: number, book: Book): boolean {
    if (this.books.has(id)) {
      this.books.set(id, book);
      return true;
    } else return false;
  }

  delete(id: number): boolean {
    if (this.books.has(id)) {
      this.books.delete(id);
      return true;
    } else return false;
  }
}
