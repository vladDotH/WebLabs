<template>
  <section class="login container rounded-3 col-6 p-5">
    <h2>
      <button class="container btn fs-1 fw-bold text-center">Вход</button>
    </h2>

    <div class="fs-3">
      <label for="login" class="form-label">Логин</label>
      <input type="text" class="form-control" id="login" />

      <label for="pwd" class="mt-3 form-label">Пароль</label>
      <input type="password" class="form-control" id="pwd" />
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({})
export default class LoginView extends Vue {}
</script>

<style scoped lang="scss">
@import "../styles/main";
.login {
  background-color: $primary;
  color: $text-light;

  button {
    color: $text-light;
  }
  input {
    border-color: white;
    outline-color: white;
    box-shadow: white 1px 1px;
  }
}
</style>
