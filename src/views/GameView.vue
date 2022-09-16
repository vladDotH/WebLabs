<template>
  <section>
    <transition name="game-over" mode="out-in">
      <Tetris
          v-if="score === -1"
          @game-over="score = $event"
          key="game"/>
      <div v-else class="over" key="game-over">
        <p>Игра окончена</p>
        <p>Очки: {{ score }}</p>
        <router-link class="button active" to="/records">Перейти к рекордам</router-link>
      </div>
    </transition>
  </section>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import Tetris from "@/components/Tetris.vue";

@Component({
  components: {Tetris}
})
export default class GameView extends Vue {
  private score: number = -1;
}
</script>

<style scoped lang="scss">
.game-over-enter-active, .game-over-leave-active {
  transition: all 1s ease-in-out;
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