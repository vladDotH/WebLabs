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
          <span v-if="loader?.id">Редактировать брокера #{{ loader.id }}</span>
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
          <button type="button" class="btn btn-secondary" @click="modal.hide()">
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
import { BrokerLoader, BrokersListLoader } from "@/util";
import { Roles, User } from "@stocks_exchange/server";

// Всплывающее окно добавления/редактирования брокера
@Component({})
export default class BrokerModalForm extends Vue {
  private modal!: Modal;
  private loader: BrokerLoader | BrokersListLoader | null = null;
  private buffer: User = {
    balance: 0,
    password: "",
    login: "",
    role: Roles.BROKER,
    stocks: [],
  };
  private invalidLogin = false;

  private resetLogin() {
    this.invalidLogin = false;
  }

  $refs!: {
    form: HTMLFormElement;
  };

  private mounted() {
    this.modal = new Modal(this.$refs.form);
  }

  show(loader: BrokerLoader | BrokersListLoader) {
    this.loader = loader;
    if (loader instanceof BrokerLoader && loader.data) {
      this.buffer = { ...loader.data };
    } else {
      Object.assign(this.buffer, { login: "", password: "", balance: 0 });
    }
    this.modal.show();
    this.invalidLogin = false;
  }

  private async submit() {
    let res = 0;
    if (this.loader instanceof BrokerLoader) {
      res = +(await this.loader.update(this.buffer));
    } else {
      if (this.loader) res = await this.loader.add(this.buffer);
    }
    if (res) {
      this.loader = null;
      this.modal.hide();
    } else {
      this.invalidLogin = true;
    }
  }
}
</script>

<style scoped lang="scss"></style>
