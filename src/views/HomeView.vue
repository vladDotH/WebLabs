<script lang="ts">
import {Component, Vue} from "vue-property-decorator";

@Component
export default class HomeView extends Vue {
  private name: string = '';

  $refs!: {
    input: HTMLInputElement;
  }

  private mounted() {
    this.name = localStorage.getItem('tetris.name') ?? '';
  }

  private start() {
    if (this.name.length > 0) {
      localStorage.setItem('tetris.name', this.name);
      this.$router.push('game');
    }
  }

  private focus() {
    this.$refs.input.focus();
  }
}

</script>

<template>
  <section class="main" @click="focus">
    <div class="name-container">
      <label>Введите имя игрока >>>&nbsp;</label>
      <input v-model="name" autofocus ref="input">
    </div>
    <button @click="start" class="button" :class="{'active' : name.length > 0}">
      Начать игру
    </button>
  </section>
</template>

<style scoped lang="scss">
@import "../styles/main";

.main > * {
  margin-top: 5vh;
}

input {
  font: inherit;
  color: $primary;
  border: none;
  background: transparent;
  caret-color: $text-color;
  outline: none;
}

</style>