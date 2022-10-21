<template>
  <form
    class="login container border shadow rounded-3 col-md-10 mt-5 p-5"
    @submit.prevent="submit"
  >
    <div class="fs-3">
      <label for="login" class="form-label">Email</label>
      <input
        v-model="user.email"
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
    </div>
    <div class="mt-4 row d-flex justify-content-center">
      <button type="submit" class="btn btn-primary col-6 fs-3 fw-bold">
        Вход
      </button>
    </div>
  </form>
</template>

<script lang="ts">
import { Component, InjectReactive, Vue } from "vue-property-decorator";
import axios from "axios";
import { config, Status, UserAuthData } from "@/../api";
import Toaster from "@/components/Toaster.vue";
import { Views } from "@/router";

// Страница входа
@Component({})
export default class LoginView extends Vue {
  @InjectReactive() readonly toaster!: Toaster | null;
  private user: UserAuthData = { email: "", password: "" };
  private valid = true;

  private readonly url = new URL(
    config.endpoints.login,
    config.server
  ).toString();

  private async submit() {
    try {
      await axios.post<UserAuthData>(this.url, this.user);
      this.$router.push({ name: Views.HOME });
    } catch (err) {
      this.toaster?.show(Status.BLOCKED, "Неверные данные для входа");
      this.valid = false;
    }
  }

  private reset() {
    this.valid = true;
  }
}
</script>

<style scoped lang="scss"></style>
