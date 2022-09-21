<template>
  <section class="modal fade" data-bs-backdrop="static" id="modal" ref="modal">
    <div class="modal-dialog modal-dialog-centered modal-sm">
      <div class="modal-content text-center">
        <div class="modal-header justify-content-center">
          <h5 class="modal-title">Подтвердить удаление</h5>
        </div>
        <div class="modal-footer justify-content-around">
          <button class="btn btn-secondary" data-bs-dismiss="modal">
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
  private deleteEvent(): boolean {
    this.modal.hide();
    return true;
  }
}
</script>

<style scoped lang="scss"></style>
