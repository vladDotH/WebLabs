<template>
  <section>
    <header
      class="header container-fluid py-2 px-5 bg-primary text-light fw-bold fs-2"
    >
      <font-awesome-icon icon="fa-solid fa-users-rays" />
    </header>
    <form
      class="login container border shadow rounded-3 col-md-8 col-xl-6 mt-5 p-5"
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
      <div
        class="mt-4 d-flex flex-column align-items-center justify-content-center fs-3 fw-bold gap-2"
      >
        <button type="submit" class="btn btn-primary col-8 col-sm-6">
          Вход
        </button>

        <button
          type="button"
          @click="register"
          class="btn btn-info col-8 col-sm-6"
        >
          Регистрация
        </button>
      </div>
    </form>
  </section>
</template>

<script lang="ts">
import { Component, InjectReactive, Vue } from "vue-property-decorator";
import { UserAuthData } from "@/../api";
import Toaster, { States } from "@/components/Toaster.vue";
import { Views } from "@/router";
import SignUpModal from "@/components/forms/SignUpModal.vue";
import { UserController } from "@/util";

// Страница входа
@Component({})
export default class LoginView extends Vue {
  @InjectReactive() readonly toaster!: Toaster | null;
  @InjectReactive() readonly signUp!: SignUpModal | null;
  private user: UserAuthData = { email: "", password: "" };
  private valid = true;

  private async submit() {
    if (await UserController.login(this.user))
      await this.$router.push({ name: Views.PROFILE });
    else {
      this.toaster?.show("Неверные данные для входа", States.DANGER);
      this.valid = false;
    }
  }

  private reset() {
    this.valid = true;
  }

  register() {
    this.signUp?.show();
  }
}
</script>

<style scoped lang="scss"></style>
