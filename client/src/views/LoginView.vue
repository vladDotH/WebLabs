<template>
  <form
    class="login container border shadow rounded-3 col-10 col-md-8 col-lg-6 mt-5 p-5"
    @submit.prevent="submit"
  >
    <div class="fs-3">
      <label for="login" class="form-label">Логин</label>
      <input
        v-model="ad.login"
        type="text"
        class="form-control"
        :class="{ 'is-invalid': !valid }"
        @keydown="reset"
        id="login"
        required
      />

      <label for="pwd" class="mt-3 form-label">Пароль</label>
      <input
        v-model="ad.password"
        type="password"
        class="form-control"
        :class="{ 'is-invalid': !valid }"
        @keydown="reset"
        id="pwd"
        required
      />
      <div class="invalid-feedback">Неверный логин или пароль</div>
    </div>
    <div class="mt-4 row d-flex justify-content-center">
      <button
        type="submit"
        class="btn btn-primary col-6 fs-3 fw-bold"
        id="loginButton"
      >
        Вход
      </button>
    </div>
  </form>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { AuthData, Roles } from "@stocks_exchange/server";
import { Views } from "@/router";

// Страница входа
@Component({})
export default class LoginView extends Vue {
  private ad: AuthData = { login: "", password: "" };
  private valid = true;

  private async submit() {
    if (await this.$store.dispatch("login", this.ad))
      this.$router.push(
        this.$store.state.self?.role === Roles.ADMIN
          ? { name: Views.BROKERS }
          : { name: Views.BROKER }
      );
    else this.valid = false;
  }

  private reset() {
    this.valid = true;
  }
}
</script>

<style scoped lang="scss"></style>
