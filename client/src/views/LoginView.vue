<template>
  <form
    class="login container border shadow rounded-3 col-10 col-md-8 col-lg-6 mt-5 p-5"
    @submit.prevent="submit"
  >
    <div class="fs-3">
      <label for="login" class="form-label">Email</label>
      <input
        v-model="user.login"
        type="text"
        class="form-control"
        :class="{ 'is-invalid': !valid }"
        @keydown="reset"
        id="login"
        required
      />

      <label for="pwd" class="mt-3 form-label">Пароль</label>
      <input
        v-model="user.password"
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
      <button type="submit" class="btn btn-primary col-6 fs-3 fw-bold">
        Вход
      </button>
    </div>
  </form>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { AuthData, config } from "@stocks_exchange/server";
import { Views } from "@/router";
import { UserController } from "@/util/UserController";

// Страница входа
@Component({})
export default class LoginView extends Vue {
  private user: AuthData = { login: "", password: "" };
  private valid = true;

  private async submit() {
    if (await UserController.login(this.user))
      this.$router.push({ name: Views.BROKERS });
    else this.valid = false;
  }

  private reset() {
    this.valid = true;
  }
}
</script>

<style scoped lang="scss"></style>
