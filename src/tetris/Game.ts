import {Actions, rotMat90} from "./util";
import {Vec2} from "./Vec2";
import {Figure} from "./Figure";
import {Field} from "./Field";

// Результат перемещения фигуры
export enum MoveResult {
    CHANGE, CHANGELESS, PLACE, EMPTY
}

export class Game {
    // Поле клеток
    field: Field;
    // Управляемая фигура
    activeFigure: Figure | null;
    figuresQueue: Array<Figure> = [];
    filledRows: number[] = [];

    constructor(h: number, w: number) {
        this.field = new Field(h, w);
        this.activeFigure = null;
    }

    // Помещение фигуры в очередь
    pushFigure(fig: Figure) {
        this.figuresQueue.push(fig);
    }

    // Спавн фигуры из очереди, возвращает true, если фигура размещена удачно (false - поражение)
    shiftFigure(): boolean {
        if (!this.figuresQueue.length)
            throw new Error('Empty figures queue');

        let fig = this.figuresQueue.shift();
        fig!.translate(
            new Vec2([
                this.field.width / 2 - fig!.center.x - 1, 0
            ]).round()
        );

        if (this.field.canPlace(fig!)) {
            this.activeFigure = fig!;
            return true;
        } else
            return false;
    }

    // Очистка одного ряда и сдвиг вышестоящих вниз
    private clearRow(row: number) {
        this.field.clearRow(row);
        for (let i = row - 1; i >= 0; --i) {
            this.field.fallDownRow(i);
        }
    }

    // Очистка всех заполненных рядов
    clearFilledRows(): number {
        let rows = this.filledRows.length;
        this.filledRows
            .sort((a, b) => a - b)
            .forEach(row => this.clearRow(row));
        this.filledRows = [];
        return rows;
    }

    // Движение фигуры вниз
    private moveDown(): MoveResult {
        if (this.field.canPlace(this.activeFigure!, Vec2.down())) {
            this.activeFigure!.translate(Vec2.down());
            return MoveResult.CHANGE;
        } else {
            this.field.place(this.activeFigure!);
            this.filledRows.push(...this.field.checkRows(this.activeFigure!));
            this.activeFigure = null;
            return MoveResult.PLACE;
        }
    }

    // Движение фигуры вправо/влево
    private moveLR(act: Actions.LEFT | Actions.RIGHT): MoveResult {
        let tr: Vec2 = act == Actions.LEFT ? Vec2.left() : Vec2.right();
        if (this.field.canPlace(this.activeFigure!, tr)) {
            this.activeFigure!.translate(tr);
            return MoveResult.CHANGE;
        }
        return MoveResult.CHANGELESS;
    }

    // Поворот фигуры
    private rotate(): MoveResult {
        let copy = this.activeFigure!.copy();
        this.activeFigure!.rotate(rotMat90);
        if (!this.field.canPlace(this.activeFigure!)) {
            let minPos = this.activeFigure!.min(),
                maxPos = this.activeFigure!.max();
            // Если фигура вышла за пределы поля, она перемещается обратно в стакан,
            if (minPos.x < 0 || maxPos.x >= this.field.width) {
                this.activeFigure!.translate(new Vec2([
                    minPos.x < 0 ? -minPos.x : this.field.width - 1 - maxPos.x, 0
                ]));
            }
            // Если не удалось её выровнять, поворот отменяется
            if (!this.field.canPlace(this.activeFigure!)) {
                this.activeFigure = copy;
                return MoveResult.CHANGELESS;
            }
        }
        return MoveResult.CHANGE;
    }

    // Интерфейс управления фигурой
    move(act: Actions): MoveResult {
        if (this.activeFigure != null) {
            switch (act) {
                case Actions.DOWN:
                    return this.moveDown();
                case Actions.LEFT:
                case Actions.RIGHT:
                    return this.moveLR(act);
                case Actions.ROTATE:
                    return this.rotate();
            }
        }
        return MoveResult.EMPTY;
    }

    // Расчёт места падения фигуры
    getHint(): Figure | null {
        if (this.activeFigure) {
            let hint = this.activeFigure.copy();
            while (this.field.canPlace(hint, Vec2.down()))
                hint.translate(Vec2.down());
            return hint;
        }
        return null;
    }
}