<template>
  <form
    class="modal fade"
    data-bs-backdrop="static"
    ref="form"
    @submit.prevent="update"
  >
    <div class="modal-dialog modal-dialog-centered modal-md">
      <div class="modal-content">
        <div class="modal-header">
          <h4>Обновить фотографию профиля</h4>
        </div>

        <div class="modal-body">
          <label for="formFile" class="form-label">Выберите файл</label>
          <input
            class="form-control"
            required
            type="file"
            id="formFile"
            ref="file"
          />
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="modal.hide()">
            Отмена
          </button>
          <button
            v-if="user?.loader?.data?.photoId"
            type="button"
            class="btn btn-danger"
            @click="remove"
          >
            Удалить фото
          </button>
          <button
            type="button"
            class="btn btn-warning"
            @click="$refs.form.requestSubmit()"
          >
            Загрузить
          </button>
        </div>
      </div>
    </div>
  </form>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Modal } from "bootstrap";
import { UserController } from "@/util";

// Всплывающее окно обновление фотографии профиля
@Component
export default class UpdateAvatarModal extends Vue {
  private modal!: Modal;
  private user: UserController | null = null;

  $refs!: {
    form: HTMLFormElement;
    file: HTMLInputElement;
  };

  private mounted() {
    this.modal = new Modal(this.$refs.form);
  }

  show(user: UserController) {
    this.user = user;
    this.modal.show();
  }

  private async update() {
    this.modal.hide();
    if (this.$refs.file?.files?.length)
      await this.user?.updateAvatar(this.$refs.file.files[0]);
    this.$router.go(0);
  }

  private async remove() {
    this.modal.hide();
    await this.user?.deleteAvatar();
    this.$router.go(0);
  }
}
</script>

<style scoped lang="scss"></style>
