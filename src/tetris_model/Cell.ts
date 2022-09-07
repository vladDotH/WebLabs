import {Vec2} from "@/tetris_model/Vec2";

// Клетка на поле (или в фигуре)
export class Cell {
    pos: Vec2;
    color: string;

    constructor(pos: Vec2, color: string = '#000') {
        this.pos = pos;
        this.color = color;
    }
}