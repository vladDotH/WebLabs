<template>
</template>

<script lang="ts">
import {Component, Emit, Prop, Vue} from "vue-property-decorator";
import {Actions, SoundEvents, GameViewState, FiguresFabric, Game, MoveResult} from "./index"
import * as _ from "lodash"

// Компонент логики игры
@Component
export default class TetrisModel extends Vue {
  @Prop() readonly width!: number;
  @Prop() readonly height!: number;
  // Базовый интервал падения
  @Prop({default: 1500}) readonly defaultInterval!: number;
  // Множитель очков для вычитания из базового интервала
  @Prop({default: 0.3}) readonly intervalScoreMultiplier!: number;
  // Кол-во очков за заполненный ряд
  @Prop({default: 100}) readonly rowScore!: number;

  private game!: Game;
  private timerId: number = 0;
  private score: number = 0;
  private paused: boolean = true;

  private created() {
    this.game = new Game(this.height, this.width);
    this.generateFigure();
  }

  // Остановка игры
  pause() {
    if (!this.paused) {
      this.paused = true;
      clearTimeout(this.timerId);
    }
  }

  // Возобновление/старт игры
  resume() {
    if (this.paused) {
      this.paused = false;
      clearTimeout(this.timerId);
      this.timerId = setTimeout(this.tick, this.getInterval());
    }
  }

  // Интерфейс управления игрой
  move(act: Actions) {
    if (this.paused)
      return;

    let res: MoveResult = this.game!.move(act);
    switch (res) {
      case MoveResult.PLACE:
        let rows = this.game.clearFilledRows();
        this.soundEmit(SoundEvents.PLACE);
        if (rows) {
          this.score += Math.round(this.rowScore * rows * (1 + (rows - 1) / 10));
          this.scoreChangeEmit();
          this.soundEmit(SoundEvents.CLEAR);
        }
        this.modelChangeEmit();
        break
      case MoveResult.CHANGE:
        this.modelChangeEmit();
        this.soundEmit(SoundEvents.MOVE);
        break;
      case MoveResult.EMPTY:
        this.generateFigure();
        if (!this.spawnFigure()) {
          this.pause();
          this.soundEmit(SoundEvents.OVER);
          this.gameOverEmit();
        } else {
          this.soundEmit(SoundEvents.MOVE);
        }
        break;
    }
  }

  // Вычисление интервала падения с учётом очков
  private getInterval(): number {
    return this.defaultInterval - this.score * this.intervalScoreMultiplier;
  }

  // Помещение случайной фигуры в очередь
  private generateFigure() {
    this.game!.pushFigure(_.sample(FiguresFabric)!())
  }

  // Спавн первой фигуры из очереди
  private spawnFigure(): boolean {
    if (this.game!.shiftFigure()) {
      this.modelChangeEmit();
      this.nextChangeEmit();
      return true;
    }
    return false;
  }

  // Авто-движение вниз
  private tick() {
    this.timerId = setTimeout(this.tick, this.getInterval());
    this.move(Actions.DOWN);
  }

  /*События игры*/

  @Emit('model-change')
  private modelChangeEmit(): GameViewState {
    return {
      field: this.game.field, figure:
      this.game.activeFigure,
      hint: this.game.getHint()
    };
  }

  @Emit('next-change')
  private nextChangeEmit(): GameViewState {
    return {figure: this.game.nextFigure};
  }

  @Emit('score-change')
  private scoreChangeEmit(): number {
    return this.score;
  }

  @Emit('game-over')
  private gameOverEmit(): boolean {
    return true;
  }

  @Emit('sound-event')
  private soundEmit(sound: SoundEvents): SoundEvents {
    return sound;
  }
}
</script>