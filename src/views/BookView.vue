<template>
  <article
    class="row justify-content-center col-12 col-md-8 col-lg-6 m-auto"
    v-if="loader?.book"
  >
    <div class="redact-title text-center fs-2 p-3 fw-bold rounded">
      Редактировать книгу № {{ id }}
    </div>

    <img
      class="mt-4 col-7 col-md-6 col-lg-5"
      v-if="loader.book.cover"
      :src="loader.book.cover + `?cache=${cacheKey}`"
    />

    <BookForm ref="form" @submit-data="putBook"></BookForm>

    <div class="mb-3 mt-3">
      <p class="fs-4 fw-semibold">
        <span class="me-3">Статус:</span>
        <span class="fs-6">
          <span v-if="!loader.book.holder" class="badge text-bg-success"
            >В наличии</span
          >
          <span v-else>
            <span v-if="!expired(loader.book)" class="badge text-bg-info">
              Выдана
            </span>
            <span v-else class="badge text-bg-warning">Возврат просрочен</span>
          </span>
        </span>
      </p>

      <div v-if="loader.book.holder">
        <p
          class="mt-3 p-2 alert"
          :class="expired(loader.book) ? 'alert-danger' : 'alert-warning'"
        >
          Выдана: {{ loader.book.holder }}. Дата возврата:
          {{ loader.book.returnDate }}
        </p>
      </div>

      <div class="mt-3 p-3 d-flex justify-content-around">
        <button
          type="button"
          v-if="!loader.book.holder"
          class="btn btn-warning"
          @click="$refs.giveModal.show()"
        >
          Выдать
        </button>
        <button
          v-else
          type="button"
          class="btn btn-info"
          @click="patchBook({ holder: null, returnDate: null })"
        >
          Вернуть
        </button>
        <button
          type="button"
          class="btn btn-danger"
          @click="$refs.deleteModal.show()"
        >
          Удалить
        </button>
        <button
          type="button"
          class="btn btn-success"
          @click="$refs.form.requestSubmit()"
        >
          Обновить
        </button>
      </div>
    </div>

    <!-- Модальные окна -->
    <DeleteModal ref="deleteModal" @delete="deleteBook"> </DeleteModal>
    <GiveModal ref="giveModal" @give="patchBook"></GiveModal>

    <div class="toast-container position-fixed bottom-0 end-0 p-3">
      <div ref="saveToast" class="toast" role="alert">
        <div class="alert alert-success m-0 text-center p-2">
          <span>Обновлено</span>
        </div>
      </div>
    </div>
  </article>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { BookData, expired, Holder } from "@/../api";
import DeleteModal from "@/components/DeleteModal.vue";
import GiveModal from "@/components/GiveModal.vue";
import { Toast } from "bootstrap";
import BookForm from "@/components/BookForm.vue";
import { BookLoader } from "@/util/BookLoader";

// Страница книги
@Component({
  components: { BookForm, GiveModal, DeleteModal },
})
export default class BookView extends Vue {
  private id: number = parseInt(this.$route.params.book_id);
  private loader: BookLoader | null = null;
  private expired = expired;
  private cacheKey = 0;

  $refs!: {
    form: BookForm;
    cover: HTMLInputElement;
    saveToast: HTMLDivElement;
  };

  private async mounted() {
    this.loader = new BookLoader(this.id);
    await this.loader.fetch();
    if (this.$refs.form.book && this.loader.book)
      [
        this.$refs.form.book.title,
        this.$refs.form.book.author,
        this.$refs.form.book.year,
      ] = [
        this.loader.book.title,
        this.loader.book.author,
        this.loader.book.year,
      ];
  }

  private deleteBook() {
    this.loader?.deleteBook();
    this.$router.push({ name: "home" });
  }

  private patchBook(data: Holder) {
    this.loader?.patchBook(data);
  }

  private async putBook(form: [BookData, File | null]) {
    await this.loader?.putBook(...form);
    new Toast(this.$refs.saveToast).show();
    this.cacheKey = Date.now();
  }
}
</script>

<style scoped lang="scss">
@import "../styles/main";

.redact-title {
  background-color: $bg-grey2;
}
</style>
