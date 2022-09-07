<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';
import TetrisModel from "@/tetris/TetrisModel.vue";
import {GameViewState, Actions} from "@/tetris";
import TetrisView from "@/tetris/TetrisView.vue";

const _ = require('lodash')

@Component({
  components: {TetrisView, TetrisModel},
})
export default class Tetris extends Vue {
  readonly Actions = Actions;

  $refs!: {
    model: TetrisModel,
    view: TetrisView,
    next: TetrisView,
  }

  mounted() {
    console.log(_.flatten(undefined))

  }
}

</script>

<template>
  <section ref="section"
           @keydown.down="$refs.model.move(Actions.DOWN)"
           @keydown.left="$refs.model.move(Actions.LEFT)"
           @keydown.right="$refs.model.move(Actions.RIGHT)"
           @keydown.up="$refs.model.move(Actions.ROTATE)"
  >
    <TetrisModel
        :width="10"
        :height="20"
        ref="model"
        @model-change="$refs.view.update($event)"
        @next-change="$refs.next.update($event)"
    />

    <TetrisView ref="view" :width="10" :height="20" :cell-size="30"/>

    <p style="display: flex; justify-content: center">
      <span>Next:</span>
      <TetrisView ref="next" :width="4" :height="3" :border-size="0" :cell-size="30"/>
    </p>

    <button @click="$refs.model.generateFigure()">generate</button>
    <button @click="$refs.model.spawnFigure()">spawn</button>
    <button>focus</button>
  </section>
</template>

<style scoped>
section {
  padding: 0 10vw;
}
</style>