import {Figure} from "./Figure";

// Кортеж двух чисел
export type Num2Tuple = [number, number];

// Шаблон матрицы
export type Matrix<T> = Array<Array<T>>;

// Матрица поворота на 90
export const rotMat90: Matrix<number> = [
    [0, -1],
    [1, 0]
];

// Возможные действия с фигурой
export enum Actions {
    LEFT, ROTATE, RIGHT, DOWN
}

// Фабричные функции стандартных фигур
export const FiguresFabric = [
    () => new Figure([[0, 0], [1, 0], [2, 0], [3, 0]], [1.5, 0], '#729fcf'),
    () => new Figure([[0, 0], [1, 0], [0, 1], [1, 1]], [0.5, 0.5], '#d3d7cf'),
    () => new Figure([[0, 0], [0, 1], [0, 2], [1, 2]], [0.5, 1.5], '#c4a000'),
    () => new Figure([[1, 0], [1, 1], [1, 2], [0, 2]], [0.5, 1.5], '#ee99ee'),
    () => new Figure([[0, 0], [0, 1], [1, 1], [1, 2]], [0.5, 1], '#cc0000'),
    () => new Figure([[1, 0], [1, 1], [0, 1], [0, 2]], [0.5, 1], '#4e9a06'),
    () => new Figure([[0, 0], [0, 1], [0, 2], [1, 1]], [1, 1], '#75507b'),
]