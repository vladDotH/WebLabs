<template>
  <section class="field" ref="field" :style="{'background-color': bgColor}">
    <div
        class="row"
        v-for="h in height"
        ref="rows">
      <div
          class="cell"
          :style="{
            'width': `${cellSize}px`,
            'height': `${cellSize}px`,
            'background-color': color,
            'border-width' :`${borderSize}px`,
            'border-color': borderColor
          }"
          v-for="w in width"
          ref="cells">
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import {Component, Prop, Vue} from "vue-property-decorator";
import {GameViewState} from "@/tetris/util";
import {Cell} from "@/tetris/Cell";
import * as _ from "lodash"

// Компонент отображения игры / фигур
@Component
export default class TetrisView extends Vue {
  @Prop() readonly width!: number;
  @Prop() readonly height!: number;
  @Prop({default: 20}) readonly cellSize!: number;
  @Prop({default: 1}) readonly borderSize!: number;
  @Prop({default: '#fff'}) readonly color!: string;
  @Prop({default: '#fff'}) readonly bgColor!: string;
  @Prop({default: '#777'}) readonly borderColor!: string;

  $refs!: {
    field: HTMLDivElement
    rows: HTMLDivElement[]
    cells: HTMLDivElement[]
  }

  // Обновление отображения
  update(state: GameViewState) {
    for (let cell of this.$refs.cells) {
      cell.style.backgroundColor = this.color;
      cell.style.opacity = '1';
    }

    state.hint?.cells.forEach(cell => {
      this.$refs.cells[cell.pos.y * this.width + cell.pos.x].style.backgroundColor = cell.color;
      this.$refs.cells[cell.pos.y * this.width + cell.pos.x].style.opacity = '0.4';
    });

    _.flatten(state.field?.mat)
        .concat(state.figure?.cells ?? [])
        .forEach(
            (cell: Cell | null) => {
              if (cell != null) {
                this.$refs.cells[cell.pos.y * this.width + cell.pos.x].style.backgroundColor = cell.color;
                this.$refs.cells[cell.pos.y * this.width + cell.pos.x].style.opacity = '1';
              }
            }
        );
  }
}
</script>

<style scoped lang="scss">
.field {
  display: flex;
  flex-direction: column;

  .row {
    display: flex;

    .cell {
      border: solid 1px;
      transition: all linear 0.05s;
    }
  }
}
</style>