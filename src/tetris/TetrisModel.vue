<script lang="ts">
import {Component, Emit, Prop, Vue} from 'vue-property-decorator';
import {Actions, FiguresFabric, Game, GameViewState} from './index'

const _ = require('lodash')

@Component
export default class TetrisModel extends Vue {
  @Prop() width!: number;
  @Prop() height!: number;

  game!: Game;

  created() {
    this.game = new Game(this.height, this.width);
  }

  generateFigure() {
    this.game!.pushFigure(_.sample(FiguresFabric)())
  }

  spawnFigure() {
    if (this.game!.shiftFigure()) {
      this.modelChange();
      this.nextChange();
    }
  }

  tick() {

  }

  pause() {

  }

  resume() {

  }

  @Emit('model-change')
  private modelChange(): GameViewState {
    return {field: this.game?.field, figure: this.game?.activeFigure};
  }

  @Emit('next-change')
  private nextChange(): GameViewState {
    return {figure: this.game.figuresQueue[this.game.figuresQueue.length - 1]};
  }

  move(act: Actions) {
    let res: boolean = this.game!.move(act);
    console.log(`action got: ${Actions[act]}, result: ${res}`)
    if (res)
      this.modelChange();
    if (act == Actions.DOWN && !res) {
      this.generateFigure();
      this.spawnFigure();
    }
  }
}
</script>

<template>
</template>

<style scoped>
</style>