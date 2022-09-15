import {Matrix} from "./util";
import {Vec2} from "./Vec2";
import {Cell} from "./Cell";
import {Figure} from "./Figure";
import * as _ from 'lodash'

export class Field {
    readonly height: number;
    readonly width: number;
    readonly mat: Matrix<Cell | null>;

    constructor(h: number, w: number) {
        this.height = h;
        this.width = w;
        this.mat = Array(h);
        for (let i = 0; i < h; i++) {
            this.mat[i] = _.fill(Array(w), null);
        }
    }

    // Определение возможности размещения фигуры (с учётом её сдвига)
    canPlace(fig: Figure, move: Vec2 = Vec2.null()): boolean {
        for (let c of fig.cells) {
            if (
                c.pos.x + move.x < 0 ||
                c.pos.y + move.y < 0 ||
                c.pos.x + move.x >= this.width ||
                c.pos.y + move.y >= this.height ||
                this.mat[c.pos.y + move.y][c.pos.x + move.x] != null
            )
                return false;
        }
        return true;
    }

    // Помещение фигуры (её клеток) на поле
    place(fig: Figure) {
        if (!this.canPlace(fig))
            throw new Error(`Incorrect/occupied position; figure: ${JSON.stringify(fig)}`);
        for (let c of fig.cells)
            this.mat[c.pos.y][c.pos.x] = c;
    }

    // Получение заполненных фигурой рядов
    checkRows(figure: Figure): number[] {
        return _.uniq(figure.cells.map(c => c.pos.y))
            .filter(
                (y: number) =>
                    this.mat[y].every(
                        cell => cell != null
                    )
            );
    }

    // Очищение ряда клеток
    clearRow(row: number) {
        for (let col = 0; col < this.width; col++)
            this.mat[row][col] = null;
    }

    // Падение ряда на следующий ряд
    fallDownRow(i: number) {
        for (let j = 0; j < this.width; j++) {
            if (this.mat[i + 1][j] == null && this.mat[i][j] != null) {
                this.mat[i][j]!.pos.y += 1;
                this.mat[i + 1][j] = this.mat[i][j];
                this.mat[i][j] = null;
            }
        }
    }
}