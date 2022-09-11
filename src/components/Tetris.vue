<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import {SoundEvents} from "@/tetris";
import TetrisModel from "@/tetris/TetrisModel.vue";
import TetrisView from "@/tetris/TetrisView.vue";

const _ = require('lodash')

export interface Records {
  records: Array<[string, number]>;
}

@Component({
  components: {TetrisView, TetrisModel},
})
export default class Tetris extends Vue {
  width: number = 10;
  height: number = 20;
  cellSize: number = 30;
  sounds: string[] =
      ['move', 'place', 'clear', 'game_over']
          .map(name => require(`@/sounds/${name}.wav`));
  score: number = 0;
  over: boolean = false;
  playerName: string = localStorage.getItem('tetris.name') ?? '';

  $refs!: {
    model: TetrisModel,
    view: TetrisView,
    next: TetrisView,
  }

  private onKeyDown(e: KeyboardEvent) {
    if (e.keyCode >= 37 && e.keyCode <= 40)
      this.$refs.model.move(e.keyCode - 37); // сдвиг кода -37
  }

  private onResize(e: UIEvent) {
    this.cellSize = 30 * window.innerWidth / 1920;
  }

  mounted() {
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('resize', this.onResize);
  }

  beforeDestroy() {
    window.addEventListener('resize', this.onResize);
    window.removeEventListener('keydown', this.onKeyDown);
  }

  playSound(event: SoundEvents) {
    try {
      new Audio(this.sounds[event]).play();
    } catch (e) {
      console.log('Error during playing sound');
    }
  }

  gameOver() {
    this.over = true;
    let records = JSON.parse(localStorage.getItem('tetris.records') ?? '{"records":[]}') as Records;
    let prev = records.records.find(o => o[0] == this.playerName);
    if (prev)
      prev[1] = Math.max(this.score, prev[1]);
    else
      records.records.push([this.playerName, this.score]);
    localStorage.setItem('tetris.records', JSON.stringify(records));
  }
}
</script>

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
    <transition name="game-over" mode="out-in">
      <div class="container" v-if="!over" key="game">
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
            <button ref="resume" @click="$refs.model.resume()">Начать</button>
            <button @click="$refs.model.pause()">Пауза</button>
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

      <div v-else class="over" key="over">
        <p>Игра окончена</p>
        <p>Очки: {{ score }}</p>
        <router-link to="/records">Перейти к рекордам</router-link>
      </div>
    </transition>

  </section>
</template>

<style scoped>
.main {
  padding: 5vh 10vw;
}

.container {
  display: flex;
  justify-content: center;
  gap: 4vw;
  transition: all 0.3s ease-in-out;
}

.panel {
  display: flex;
  flex-direction: column;
  gap: 4vh;
}

button {
  font: inherit;
  color: #ee99ee;
  text-decoration: underline #ee99ee;
  background-color: transparent;
  border: none;
  outline: none;
  transition: all 0.3s ease-in-out;
}

button:hover {
  cursor: pointer;
  transform: scale(0.97);
}

button:focus {
  text-decoration-color: #44aa44;
  color: #44aa44;
  transform: scale(0.95);
}

.next {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.info span {
  color: #44aa44;
}

.over > a {
  font-weight: bold;
  text-decoration: underline;
  color: #ee99ee;
}

.game-over-enter-active, .game-over-leave-active {
  transition: all 0.8s ease-in-out;
}

.game-over-enter {
  transform: translateX(-50%);
  opacity: 0;
}

.game-over-enter-to, .game-over-leave {
  transform: translateX(0%);
  opacity: 1;
}

.game-over-leave-to {
  transform: translateX(50%);
  opacity: 0;
}
</style>