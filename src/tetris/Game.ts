import {Actions, MoveResult, rotMat90} from "./util";
import {Vec2} from "./Vec2";
import {Figure} from "./Figure";
import {Field} from "./Field";

export class Game {
    // Поле клеток
    readonly field: Field;
    // Управляемая фигура
    private _activeFigure: Figure | null;
    private figuresQueue: Array<Figure> = [];
    private filledRows: number[] = [];

    constructor(h: number, w: number) {
        this.field = new Field(h, w);
        this._activeFigure = null;
    }

    get activeFigure(): Figure | null {
        return this._activeFigure;
    }

    get nextFigure(): Figure | null {
        return this.figuresQueue.length ? this.figuresQueue[0] : null;
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
            this._activeFigure = fig!;
            return true;
        } else
            return false;
    }

    // Расчёт места падения фигуры
    getHint(): Figure | null {
        if (this._activeFigure) {
            let hint = this._activeFigure.copy();
            while (this.field.canPlace(hint, Vec2.down()))
                hint.translate(Vec2.down());
            return hint;
        }
        return null;
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

    // Интерфейс управления фигурой
    move(act: Actions): MoveResult {
        if (this._activeFigure != null) {
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

    // Очистка одного ряда и сдвиг вышестоящих вниз
    private clearRow(row: number) {
        this.field.clearRow(row);
        for (let i = row - 1; i >= 0; --i) {
            this.field.fallDownRow(i);
        }
    }

    // Движение фигуры вниз
    private moveDown(): MoveResult {
        if (this.field.canPlace(this._activeFigure!, Vec2.down())) {
            this._activeFigure!.translate(Vec2.down());
            return MoveResult.CHANGE;
        } else {
            this.field.place(this._activeFigure!);
            this.filledRows.push(...this.field.checkRows(this._activeFigure!));
            this._activeFigure = null;
            return MoveResult.PLACE;
        }
    }

    // Движение фигуры вправо/влево
    private moveLR(act: Actions.LEFT | Actions.RIGHT): MoveResult {
        let tr: Vec2 = act == Actions.LEFT ? Vec2.left() : Vec2.right();
        if (this.field.canPlace(this._activeFigure!, tr)) {
            this._activeFigure!.translate(tr);
            return MoveResult.CHANGE;
        }
        return MoveResult.CHANGELESS;
    }

    // Поворот фигуры
    private rotate(): MoveResult {
        let copy = this._activeFigure!.copy();
        this._activeFigure!.rotate(rotMat90);
        if (!this.field.canPlace(this._activeFigure!)) {
            let minPos = this._activeFigure!.min(),
                maxPos = this._activeFigure!.max();
            // Если фигура вышла за пределы поля, она перемещается обратно в стакан,
            if (minPos.x < 0 || maxPos.x >= this.field.width) {
                this._activeFigure!.translate(new Vec2([
                    minPos.x < 0 ? -minPos.x : this.field.width - 1 - maxPos.x, 0
                ]));
            }
            // Если не удалось её выровнять, поворот отменяется
            if (!this.field.canPlace(this._activeFigure!)) {
                this._activeFigure = copy;
                return MoveResult.CHANGELESS;
            }
        }
        return MoveResult.CHANGE;
    }
}