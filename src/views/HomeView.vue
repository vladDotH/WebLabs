<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';

@Component
export default class HomeView extends Vue {
  name: string = '';

  $refs!: {
    input: HTMLInputElement;
  }

  mounted() {
    this.name = localStorage.getItem('tetris.name') ?? '';
  }

  start() {
    if (this.name.length > 0) {
      localStorage.setItem('tetris.name', this.name);
      this.$router.push('game');
    }
  }

  focus() {
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
    <button @click="start" :class="{'active' : name.length > 0}">
      Начать игру
    </button>
  </section>
</template>

<style scoped>
.main {
  padding: 0 10vw;
  margin-top: 5vh;
}

.main > * {
  margin-top: 2vh;
}

button, input {
  font: inherit;
}

input {
  color: #44aa44;
  border: none;
  background: transparent;
  caret-color: white;
  outline: none;
}

button {
  padding: 0.5% 1%;
  border: none;
  color: #ee99ee;
  background: transparent;
  opacity: 0.5;
  transition: all ease-in-out 0.3s;
}

.active {
  opacity: 1;
  text-decoration: underline #ee99ee;
}

.active:hover {
  cursor: pointer;
}

.active:active {
  transform: scale(0.98);
}
</style>