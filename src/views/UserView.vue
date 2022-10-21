<template>
  <section class="container">
    <UserCard :id="id" class="m-auto" :key="id"></UserCard>

    <nav class="col-lg-8 m-auto mt-2 btn-group w-100">
      <router-link
        v-for="link of categories"
        :key="link[0]"
        :to="{ name: link[0] }"
        class="btn btn-outline-primary"
        exact-active-class="active"
        >{{ link[1] }}</router-link
      >
    </nav>

    <div class="mt-3 mb-3">
      <router-view v-if="loader?.list" :list="loader.list"></router-view>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import UserCard from "@/components/UserCard.vue";
import { Route } from "vue-router";
import { Views } from "@/router";
import {
  FriendsLoader,
  FriendsPostsLoader,
  ListLoader,
  PhotosLoader,
  PostsLoader,
} from "@/loaders";

// Страница пользователя
@Component({
  components: { UserCard },
})
export default class UserView extends Vue {
  private id: number = parseInt(this.$route.params.user_id);
  private loader: ListLoader | null = null;

  readonly categories = [
    [Views.POSTS, "Новости"],
    [Views.PHOTOS, "Фото"],
    [Views.FRIENDS, "Друзья"],
    [Views.FRIENDSPOSTS, "Новости друзей"],
  ];

  private mounted() {
    this.onRouteChange(this.$route);
  }

  @Watch("$route")
  onRouteChange(to: Route) {
    const id = parseInt(this.$route.params.user_id);
    if (this.id !== id) {
      this.id = id;
    } else
      (this.loader =
        ((): ListLoader | undefined => {
          switch (to.name as Views) {
            case Views.POSTS:
              return new PostsLoader(this.id);
            case Views.PHOTOS:
              return new PhotosLoader(this.id);
            case Views.FRIENDS:
              return new FriendsLoader(this.id);
            case Views.FRIENDSPOSTS:
              return new FriendsPostsLoader(this.id);
          }
        })() ?? null)?.fetch();
  }
}
</script>

<style scoped lang="scss"></style>
