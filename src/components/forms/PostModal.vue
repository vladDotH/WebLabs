<template>
  <form
    class="modal fade"
    data-bs-backdrop="static"
    ref="form"
    @submit.prevent="submit"
  >
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <h3 class="modal-header">Опубликовать запись</h3>
        <div class="modal-body">
          <div class="mb-3">
            <textarea class="form-control" v-model="text" rows="5" />
          </div>

          <div class="mb-3">
            <label>Прикрепить файлы</label>
            <input class="form-control" type="file" ref="files" multiple />
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
            Опубликовать
          </button>
        </div>
      </div>
    </div>
  </form>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Modal } from "bootstrap";
import { PostLoader, PostsLoader } from "@/util";

// Всплывающее окно добавления новости
@Component
export default class PostModal extends Vue {
  private modal!: Modal;
  private text = "";
  private loader: PostsLoader | null = null;

  $refs!: {
    form: HTMLFormElement;
    files: HTMLInputElement;
  };

  private mounted() {
    this.modal = new Modal(this.$refs.form);
  }

  show(loader: PostsLoader) {
    this.loader = loader;
    this.text = "";
    if (this.$refs.files) this.$refs.files.value = "";
    this.modal.show();
  }

  private async submit() {
    this.$refs.files.files;
    if (this.loader) {
      let loader = this.loader;
      this.loader = null;
      loader.list.splice(
        0,
        0,
        await PostLoader.makePost(this.text, this.$refs.files.files)
      );
    }
    this.loader = null;
    this.modal.hide();
  }
}
</script>

<style scoped lang="scss"></style>
