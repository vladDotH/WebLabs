<template>
  <section>
    <PostsList :list="posts.list" class="mb-2"></PostsList>
  </section>
</template>

<script lang="ts">
import { Component, InjectReactive, Vue } from "vue-property-decorator";

import { FriendsPostsLoader, SocketManager, UserController } from "@/util";
import PostsList from "@/components/lists/PostsList.vue";
import { UserData } from "../../api";

// Страница новостей
@Component({ components: { PostsList } })
export default class News extends Vue {
  @InjectReactive() readonly user!: UserController;
  @InjectReactive() readonly socket!: SocketManager;
  posts: FriendsPostsLoader | null = null;

  private created() {
    if (this.user.id) {
      this.posts = new FriendsPostsLoader(this.user.id);
      this.posts.fetch();
    }
    this.socket.addListener(this.postsUpdate);
  }

  private beforeDestroy() {
    this.socket.removeListener(this.postsUpdate);
  }

  private postsUpdate(user: UserData) {
    this.posts?.fetch();
  }
}
</script>

<style scoped lang="scss"></style>
