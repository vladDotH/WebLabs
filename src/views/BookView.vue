<template>
  <section class="row justify-content-center" v-if="book">
    <div class="redact text-center fs-2 p-3 fw-bold rounded">
      Редактировать книгу № {{ id }}
    </div>
    <form class="col-6">
      <div class="mb-3 mt-3">
        <label for="title" class="form-label fs-4 fw-semibold">Название</label>
        <input
          v-model="book.title"
          type="text"
          class="form-control"
          id="title"
          ref="title"
        />
      </div>

      <div class="mb-3 mt-3">
        <label for="author" class="form-label fs-4 fw-semibold">Автор</label>
        <input
          v-model="book.author"
          type="text"
          class="form-control"
          id="author"
          ref="author"
        />
      </div>

      <div class="mb-3 mt-3">
        <label for="year" class="form-label fs-4 fw-semibold">Год</label>
        <input
          v-model="book.year"
          type="number"
          class="form-control"
          id="year"
          ref="year"
        />
      </div>

      <div class="mb-3 mt-3">
        <label for="cover" class="form-label fs-4 fw-semibold">Обложка</label>
        <input type="file" class="form-control" id="cover" ref="cover" />
      </div>

      <div class="mb-3 mt-3">
        <span class="fs-4 fw-semibold me-3">Статус: </span>
        <span v-if="!book.holder" class="badge text-bg-success">В наличии</span>
        <span v-else>
          <span
            v-if="new Date() < new Date(book.returnDate)"
            class="badge text-bg-info"
          >
            Выдана
          </span>
          <span v-else class="badge text-bg-warning">Возврат просрочен</span>
        </span>

        <div v-if="book.holder">
          <p
            class="mt-3 p-2 alert"
            :class="
              new Date() < new Date(book.returnDate)
                ? 'alert-warning'
                : 'alert-danger'
            "
          >
            Выдана: {{ book.holder }}. Дата возврата: {{ book.returnDate }}
          </p>
        </div>

        <div class="mt-3 p-3 row justify-content-between">
          <button
            v-if="!book.holder"
            class="btn btn-warning col-2"
            @click="$refs.giveModal.show()"
          >
            Выдать
          </button>
          <button
            v-else
            class="btn btn-info col-2"
            @click="patchBook({ holder: null, returnDate: null })"
          >
            Вернуть
          </button>
          <button
            class="btn btn-danger col-2"
            @click="$refs.deleteModal.show()"
          >
            Удалить
          </button>
          <button class="btn btn-success col-2" @click="putBook">
            Обновить
          </button>
        </div>
      </div>
    </form>

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
  </section>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Book, config, Holder } from "@/../api";
import axios from "axios";
import DeleteModal from "@/components/DeleteModal.vue";
import GiveModal from "@/components/GiveModal.vue";
import { Toast } from "bootstrap";

@Component({
  components: { GiveModal, DeleteModal },
})
export default class BookView extends Vue {
  private id: number = parseInt(this.$route.params.book_id);
  private book: Book | null = null;
  private cover?: File;
  readonly url = new URL(config.endpoints.book + this.id, config.server);

  $refs!: {
    cover: HTMLInputElement;
    saveToast: HTMLDivElement;
  };

  private async mounted() {
    let res = await axios.get(this.url.toString());
    this.book = res.data as Book;
  }

  private deleteBook() {
    axios.delete(this.url.toString());
    this.$router.push({ name: "home" });
  }

  private patchBook(data: Holder) {
    axios.patch(this.url.toString(), data as Holder);
    if (this.book) {
      this.book.holder = data.holder;
      this.book.returnDate = data.returnDate;
    }
  }

  private putBook() {
    console.log(this.$refs.saveToast);
    let form = new FormData();
    if (this.book) {
      form.append("title", this.book.title);
      form.append("author", this.book.author);
      form.append("year", this.book.year.toString());
      if (this.$refs.cover.files) {
        form.append("cover", this.$refs.cover.files[0]);
      }
    }
    axios.put(this.url.toString(), form);

    new Toast(this.$refs.saveToast).show();
  }
}
</script>

<style scoped lang="scss">
@import "../styles/main";
.redact {
  background-color: $bg-grey2;
}
</style>
