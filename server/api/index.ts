import { EventsMap } from "socket.io/dist/typed-events";

export interface Indexed {
  id?: number;
}

// Роли пользователей
export enum Roles {
  BROKER,
  ADMIN,
}

// Аутентификационные данные
export interface AuthData {
  login: string;
  password: string;
}

// Пользователь системы
export interface User extends Indexed, AuthData {
  role: Roles;
  balance: number;
  stocks: StockBundle[];
}

// Акция
export interface Stock {
  key: string;
  company: string;
}

// Пакет акций
export interface StockBundle {
  key: string;
  amount: number;
}

// Запись в истории стоимости
export interface StockHistoryRecord {
  cost: number;
  date: string;
}

// История стоимости
export interface StockHistory {
  stock: Stock;
  records: StockHistoryRecord[];
}

// Запись стоимости одной акции в котировках
export interface StockRateRecord {
  key: string;
  cost: number;
}

// Данные котировок
export interface StocksRate {
  date: string;
  stocks: StockRateRecord[];
}

export interface ExchangeState {
  date: string;
  active: boolean;
}

// Параметры торгов
export interface TradesConfig {
  startDate: string;
  dayDelay: number;
}

// Параметры торгов с датами (передаётся только клиенту)
export interface TradesConfigExtended extends TradesConfig {
  dateRange: [string, string];
}

// Тип транзакции
export enum TransactionTypes {
  BUY,
  SELL,
}

// Покупка/продажа определённого количества акций по заданной цене
export interface Transaction {
  brokerId: number;
  stocks: StockBundle & StockRateRecord;
  type: TransactionTypes;
}

// Запись о прибыли по акции
export interface ProfitRecord {
  key: string;
  value: number;
}

export interface ProfitInfo extends Indexed {
  profits: ProfitRecord[];
}

// События отправляемые сервером по Вебсокету
export interface ServerToClientEvents {
  postStocksRate: (data: StocksRate) => void;
  sendCurrentHistory: (data: StocksRate[]) => void;
}

// События отправляемые клиентом
export type ClientToServerEvents = EventsMap;

// Параметры клиент-серверного взаимодействия
export const config = {
  // Адрес хоста сервера
  serverHost: "localhost",
  // Адрес вебсокета
  webSocket: "http://localhost:3000/",
  // Адрес api
  api: "http://localhost:3000/api/",
  // Адрес клиентского приложения
  client: "http://localhost:8080",
};
