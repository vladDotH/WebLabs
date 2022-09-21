<template>
  <section>
    <div class="book row m-3">
      <div class="cover col-4" ref="cover" @click="toBook"></div>
      <div class="col-8 p-4" v-if="book">
        <h4>{{ book.title }}</h4>
        <h5>{{ book.author }}</h5>
        <h6 class="text-muted">{{ book.year }}</h6>

        <div :class="{ 'opacity-0': !book.holder }">
          <p class="mt-4 mb-0">Взял: {{ book.holder }}</p>
          <p>
            Дата возврата:
            <span
              :class="{ 'text-danger': new Date() > new Date(book.returnDate) }"
            >
              {{ book.returnDate }}
            </span>
          </p>
        </div>

        <div class="row justify-content-around">
          <button
            v-if="!book.holder"
            class="col-4 btn btn-warning"
            @click="bookAction(BookCardAction.GIVE)"
          >
            Выдать
          </button>
          <button
            v-else
            class="col-4 btn btn-info"
            @click="bookAction(BookCardAction.RETURN)"
          >
            Вернуть
          </button>
          <button
            class="col-4 btn btn-danger"
            @click="bookAction(BookCardAction.DELETE)"
          >
            Удалить
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from "vue-property-decorator";
import axios from "axios";
import { Book, config, Holder } from "@/../api";

export enum BookCardAction {
  DELETE,
  GIVE,
  RETURN,
}

@Component
export default class BookCard extends Vue {
  @Prop({ type: Number }) readonly id!: number;
  private book: Book | null = null;
  private img?: string;
  private BookCardAction = BookCardAction;

  $refs!: {
    cover: HTMLDivElement;
  };

  private async mounted() {
    let res = await axios.get<Book>(
      new URL(config.endpoints.book + this.id, config.server).toString()
    );
    this.book = res.data;
    console.log(this.book);
    if (this.book.cover)
      this.$refs.cover.style.backgroundImage = `url(${new URL(
        config.endpoints.covers + this.book.cover,
        config.server
      ).toString()})`;
  }

  patch(data: Holder) {
    if (this.book) {
      this.book.holder = data.holder;
      this.book.returnDate = data.returnDate;
    }
  }

  private toBook() {
    if (this.book?.id !== undefined)
      this.$router.push({
        name: "book",
        params: { book_id: this.book.id.toString() },
      });
  }

  @Emit("book-action")
  private bookAction(act: BookCardAction): BookCardAction {
    return act;
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
