<template>
  <section class="container">
    <div class="col-lg-8 m-auto">
      <UsersList :list="friends.list" />
    </div>
  </section>
</template>

<script lang="ts">
import { Component, InjectReactive, Vue } from "vue-property-decorator";
import axios from "axios";
import { config, Status, UserAuthData } from "@/../api";
import Toaster from "@/components/Toaster.vue";
import { Views } from "@/router";
import { FriendsLoader, FriendsPostsLoader, SelfLoader } from "@/loaders";
import UsersList from "@/components/lists/UsersList.vue";

// Страница входа
@Component({
  components: { UsersList },
})
export default class Friends extends Vue {
  @InjectReactive() readonly self!: SelfLoader;
  friends: FriendsLoader | null = null;

  private created() {
    if (this.self.id) {
      this.friends = new FriendsLoader(this.self.id);
      this.friends.fetch();
    }
  }
}
</script>

<style scoped lang="scss"></style>
