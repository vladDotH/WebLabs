<template>
  <form ref="form" @submit.prevent="onSubmit">
    <div class="mb-3">
      <label for="title" class="form-label fs-4 fw-semibold">Название</label>
      <input
        v-model="book.title"
        :class="book.title === '' ? 'is-invalid' : 'is-valid'"
        type="text"
        class="form-control"
        id="title"
        required
        placeholder="Название книги"
      />
    </div>

    <div class="mb-3 mt-3">
      <label for="author" class="form-label fs-4 fw-semibold">Автор</label>
      <input
        v-model="book.author"
        :class="book.author === '' ? 'is-invalid' : 'is-valid'"
        type="text"
        class="form-control"
        id="author"
        required
        placeholder="ФИО автора"
      />
    </div>

    <div class="mb-3 mt-3">
      <label for="year" class="form-label fs-4 fw-semibold">Год</label>
      <input
        v-model="book.year"
        :class="book.year == '' ? 'is-invalid' : 'is-valid'"
        type="number"
        class="form-control"
        id="year"
        required
      />
    </div>

    <div class="mt-3">
      <label for="cover" class="form-label fs-4 fw-semibold">Обложка</label>
      <input
        type="file"
        class="form-control"
        id="cover"
        ref="cover"
        placeholder="Обложка книги"
        accept="image/*"
      />
    </div>
  </form>
</template>

<script lang="ts">
import { Component, Emit, Vue } from "vue-property-decorator";
import { BookData } from "@/../api";

// Компонент формы редактирования книги, используется в модальном окне добавления и на странице самой книги
@Component({})
export default class BookForm extends Vue {
  readonly book: BookData = { title: "", author: "", year: 0 };

  $refs!: {
    cover: HTMLInputElement;
    form: HTMLFormElement;
  };

  // Сброс формы
  reset() {
    this.$refs.form.reset();
    [this.book.title, this.book.author, this.book.year] = ["", "", 1970];
  }

  // Попытка "отправить" форму, если валидация пройдена вызываются события submit-data и submit-form
  requestSubmit() {
    this.$refs.form.requestSubmit();
  }

  // Проброс события submit формы
  private onSubmit() {
    this.submitData();
    this.submitForm();
  }

  // Отправка данных в виде FormDat-ы
  @Emit("submit-form")
  private submitForm(): FormData {
    let form = new FormData();
    form.append("title", this.book.title);
    form.append("author", this.book.author);
    form.append("year", this.book.year.toString());
    if (this.$refs.cover.files?.length) {
      form.append("cover", this.$refs.cover.files[0]);
    }
    return form;
  }

  // Отправка данных в виде объекта книги и файла
  @Emit("submit-data")
  private submitData(): [BookData, File | null] {
    return [this.book, this.$refs.cover.files?.item(0) ?? null];
  }
}
</script>

<style scoped lang="scss"></style>
