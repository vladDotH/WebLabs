<script lang="ts">
import {Component, Emit, Prop, Vue} from 'vue-property-decorator';
import {GameViewState} from "@/tetris/Game";
import {Cell} from "@/tetris/Cell";

const _ = require('lodash')

@Component
export default class TetrisView extends Vue {
  @Prop() width!: number;
  @Prop() height!: number;
  @Prop({default: 20}) cellSize!: number;
  @Prop({default: 1}) borderSize!: number;
  @Prop({default: '#fff'}) color!: string;

  $refs!: {
    field: HTMLDivElement
    rows: HTMLDivElement[]
    cells: HTMLDivElement[]
  }

  update(state: GameViewState) {
    for (let cell of this.$refs.cells) {
      cell.style.backgroundColor = this.color;
    }
    _.flatten(state.field?.mat)
        .concat(state.figure?.cells)
        .forEach(
            (cell: Cell | null) => {
              if (cell != null)
                this.$refs.cells[cell.pos.y * this.width + cell.pos.x].style.backgroundColor = cell.color;
            }
        );
  }
}

</script>

<template>
  <section ref="field">
    <div
        class="row"
        v-for="h in height"
        ref="rows">
      <div
          class="cell"
          :style="{'width': `${cellSize}px`, 'height': `${cellSize}px`, 'border-width' :`${borderSize}px`}"
          v-for="w in width"
          ref="cells">
      </div>
    </div>
  </section>
</template>

<style scoped>
section {
  display: flex;
  flex-direction: column;
}

.row {
  display: flex;
}

.cell {
  border: solid #777;
  transition: all linear 0.1s;
}
</style>