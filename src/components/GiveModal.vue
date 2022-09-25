<template>
  <section class="modal fade" data-bs-backdrop="static" ref="modal">
    <form
      class="modal-dialog modal-dialog-centered modal-sm"
      @submit.prevent="accept"
      @reset.prevent="modal.hide()"
    >
      <div class="modal-content">
        <div class="modal-header justify-content-center">
          <h5 class="modal-title">Выдать книгу</h5>
        </div>

        <div class="modal-body">
          <label for="name" class="form-label">Читатель</label>
          <input
            type="text"
            v-model="name"
            class="form-control"
            id="name"
            :class="name === '' ? 'is-invalid' : 'is-valid'"
            required
          />

          <label for="name" class="mt-2 form-label">Срок выдачи (дни)</label>
          <input
            type="number"
            v-model="days"
            class="form-control"
            id="name"
            min="0"
          />
        </div>

        <div class="modal-footer justify-content-around">
          <button type="reset" class="btn btn-secondary">Отмена</button>
          <button type="submit" class="btn btn-info">Выдать</button>
        </div>
      </div>
    </form>
  </section>
</template>

<script lang="ts">
import { Component, Emit, Vue } from "vue-property-decorator";
import { Modal } from "bootstrap";
import { Holder } from "@/../api";

// Всплывающее окно выдачи книги
@Component
export default class GiveModal extends Vue {
  private modal!: Modal;
  private name = "";
  private days = 0;

  $refs!: {
    modal: HTMLDivElement;
  };

  private mounted() {
    this.modal = new Modal(this.$refs.modal);
  }

  show() {
    this.modal.show();
    this.name = "";
    this.days = 0;
  }

  private accept() {
    if (this.name !== "") {
      this.modal.hide();
      this.giveEvent();
    }
  }

  @Emit("give")
  private giveEvent(): Holder {
    let date = new Date();
    let days = +date.getDate() + +this.days;
    date.setDate(days);
    return { holder: this.name, returnDate: date.toISOString().split("T")[0] };
  }
}
</script>

<style scoped lang="scss"></style>
