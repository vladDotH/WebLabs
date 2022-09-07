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
    LEFT, RIGHT,
    ROTATE, DOWN
}

// Фабричные функции стандартных фигур
export const FiguresFabric = [
    () => new Figure([[0, 0], [1, 0], [2, 0], [3, 0]], [1.5, 0], '#009688'),
    () => new Figure([[0, 0], [1, 0], [0, 1], [1, 1]], [0.5, 0.5], '#CDDC39'),
    () => new Figure([[0, 0], [0, 1], [0, 2], [1, 2]], [0.5, 1.5], '#FFEB3B'),
    () => new Figure([[1, 0], [1, 1], [1, 2], [0, 2]], [0.5, 1.5], '#F44336'),
    () => new Figure([[0, 0], [0, 1], [1, 1], [1, 2]], [0.5, 1], '#9C27B0'),
    () => new Figure([[1, 0], [1, 1], [0, 1], [0, 2]], [0.5, 1], '#3F51B5'),
    () => new Figure([[0, 0], [0, 1], [0, 2], [1, 1]], [1, 1], '#00BCD4'),
]