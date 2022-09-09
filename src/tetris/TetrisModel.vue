<script lang="ts">
import {Component, Emit, Prop, Vue} from 'vue-property-decorator';
import {Actions, FiguresFabric, Game, GameViewState, MoveResult} from './index'

const _ = require('lodash')

@Component
export default class TetrisModel extends Vue {
  @Prop() width!: number;
  @Prop() height!: number;
  @Prop({default: 1500}) defaultInterval!: number;
  @Prop({default: 0.5}) intervalScoreMultiplier!: number;
  @Prop({default: 100}) rowScore!: number;

  game!: Game;
  timerId: number = 0;
  score: number = 0;

  created() {
    this.game = new Game(this.height, this.width);
  }

  mounted() {
    this.generateFigure();
  }

  getInterval(): number {
    return this.defaultInterval - this.score * this.intervalScoreMultiplier;
  }

  generateFigure() {
    this.game!.pushFigure(_.sample(FiguresFabric)())
  }

  spawnFigure(): boolean {
    if (this.game!.shiftFigure()) {
      this.modelChange();
      this.nextChange();
      return true;
    }
    return false;
  }

  pause() {
    console.log('stop timer: ', this.timerId);
    clearTimeout(this.timerId);
  }

  private tick() {
    this.timerId = setTimeout(this.tick, this.getInterval());
    this.move(Actions.DOWN);
    console.log('tick timer: ', this.timerId);
  }

  resume() {
    this.timerId = setTimeout(this.tick, this.getInterval());
    console.log('set timer: ', this.timerId);
  }

  @Emit('model-change')
  private modelChange(): GameViewState {
    return {field: this.game.field, figure: this.game.activeFigure};
  }

  @Emit('next-change')
  private nextChange(): GameViewState {
    return {figure: this.game.figuresQueue[this.game.figuresQueue.length - 1]};
  }

  @Emit('score-change')
  private scoreChange(): number {
    return this.score;
  }

  @Emit('game-over')
  private gameOver(): boolean {
    return true;
  }

  move(act: Actions) {
    let res: MoveResult = this.game!.move(act);
    switch (res) {
      case MoveResult.PLACE:
        let rows = this.game.clearFilledRows();
        if (rows) {
          this.score += Math.round(this.rowScore * rows * (1 + rows / 10));
          this.scoreChange();
        }
        // размещение влечёт за собой изменение модели
      case MoveResult.CHANGE:
        this.modelChange();
        break;
      case MoveResult.EMPTY:
        this.generateFigure();
        if(!this.spawnFigure()) {
          this.pause();
          this.gameOver();
        }
        break;
    }
  }
}
</script>

<template>
</template>

<style scoped>
</style>