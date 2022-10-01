<template>
  <section class="row justify-content-center">
    <!-- Верхняя панель с фильтром и кнопкой добавить -->
    <div
      class="filter row align-items-center p-3 rounded justify-content-between"
    >
      <div class="col-8 col-md-10 form-floating">
        <select
          id="select"
          class="form-select"
          @change="loader.fetch($event.target.value)"
        >
          <option :value="RequestType.ALL" selected>Все</option>
          <option :value="RequestType.AVAILABLE">В наличии</option>
          <option :value="RequestType.EXPIRED">Возврат просрочен</option>
        </select>
        <label for="select" class="ms-2">Фильтр</label>
      </div>
      <button
        class="col-4 col-md-2 btn btn-success"
        @click="$refs.addModal.show()"
      >
        Добавить
      </button>
    </div>

    <!-- Список книг -->
    <article class="col-xs-12 col-md-10 col-lg-6 mt-4 p-0">
      <transition-group v-if="loader.books" name="books">
        <BookCard
          v-for="id of loader.books"
          :id="id"
          :key="id"
          ref="bookCards"
          @action="bookAction(...$event)"
        ></BookCard>
      </transition-group>
    </article>

    <!-- Модальные окна -->
    <DeleteModal ref="deleteModal" @delete="onDelete"> </DeleteModal>
    <GiveModal ref="giveModal" @give="onGive"></GiveModal>
    <BookFormModal ref="addModal" @submit="loader.add($event)"></BookFormModal>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import BookCard, { BookAction } from "@/components/BookCard.vue";
import { Holder, RequestType } from "@/../api";
import DeleteModal from "@/components/DeleteModal.vue";
import GiveModal from "@/components/GiveModal.vue";
import { BookLoader } from "@/util/BookLoader";
import BookFormModal from "@/components/BookFormModal.vue";
import { ListLoader } from "@/util/ListLoader";

// Список книг с фильтрами
@Component({
  components: { BookFormModal, GiveModal, DeleteModal, BookCard },
})
export default class BooksListView extends Vue {
  private RequestType = RequestType;
  private loader = new ListLoader();
  // Контроллер книги выбранной в карточке (передаётся из её действия)
  private selected: BookLoader | null = null;

  $refs!: {
    deleteModal: DeleteModal;
    giveModal: GiveModal;
    addModal: BookFormModal;
  };

  private mounted() {
    this.loader.fetch(RequestType.ALL);
  }

  private onDelete() {
    this.selected?.deleteBook();
    this.loader.remove(this.selected?.id);
  }

  private onGive(holder: Holder) {
    this.selected?.patchBook(holder);
  }

  // Обработка действий из карточек
  private bookAction(act: BookAction, loader: BookLoader) {
    this.selected = loader;
    switch (act) {
      case BookAction.DELETE:
        this.$refs.deleteModal.show();
        break;
      case BookAction.GIVE:
        this.$refs.giveModal.show();
        break;
      case BookAction.RETURN:
        loader.patchBook({ holder: null, returnDate: null });
        break;
    }
  }
}
</script>

<style scoped lang="scss">
@import "../styles/main";

.filter {
  background-color: $bg-grey2;
}

.books-enter-active,
.books-leave-active {
  transition: all 0.5s ease-in-out;
}

.books-enter-to,
.books-leave {
  max-height: 40vh;
}

.books-enter,
.books-leave-to {
  opacity: 0;
  max-height: 0;
}
</style>
