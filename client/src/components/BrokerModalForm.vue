<template>
  <form
    class="modal fade"
    data-bs-backdrop="static"
    ref="form"
    @submit.prevent="submit"
  >
    <div class="modal-dialog modal-dialog-centered modal-md">
      <div class="modal-content">
        <h3 class="modal-header">
          <span v-if="buffer.id">Редактировать брокера #{{ buffer.id }}</span>
          <span v-else>Добавить брокера</span>
        </h3>
        <div class="modal-body">
          <div class="mb-3">
            <h5>Логин</h5>
            <input
              class="form-control"
              type="text"
              v-model="buffer.login"
              placeholder="BrokerLogin"
              required
              :class="{ 'is-invalid': invalidLogin }"
              @input="resetLogin"
            />
            <div class="invalid-feedback">Имя пользователя занято</div>
          </div>
          <div class="mb-3">
            <h5>Пароль</h5>
            <input
              class="form-control"
              type="text"
              v-model="buffer.password"
              placeholder="pwd"
              required
            />
          </div>
          <div class="mb-3">
            <h5>Баланс $</h5>
            <input
              class="form-control"
              type="number"
              v-model="buffer.balance"
              placeholder="300"
            />
          </div>

          <div class="mb-3"></div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="close">
            Отмена
          </button>
          <button
            type="button"
            class="btn btn-primary"
            @click="$refs.form.requestSubmit()"
          >
            Подтвердить
          </button>
        </div>
      </div>
    </div>
  </form>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Modal } from "bootstrap";
import { Roles, User } from "@stocks_exchange/server";

// Всплывающее окно добавления/редактирования брокера
@Component({})
export default class BrokerModalForm extends Vue {
  private modal!: Modal;
  private buffer: User = {
    balance: 0,
    password: "",
    login: "",
    role: Roles.BROKER,
    stocks: [],
  };
  private invalidLogin = false;
  private promiseResolve: (value: User | null) => void = () => {
    /**/
  };

  private resetLogin() {
    this.invalidLogin = false;
  }

  $refs!: {
    form: HTMLFormElement;
  };

  private mounted() {
    this.modal = new Modal(this.$refs.form);
  }

  clear() {
    [
      this.buffer.login,
      this.buffer.password,
      this.buffer.balance,
      this.buffer.id,
    ] = ["", "", 0, undefined];
    this.resetLogin();
  }

  show(user?: User): Promise<User | null> {
    if (user) this.buffer = { ...user };
    this.modal.show();
    return new Promise((resolve) => {
      this.promiseResolve = resolve;
    });
  }

  hide() {
    this.modal.hide();
  }

  invalidate() {
    this.invalidLogin = true;
  }

  private close() {
    this.promiseResolve(null);
    this.hide();
  }

  private async submit() {
    this.promiseResolve({ ...this.buffer });
  }
}
</script>

<style scoped lang="scss"></style>
