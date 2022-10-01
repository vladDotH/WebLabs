<template>
  <form
    class="login container rounded-3 col-12 col-md-10 col-lg-6 p-5"
    @submit.prevent="submit"
  >
    <div class="fs-3">
      <label for="login" class="form-label">Логин</label>
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
        v-model="user.pwd"
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

    <div class="toast-container position-fixed bottom-0 end-0 p-3">
      <div ref="invalidToast" class="toast" role="alert">
        <div class="alert alert-danger m-0 text-center p-2">
          <span>Неверные данные для входа</span>
        </div>
      </div>
    </div>
  </form>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import axios from "axios";
import { config, User } from "@/../api";
import { Toast } from "bootstrap";

@Component({})
export default class LoginView extends Vue {
  private user: User = { login: "", pwd: "" };
  private readonly url = new URL(
    config.endpoints.login,
    config.server
  ).toString();
  private valid = true;

  $refs!: {
    invalidToast: HTMLDivElement;
  };

  private async submit() {
    try {
      await axios.post(this.url, this.user);
      this.$router.push({ name: "home" });
    } catch (err) {
      new Toast(this.$refs.invalidToast, {
        delay: 5000,
      }).show();
      this.valid = false;
    }
  }

  private reset() {
    this.valid = true;
  }
}
</script>

<style scoped lang="scss">
@import "../styles/main";
.login {
  background-color: $bg-grey2;
  box-shadow: 5px 5px 5px $bg-light;
}
</style>
