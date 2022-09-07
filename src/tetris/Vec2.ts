import {Matrix, Num2Tuple} from "./util";

// Двумерный вектор
export class Vec2 {
    x: number;
    y: number;

    constructor(vec: Num2Tuple) {
        this.x = vec[0];
        this.y = vec[1];
    }

    // Сумма векторов
    translate(v: Vec2): Vec2 {
        return new Vec2([this.x + v.x, this.y + v.y]);
    }

    // Разворот вектора
    neg(): Vec2 {
        return new Vec2([-this.x, -this.y]);
    }

    // Поворот вектора
    rotate(mat: Matrix<number>): Vec2 {
        return new Vec2([
            this.x * mat[0][0] + this.y * mat[0][1],
            this.x * mat[1][0] + this.y * mat[1][1],
        ]);
    }

    // Округление координат
    round(): Vec2 {
        return new Vec2([Math.round(this.x), Math.round(this.y)]);
    }

    tuple(): Num2Tuple {
        return [this.x, this.y];
    }

    // Фабричные методы стандартных векторов
    static null(): Vec2 {
        return new Vec2([0, 0]);
    }

    static up(): Vec2 {
        return new Vec2([0, -1]);
    }

    static down(): Vec2 {
        return new Vec2([0, 1]);
    }

    static left(): Vec2 {
        return new Vec2([-1, 0]);
    }

    static right(): Vec2 {
        return new Vec2([1, 0]);
    }
}