export interface BookData {
  id?: number;
  title: string;
  author: string;
  releaseDate: number;
  holder?: string;
  returnDate?: string;
  cover?: string;
}

export enum RequestType {
  ALL,
  AVAILABLE,
  EXPIRED,
}
