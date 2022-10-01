<template>
  <div class="book row m-3 d-flex justify-content-center" v-if="loader.book">
    <div
      class="cover col-6 col-md-4 d-flex align-items-center"
      ref="cover"
      :class="loader.book?.cover ? 'image' : 'empty'"
    >
      <img class="" width="100%" :src="loader.book.cover" />
    </div>
    <div class="col-12 col-md-8 p-4">
      <div class="row">
        <h4 class="col-10">
          {{ loader.book.title }}
        </h4>
        <router-link
          class="col-2 fs-5"
          :to="{
            name: 'book',
            params: { book_id: this.loader.id.toString() },
          }"
        >
          <font-awesome-icon icon="fa-gears" />
        </router-link>
      </div>
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
          class="col-5 col-md-4 btn btn-warning"
          @click="action(BookAction.GIVE)"
        >
          Выдать
        </button>
        <button
          v-else
          class="col-5 col-md-4 btn btn-info"
          @click="action(BookAction.RETURN)"
        >
          Вернуть
        </button>
        <button
          class="col-5 col-md-4 btn btn-danger"
          @click="action(BookAction.DELETE)"
        >
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

// Карточка книги в списке книг
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
  }

  // Событие карточки (удаление, выдача, возврат)
  @Emit("action")
  private action(act: BookAction): [BookAction, BookLoader] {
    return [act, this.loader];
  }
}
</script>

<style scoped lang="scss">
@import "../styles/main";

.book {
  background-color: $bg-light;
  box-shadow: 10px 10px 10px $bg-grey2;

  .cover {
    transition: all 0.3s ease-in-out;
    &.image {
      background-size: contain;
    }
    &.empty {
      background: linear-gradient(to right bottom, $primary 25%, $secondary)
        no-repeat center center;
    }
    &:hover {
      transform: scale(0.98);
    }
  }
}
</style>
