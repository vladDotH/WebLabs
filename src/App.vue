<template>
  <section id="app">
    <header class="header container-fluid pt-3 pb-3 ps-5 pe-5 fs-2">
      <span class="me-2">Библиотека</span>
      <font-awesome-icon icon="fa-book-open" />
    </header>
    <section class="view container rounded-3 mt-2 p-5">
      <router-view />
    </section>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class App extends Vue {}
</script>

<style lang="scss">
@import "bootstrap/scss/bootstrap";
@import "styles/main";

#app {
}

.header {
  background-color: $primary;
  color: $text-light;
  font-weight: bold;
}

.view {
  background-color: $bg-grey1;
}
</style>
