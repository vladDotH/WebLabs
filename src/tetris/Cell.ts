import {Vec2} from "./Vec2";

// Клетка на поле (или в фигуре)
export class Cell {
    pos: Vec2;
    readonly color: string;

    constructor(pos: Vec2, color: string = '#000') {
        this.pos = pos;
        this.color = color;
    }
}