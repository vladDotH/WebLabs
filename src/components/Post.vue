<template>
  <article
    v-if="post?.data"
    class="p-3 post"
    :class="{
      banned: post.data.status === Status.BLOCKED,
    }"
  >
    <section v-if="userLoader?.data" class="d-flex">
      <div
        class="col-2 col-md-1 d-flex align-items-center justify-content-center card-image"
      >
        <UserThumbnail class="w-100 h-100" :loader="userLoader"></UserThumbnail>
      </div>
      <div
        class="col-9 col-md-10 d-flex flex-column justify-content-between ps-3 card-content"
      >
        <h6>{{ userLoader.fullName }}</h6>
        <h6 class="text-muted fw-normal">
          {{ new Date(post.data.time).toLocaleString() }}
        </h6>
      </div>
      <BanSwitcher
        :status="post.data.status"
        class="col-1 text-danger icon fs-2 p-1"
        @switched="switchStatus"
      />
    </section>
    <section class="mt-2">
      {{ post.data.text }}
    </section>
    <section>
      <Carousel
        v-if="post.data?.photosId?.length"
        :list="post.data.photosId"
        class="mt-3"
      ></Carousel>
    </section>
  </article>
</template>

<script lang="ts">
import { Component, InjectReactive, Prop, Vue } from "vue-property-decorator";
import { PostLoader, UserController, UserLoader } from "@/util";
import Carousel from "@/components/lists/Carousel.vue";
import UserThumbnail from "@/components/UserThumbnail.vue";
import BanSwitcher from "@/components/BanSwitcher.vue";
import Toaster, { States } from "@/components/Toaster.vue";
import { Status, Role } from "@/../api";

// Компонент поста
@Component({
  components: { BanSwitcher, UserThumbnail, Carousel },
})
export default class Post extends Vue {
  private Status = Status;
  private Role = Role;
  @InjectReactive() readonly user!: UserController;
  @InjectReactive() readonly toaster!: Toaster | null;
  @Prop({ type: Number, required: true }) readonly id!: number;

  private post: PostLoader | null = null;
  private userLoader: UserLoader | null = null;

  private async mounted() {
    this.post = new PostLoader(this.id);
    await this.post.fetch();
    if (this.post.data) this.userLoader = new UserLoader(this.post.data.userId);
    this.userLoader?.fetch();
  }

  private switchStatus(s: Status) {
    this.toaster?.show(
      s === Status.ACTIVE ? "Разблокировано" : "Заблокировано",
      s === Status.ACTIVE ? States.SUCCESS : States.DANGER
    );
    this.post?.updateStatus(s);
  }
}
</script>

<style scoped lang="scss">
@import "@/styles/main.scss";

.post {
  transition: all 0.3s ease-in-out;
}
.banned {
  background-color: $red-100;
}
</style>
