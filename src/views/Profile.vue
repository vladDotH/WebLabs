<template>
  <section>
    <UserCard
      :id="id"
      class="m-auto"
      :key="id"
      :configurable="user.isAdmin"
    ></UserCard>

    <nav class="col-lg-8 m-auto mt-2 btn-group w-100">
      <router-link
        v-for="link of categories"
        :key="link[0]"
        :to="{ name: link[0] }"
        class="btn btn-outline-primary"
        exact-active-class="active"
      >
        {{ link[1] }}
      </router-link>
    </nav>

    <div class="my-3">
      <transition name="user-view" mode="out-in">
        <router-view v-if="loader?.list" :list="loader.list"></router-view>
      </transition>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, InjectReactive, Vue, Watch } from "vue-property-decorator";
import UserCard from "@/components/UserCard.vue";
import { Route } from "vue-router";
import { Views } from "@/router";
import {
  FriendsLoader,
  FriendsPostsLoader,
  ListLoader,
  PhotosLoader,
  PostsLoader,
  UserController,
} from "@/util";

// Страница пользователя
@Component({
  components: { UserCard },
})
export default class UserView extends Vue {
  private id = 0;
  private loader: ListLoader | null = null;
  @InjectReactive() readonly user!: UserController;

  readonly categories = [
    [Views.USER_POSTS, "Новости"],
    [Views.USER_PHOTOS, "Фото"],
    [Views.USER_FRIENDS, "Друзья"],
    [Views.USER_FRIENDSPOSTS, "Новости друзей"],
  ];

  private mounted() {
    this.onRouteChange(this.$route);
  }

  @Watch("$route")
  onRouteChange(to: Route) {
    const id = parseInt(this.$route.params.user_id);
    if (id == this.user.id) {
      this.$router.push({ name: Views.PROFILE });
    }
    this.id = id;

    (this.loader =
      ((): ListLoader | undefined => {
        switch (to.name as Views) {
          case Views.USER_POSTS:
            return new PostsLoader(this.id);
          case Views.USER_PHOTOS:
            return new PhotosLoader(this.id);
          case Views.USER_FRIENDS:
            return new FriendsLoader(this.id);
          case Views.USER_FRIENDSPOSTS:
            return new FriendsPostsLoader(this.id);
        }
      })() ?? null)?.fetch();
  }
}
</script>

<style scoped lang="scss">
.user-view-enter-active,
.user-view-leave-active {
  transition: all 0.3s;
}
.user-view-enter,
.user-view-leave-to {
  opacity: 0;
}
</style>
