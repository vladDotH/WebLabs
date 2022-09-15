<template>
  <section class="main">
    <TetrisModel
        :width="width"
        :height="height"
        ref="model"
        @model-change="$refs.view.update($event)"
        @next-change="$refs.next.update($event)"
        @sound-event="playSound"
        @score-change="score = $event"
        @game-over="gameOver"
    />
    <div class="container">
      <TetrisView
          ref="view"
          :width="width"
          :height="height"
          :cell-size="cellSize"
          color="#222"
          bg-color="#888"
      />

      <div class="panel">
        <div class="control">
          <button class="button active" @click="$refs.model.resume()">Начать</button>
          <button class="button active" @click="$refs.model.pause()">Пауза</button>
        </div>

        <div class="info">
          <p>Игрок : <span>{{ playerName }}</span></p>
          <p>Очки : {{ score }}</p>
        </div>

        <div class="next">
          <p>Следующая фигура:</p>
          <TetrisView
              ref="next"
              :width="4"
              :height="3"
              :border-size="1"
              border-color="#333"
              :cell-size="cellSize"
              color="#222"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import {Component, Emit, Vue} from 'vue-property-decorator';
import {SoundEvents} from "@/tetris";
import TetrisModel from "@/tetris/TetrisModel.vue";
import TetrisView from "@/tetris/TetrisView.vue";

export interface Records {
  records: Array<[string, number]>;
}

@Component({
  components: {TetrisView, TetrisModel},
})
export default class Tetris extends Vue {
  private readonly width: number = 10;
  private readonly height: number = 20;
  private cellSize: number = 30;
  private readonly sounds: string[] =
      ['move', 'place', 'clear', 'game_over']
          .map(name => require(`@/sounds/${name}.wav`));

  private score: number = 0;
  private readonly playerName: string = localStorage.getItem('tetris.name') ?? '';

  $refs!: {
    model: TetrisModel,
    view: TetrisView,
    next: TetrisView,
  }

  private onKeyDown(e: KeyboardEvent) {
    if (e.keyCode >= 37 && e.keyCode <= 40)
      this.$refs.model.move(e.keyCode - 37); // сдвиг кода -37
  }

  private onResize(e?: UIEvent) {
    this.cellSize = 30 * window.innerWidth / 1920;
  }

  private mounted() {
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('resize', this.onResize);
    this.onResize();
  }

  private beforeDestroy() {
    window.addEventListener('resize', this.onResize);
    window.removeEventListener('keydown', this.onKeyDown);
  }

  private playSound(event: SoundEvents) {
    try {
      new Audio(this.sounds[event]).play();
    } catch (e) {
      console.log('Error during playing sound');
    }
  }

  private gameOver() {
    let records = JSON.parse(localStorage.getItem('tetris.records') ?? '{"records":[]}') as Records;
    let prev = records.records.find(o => o[0] == this.playerName);
    if (prev)
      prev[1] = Math.max(this.score, prev[1]);
    else
      records.records.push([this.playerName, this.score]);
    localStorage.setItem('tetris.records', JSON.stringify(records));
    this.gameOverEmit();
  }

  @Emit('game-over')
  private gameOverEmit(): number {
    return this.score;
  }
}
</script>

<style scoped lang="scss">
@import "../styles/main";

.container {
  display: flex;
  justify-content: center;
  gap: 4vw;

  .panel {
    display: flex;
    flex-direction: column;
    gap: 4vh;

    .next {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .info span {
      color: $primary;
    }
  }
}
</style>