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

<style>
body {
  background-color: #222222
}

#app {
  font-family: "Lucida Console", sans-serif;
  text-align: center;
  font-size: 2vw;
  color: #dadada;
}

nav {
  padding: 3vh 3vw;
}

nav a {
  font-weight: bold;
  text-decoration: none;
  color: inherit;
}

nav a.router-link-exact-active {
  color: #44aa44;
}
</style>
