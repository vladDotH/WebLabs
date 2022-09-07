import {Matrix} from "@/tetris_model/util";
import {Vec2} from "@/tetris_model/Vec2";
import {Cell} from "@/tetris_model/Cell";
import {Figure} from "@/tetris_model/Figure";

export class Field {
    height: number;
    width: number;
    mat: Matrix<Cell | null>;

    constructor(h: number, w: number) {
        this.height = h;
        this.width = w;
        this.mat = [];
        for (let i = 0; i < h; i++) {
            this.mat.push([]);
            for (let j = 0; j < w; j++) {
                this.mat[i].push(null);
            }
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
            throw new Error(`Incorrect/occupied position`);
        for (let c of fig.cells) {
            this.mat[c.pos.y][c.pos.x] = c;
        }
    }

    // Очищение ряда клеток
    clearRow(row: number) {
        for (let col = 0; col < this.width; col++) {
            this.mat[row][col] = null;
        }
    }

    // Падение ряда на следующий ряд
    fallDownRow(i: number) {
        for (let j = 0; j < this.width; j++) {
            if (this.mat[i + 1][j] == null && this.mat[i][j] != null) {
                this.mat[i + 1][j] = this.mat[i][j];
                this.mat[i][j] = null;
            }
        }
    }
}