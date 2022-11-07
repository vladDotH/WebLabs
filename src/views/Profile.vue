<template>
  <section class="container">
    <div class="col-lg-8 m-auto">
      <UserCard :id="self.id" />

      <button class="btn btn-primary my-2">Новая запись</button>

      <PostsList :list="posts.list"></PostsList>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, InjectReactive, Vue } from "vue-property-decorator";
import { PostsLoader, SelfLoader } from "@/loaders";
import UserCard from "@/components/UserCard.vue";
import PostsList from "@/components/lists/PostsList.vue";

// Страница входа
@Component({
  components: { PostsList, UserCard },
})
export default class Profile extends Vue {
  @InjectReactive() readonly self!: SelfLoader;
  posts: PostsLoader | null = null;

  private created() {
    if (this.self.id) {
      this.posts = new PostsLoader(this.self.id);
      this.posts.fetch();
    }
  }
}
</script>

<style scoped lang="scss"></style>
