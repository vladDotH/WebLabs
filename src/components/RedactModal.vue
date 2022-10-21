<template>
  <form
    class="modal fade"
    data-bs-backdrop="static"
    ref="form"
    @submit.prevent="submit"
  >
    <div class="modal-dialog modal-dialog-centered modal-md">
      <div class="modal-content">
        <h3 class="modal-header">Редактировать Пользователя</h3>
        <div class="modal-body" v-if="loader?.data">
          <div class="mb-3">
            <label>Фамилия</label>
            <input
              required
              class="form-control"
              type="text"
              v-model="buffer.surname"
              placeholder="Иванов"
            />
          </div>

          <div class="mb-3">
            <label>Имя</label>
            <input
              required
              class="form-control"
              type="text"
              v-model="buffer.name"
              placeholder="Иван"
            />
          </div>

          <div class="mb-3">
            <label>Отчество</label>
            <input
              class="form-control"
              type="text"
              v-model="buffer.lastName"
              placeholder="Иванович"
            />
          </div>

          <div class="mb-3">
            <label>Дата рождения</label>
            <input
              required
              class="form-control"
              type="date"
              v-model="buffer.birthDate"
              placeholder="1970-01-01"
            />
          </div>

          <div class="mb-3">
            <label>Адрес электронной почты</label>
            <input
              required
              class="form-control"
              type="email"
              v-model="buffer.email"
              placeholder="example@mail.com"
            />
          </div>

          <div class="mb-3">
            <label class="d-block">Роль</label>
            <div class="btn-group">
              <input
                type="radio"
                class="btn-check"
                name="role"
                id="user"
                v-model="buffer.role"
                :value="Role.USER"
              />
              <label class="btn btn-outline-secondary" for="user"
                >Пользователь</label
              >

              <input
                type="radio"
                class="btn-check"
                name="role"
                id="admin"
                v-model="buffer.role"
                :value="Role.ADMIN"
              />
              <label class="btn btn-outline-info" for="admin"
                >Администратор</label
              >
            </div>
          </div>

          <div class="mb-3">
            <label class="d-block">Статус</label>
            <div class="btn-group">
              <input
                type="radio"
                class="btn-check"
                name="status"
                id="active"
                v-model="buffer.status"
                :value="Status.ACTIVE"
              />
              <label class="btn btn-outline-success" for="active"
                >Активный</label
              >

              <input
                type="radio"
                class="btn-check"
                name="status"
                id="unconfirmed"
                v-model="buffer.status"
                :value="Status.UNCONFIRMED"
              />
              <label class="btn btn-outline-warning" for="unconfirmed">
                Не подтверждённый
              </label>

              <input
                type="radio"
                class="btn-check"
                name="status"
                id="blocked"
                v-model="buffer.status"
                :value="Status.BLOCKED"
              />
              <label class="btn btn-outline-danger" for="blocked">
                Заблокированный
              </label>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="modal.hide()">
            Отмена
          </button>
          <button
            type="button"
            class="btn btn-info"
            @click="$refs.form.requestSubmit()"
          >
            Обновить
          </button>
        </div>
      </div>
    </div>
  </form>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Modal } from "bootstrap";
import { UserLoader } from "@/loaders";
import { Role, Status, UserData } from "@/../api";

// Всплывающее окно редактирования пользователя
@Component
export default class RedactModal extends Vue {
  private Status = Status;
  private Role = Role;
  private modal!: Modal;
  private loader: UserLoader | null = null;
  private buffer: UserData | null = null;

  $refs!: {
    form: HTMLFormElement;
  };

  private mounted() {
    this.modal = new Modal(this.$refs.form);
  }

  show(loader: UserLoader) {
    this.loader = loader;
    if (loader.data) this.buffer = { ...loader.data };
    this.modal.show();
  }

  private submit() {
    this.modal.hide();
    if (this.loader?.data && this.buffer) this.loader.data = { ...this.buffer };
    this.loader?.updatePersonal();
    this.loader?.updateStatus();
    this.loader = null;
  }
}
</script>

<style scoped lang="scss"></style>
