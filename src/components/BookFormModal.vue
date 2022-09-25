<template>
  <section class="modal fade" data-bs-backdrop="static" ref="modal">
    <div class="modal-dialog modal-dialog-centered modal-md">
      <div class="modal-content">
        <div class="modal-header justify-content-around">
          <h3 class="text-center">Добавить книгу</h3>
        </div>
        <BookForm
          class="modal-body"
          ref="form"
          @submit-form="submit"
        ></BookForm>
        <div class="modal-footer d-flex justify-content-around">
          <button class="btn btn-secondary" @click="modal.hide()">
            Отмена
          </button>
          <button class="btn btn-success" @click="$refs.form.requestSubmit()">
            Добавить
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Emit, Vue } from "vue-property-decorator";
import BookForm from "@/components/BookForm.vue";
import { Modal } from "bootstrap";

// Всплывающее окно формы книги для её добавления в библиотеку
@Component({
  components: { BookForm },
})
export default class BookFormModal extends Vue {
  private modal!: Modal;

  $refs!: {
    modal: HTMLDivElement;
    form: BookForm;
  };

  private mounted() {
    this.modal = new Modal(this.$refs.modal);
  }

  show() {
    this.modal.show();
    this.$refs.form.reset();
  }

  @Emit("submit")
  private submit(event: FormData): FormData {
    this.modal.hide();
    return event;
  }
}
</script>

<style scoped lang="scss"></style>
