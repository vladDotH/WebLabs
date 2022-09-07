<script lang="ts">
import {Component, Prop, VModel, Vue, Watch} from 'vue-property-decorator';
import TetrisModelComponent from "@/tetris_model/TetrisModelComponent.vue";
import {Cell, Field, FiguresFabric, GameViewState, Actions} from "@/tetris_model";

const _ = require('lodash')

@Component({
  components: {TetrisModelComponent},
})
export default class Tetris extends Vue {
  readonly defaultColor = '#fafafa';
  readonly Actions = Actions;

  @Prop({default: 10}) width!: number;
  @Prop({default: 20}) height!: number;

  $refs!: {
    cells: HTMLDivElement[]
    rows: HTMLDivElement[]
    model: TetrisModelComponent
  }

  mounted() {

  }

  draw(state: GameViewState) {
    for (let cell of this.$refs.cells) {
      cell.style.backgroundColor = this.defaultColor;
    }
    let cells = _.flatten(state.field.mat).concat(state.figure?.cells);
    for (let cell of cells) {
      if (cell != null) {
        this.$refs.cells[cell.pos.y * this.width + cell.pos.x].style.backgroundColor = cell.color;
      }
    }
  }
}

</script>

<template>
  <section
      @keydown.down="$refs.model.move(Actions.DOWN)"
      @keydown.left="$refs.model.move(Actions.LEFT)"
      @keydown.right="$refs.model.move(Actions.RIGHT)"
      @keydown.up="$refs.model.move(Actions.ROTATE)"
  >
    <TetrisModelComponent
        :width="width"
        :height="height"
        ref="model"
        @model-change="draw"/>

    <button @click="$refs.model.generateFigure()">generate</button>
    <button @click="$refs.model.spawnFigure()">spawn</button>
    <button>focus</button>

    <div class="tube">
      <div
          class="row"
          v-for="h in height"
          ref="rows">
        <div
            class="cell"
            v-for="w in width"
            ref="cells">
        </div>
      </div>
    </div>

  </section>
</template>

<style scoped>
section {
  padding: 0 10vw;
}

.row {
  display: flex;
  gap: 0px;
}

.tube {
  display: flex;
  flex-direction: column;
  gap: 0px;
}

.cell {
  width: 40px;
  height: 40px;
  border: solid #777 0.5px;
}
</style>