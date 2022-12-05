export enum Roles {
  ADMIN,
  BROKER
}

export interface User {
  login: string;
  password: string;
  role: Roles;
  balance: number;
  stocks: StockWallet[];
}

export interface Stock {
  key: string;
  company: string;
}

export interface StockRecord {
  date: string;
  stock: Stock;
  cost: number;
}

export interface StockWallet {
  stock: Stock;
  amount: number;
}