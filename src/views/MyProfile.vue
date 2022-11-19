<template>
  <section>
    <UserCard :id="user.id" configurable="true" />
    <button
      class="d-block btn btn-primary my-2"
      @click="avatarUpdate.show(user)"
    >
      Сменить фото профиля
    </button>
    <button class="d-block btn btn-primary my-2" @click="makePost">
      Новая запись
    </button>
    <PostsList :list="posts.list" class="mb-3"></PostsList>
  </section>
</template>

<script lang="ts">
import { Component, InjectReactive, Vue } from "vue-property-decorator";
import { PostsLoader, UserController } from "@/util";
import UserCard from "@/components/UserCard.vue";
import PostsList from "@/components/lists/PostsList.vue";
import UpdateAvatarModal from "@/components/forms/UpdateAvatarModal.vue";
import PostModal from "@/components/forms/PostModal.vue";

// Собственный профиль
@Component({
  components: { PostsList, UserCard },
})
export default class MyProfile extends Vue {
  @InjectReactive() readonly user!: UserController;
  @InjectReactive() readonly avatarUpdate!: UpdateAvatarModal;
  @InjectReactive() readonly postModal!: PostModal;
  posts: PostsLoader | null = null;

  private created() {
    if (this.user.id) {
      this.posts = new PostsLoader(this.user.id);
      this.posts.fetch();
    }
  }

  private makePost() {
    if (this.posts) this.postModal.show(this.posts);
  }
}
</script>

<style scoped lang="scss"></style>
