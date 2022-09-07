import {Actions, rotMat90} from "./util";
import {Vec2} from "./Vec2";
import {Figure} from "./Figure";
import {Field} from "./Field";

const _ = require('lodash');

// Интерфейс передачи состояния модели
export interface GameViewState {
    field?: Field;
    figure?: Figure | null;
}

export class Game {
    field: Field;
    // Управляемая фигура
    activeFigure: Figure | null;
    // Поле статичных клеток
    figuresQueue: Array<Figure> = [];
    startSpeed: number;

    constructor(h: number, w: number, startSpeed: number = 1500) {
        this.field = new Field(h, w);
        this.activeFigure = null;
        this.startSpeed = startSpeed;
    }

    get speed(): number {
        return this.startSpeed;
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

    // Получение заполненных фигурой рядов
    checkRows(figure: Figure): number[] {
        return _.uniq(figure.cells.map(c => c.pos.y))
            .filter(
                (y: number) =>
                    this.field.mat[y].every(
                        cell => cell != null
                    )
            )
            .sort();
    }

    // Движение фигуры вниз
    private moveDown(): boolean {
        if (this.field.canPlace(this.activeFigure!, Vec2.down())) {
            this.activeFigure!.translate(Vec2.down());
        } else {
            this.field.place(this.activeFigure!);
            this.activeFigure = null;
        }
        return true;
    }

    // Движение фигуры вправо/влево
    private moveLR(act: Actions.LEFT | Actions.RIGHT): boolean {
        let tr: Vec2 = act == Actions.LEFT ? Vec2.left() : Vec2.right();
        if (this.field.canPlace(this.activeFigure!, tr)) {
            this.activeFigure!.translate(tr);
            return true;
        }
        return false;
    }

    // Поворот фигуры
    private rotate(): boolean {
        let copy = this.activeFigure!.copy();
        this.activeFigure!.rotate(rotMat90);
        if (this.field.canPlace(this.activeFigure!))
            return true
        else {
            let minPos = this.activeFigure!.min(),
                maxPos = this.activeFigure!.max();
            // Если фигура вышла за пределы поля, она перемещается обратно в стакан,
            // Иначе поворот отменяется
            if (minPos.x < 0 || maxPos.x >= this.field.width) {
                this.activeFigure!.translate(new Vec2([
                    minPos.x < 0 ? -minPos.x : this.field.width - 1 - maxPos.x, 0
                ]));
                return true;
            } else {
                this.activeFigure = copy;
            }
            return false;
        }
    }

    // Интерфейс управления фигурой
    move(act: Actions): boolean {
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
        return false;
    }
}