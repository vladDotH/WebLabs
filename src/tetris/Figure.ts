import {Matrix, rotMat90, Num2Tuple} from "./util";
import {Vec2} from "./Vec2";
import {Cell} from "./Cell";

// Фигура на поле (текущая управляемая фигура)
export class Figure {
    readonly cells: Cell[];
    // Центр фигуры задаёт ось её вращения
    center: Vec2;
    readonly color: string;

    constructor(cells: Array<Num2Tuple>, center: Num2Tuple, color: string) {
        this.cells = cells.map(v => new Cell(new Vec2(v), color));
        this.center = new Vec2(center);
        this.color = color;
    }

    // Максимальные х и у координаты фигуры
    max(): Vec2 {
        return new Vec2([
            Math.max(...this.cells.map(v => v.pos.x)),
            Math.max(...this.cells.map(v => v.pos.y))
        ])
    }

    // Минимальные х и у координаты фигуры
    min(): Vec2 {
        return new Vec2([
            Math.min(...this.cells.map(v => v.pos.x)),
            Math.min(...this.cells.map(v => v.pos.y))
        ])
    }

    // Перемещение фигуры целиком
    translate(v: Vec2) {
        this.center = this.center.translate(v);
        for (let i = 0; i < this.cells.length; i++) {
            this.cells[i].pos = this.cells[i].pos.translate(v);
        }
    }

    // Поворот фигуры
    rotate(mat: Matrix<number> = rotMat90) {
        this.cells.forEach(cell =>
            cell.pos =
                cell.pos
                    .translate(this.center.neg())
                    .rotate(mat)
                    .translate(this.center)
                    .round()
        );
    }

    // Копия фигуры
    copy() {
        return new Figure(
            this.cells.map(cell => cell.pos.tuple()),
            this.center.tuple(),
            this.color
        )
    }
}