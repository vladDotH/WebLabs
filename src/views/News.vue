<template>
  <section class="container">
    <div class="col-lg-8 m-auto">
      <button class="btn btn-primary mt-3">Новая запись</button>
      <PostsList :list="posts.list"></PostsList>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, InjectReactive, Vue } from "vue-property-decorator";

import { FriendsPostsLoader, SelfLoader } from "@/loaders";
import PostsList from "@/components/lists/PostsList.vue";

// Страница входа
@Component({ components: { PostsList } })
export default class News extends Vue {
  @InjectReactive() readonly self!: SelfLoader;
  posts: FriendsPostsLoader | null = null;

  private created() {
    if (this.self.id) {
      this.posts = new FriendsPostsLoader(this.self.id);
      this.posts.fetch();
    }
  }
}
</script>

<style scoped lang="scss"></style>
