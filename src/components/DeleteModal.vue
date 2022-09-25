<template>
  <section class="modal fade" data-bs-backdrop="static" ref="modal">
    <div class="modal-dialog modal-dialog-centered modal-sm">
      <div class="modal-content text-center">
        <div class="modal-header justify-content-center">
          <h5 class="modal-title">Подтвердить удаление</h5>
        </div>
        <div class="modal-footer justify-content-around">
          <button class="btn btn-secondary" @click="modal.hide()">
            Отмена
          </button>
          <button class="btn btn-danger" @click="deleteEvent">Удалить</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Emit, Vue } from "vue-property-decorator";
import { Modal } from "bootstrap";

// Всплывающее окно подтверждения удаления книги
@Component
export default class DeleteModal extends Vue {
  private modal!: Modal;

  $refs!: {
    modal: HTMLDivElement;
  };

  private mounted() {
    this.modal = new Modal(this.$refs.modal);
  }

  show() {
    this.modal.show();
  }

  @Emit("delete")
  private deleteEvent() {
    this.modal.hide();
  }
}
</script>

<style scoped lang="scss"></style>
