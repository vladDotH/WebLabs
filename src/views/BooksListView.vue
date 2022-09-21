<template>
  <section class="row justify-content-center">
    <!-- Верхняя панель с фильтром и кнопкой добавить -->
    <div
      class="filter row align-items-center p-3 rounded justify-content-between"
    >
      <div class="col-1 fs-5">Фильтр:</div>
      <div class="col-9">
        <select class="form-select" @change="load($event.target.value)">
          <option :value="RequestType.ALL" selected>Все</option>
          <option :value="RequestType.AVAILABLE">В наличии</option>
          <option :value="RequestType.EXPIRED">Возврат просрочен</option>
        </select>
      </div>
      <button class="col-2 btn btn-success" @click="addBook">Добавить</button>
    </div>

    <!-- Список книг -->
    <div class="col-6 mt-4 p-0">
      <transition-group name="books">
        <BookCard
          v-for="id of books"
          :id="id"
          :key="id"
          ref="bookCards"
          @book-action="actionHandler($event, id)"
        ></BookCard>
      </transition-group>
    </div>

    <!-- Модальные окна -->
    <DeleteModal ref="deleteModal" @delete="deleteBook"> </DeleteModal>
    <GiveModal ref="giveModal" @give="patchBook"></GiveModal>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import BookCard from "@/components/BookCard.vue";
import { BookCardAction } from "@/components/BookCard.vue";
import axios from "axios";
import { BookTemplate, config, Holder, RequestType } from "@/../api";
import DeleteModal from "@/components/DeleteModal.vue";
import GiveModal from "@/components/GiveModal.vue";

@Component({
  components: { GiveModal, DeleteModal, BookCard },
})
export default class BooksListView extends Vue {
  private RequestType = RequestType;
  private books: number[] = [];
  private actionId = -1;

  $refs!: {
    deleteModal: DeleteModal;
    giveModal: GiveModal;
    bookCards: BookCard[];
  };

  private mounted() {
    this.load(RequestType.ALL);
  }

  private async load(req: RequestType) {
    let url = new URL(config.endpoints.bookList, config.server);
    url.searchParams.append(config.reqTypeName, req.toString());
    let res = await axios.get<number[]>(url.toString());
    this.books = res.data;
  }

  private actionHandler(act: BookCardAction, id: number) {
    this.actionId = id;
    switch (act) {
      case BookCardAction.DELETE:
        this.$refs.deleteModal.show();
        break;
      case BookCardAction.GIVE:
        this.$refs.giveModal.show();
        break;
      case BookCardAction.RETURN:
        this.patchBook({ holder: null, returnDate: null });
        break;
    }
  }

  private async addBook() {
    let url = new URL(config.endpoints.book, config.server);
    let res = await axios.post<number>(url.toString(), BookTemplate);
    this.books.unshift(res.data);
  }

  private deleteBook() {
    let url = new URL(config.endpoints.book + this.actionId, config.server);
    this.books.splice(this.books.indexOf(this.actionId), 1);
    axios.delete(url.toString());
  }

  private patchBook(data: Holder) {
    console.log("patch", data);
    let url = new URL(config.endpoints.book + this.actionId, config.server);
    axios.patch(url.toString(), data as Holder);
    this.$refs.bookCards.find((bc) => bc.id == this.actionId)?.patch(data);
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
.books-enter,
.books-leave-to {
  opacity: 0;
  transform: translatex(-5%);
}
</style>
