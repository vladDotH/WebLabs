<template>
  <div class="book row m-3" v-if="loader.book">
    <div class="cover col-4" ref="cover" @click="toBook"></div>
    <div class="col-8 p-4">
      <h4>{{ loader.book.title }}</h4>
      <h5>{{ loader.book.author }}</h5>
      <h6 class="text-muted">{{ loader.book.year }}</h6>

      <div :class="{ 'opacity-0': !loader.book.holder }">
        <p class="mt-4 mb-0">Взял: {{ loader.book.holder }}</p>
        <p>
          Дата возврата:
          <span
            :class="{
              'text-danger': expired(loader.book),
            }"
          >
            {{ loader.book.returnDate }}
          </span>
        </p>
      </div>

      <div class="row justify-content-around">
        <button
          v-if="!loader.book.holder"
          class="col-5 btn btn-warning"
          @click="action(BookAction.GIVE)"
        >
          Выдать
        </button>
        <button
          v-else
          class="col-5 btn btn-info"
          @click="action(BookAction.RETURN)"
        >
          Вернуть
        </button>
        <button class="col-5 btn btn-danger" @click="action(BookAction.DELETE)">
          Удалить
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from "vue-property-decorator";
import { BookLoader } from "@/util/BookLoader";
import { expired } from "@/../api";

// Действия передаваемые из карточки книги
export enum BookAction {
  DELETE,
  GIVE,
  RETURN,
}

@Component({})
export default class BookCard extends Vue {
  @Prop({ type: Number, required: true }) readonly id!: number;
  private loader: BookLoader = new BookLoader(this.id);
  private BookAction = BookAction;
  private expired = expired;

  $refs!: {
    cover: HTMLDivElement;
  };

  private async mounted() {
    this.loader = new BookLoader(this.id);
    await this.loader.fetch();
    console.log(this.loader.book);
    if (this.loader.book?.cover)
      this.$refs.cover.style.backgroundImage = `url(${
        this.loader.coverUrl
      }?cache=${Date.now()})`;
  }

  // Событие карточки (удаление, выдача, возврат)
  @Emit("action")
  private action(act: BookAction): [BookAction, BookLoader] {
    return [act, this.loader];
  }

  // Переход на страницу редактирования книги
  private toBook() {
    if (this.loader?.id !== undefined)
      this.$router.push({
        name: "book",
        params: { book_id: this.loader.id.toString() },
      });
  }
}
</script>

<style scoped lang="scss">
@import "../styles/main";

.book {
  background-color: $bg-light;

  .cover {
    background: linear-gradient(to right bottom, $primary 25%, $secondary);
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center center;
    transition: all 0.3s ease-in-out;

    &:hover {
      cursor: pointer;
      transform: scale(0.98);
    }
  }
}
</style>
