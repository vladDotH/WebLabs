<template>
  <div id="app">
    <nav>
      <router-link to="/">Игра</router-link>
      |
      <router-link to="/records">Рекорды</router-link>
    </nav>
    <router-view/>
  </div>
</template>

<style lang="scss">
@import "styles/main";

body {
  background-color: $bg-color;
}

#app {
  font-family: "Lucida Console", sans-serif;
  text-align: center;
  font-size: 2vw;
  color: $text-color;
  padding: 2vh 10vw;
}

nav {
  padding: 3vh 3vw;
  margin-bottom: 5vh;
  font-weight: bold;

  a {
    text-decoration: none;
    color: inherit;
  }

  a.router-link-exact-active {
    color: $primary;
  }
}
</style>
