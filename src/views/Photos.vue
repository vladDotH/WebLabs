<template>
  <section class="container">
    <div class="col-lg-8 m-auto">
      <PhotosList :list="photos.list" class="mt-3"></PhotosList>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, InjectReactive, Vue } from "vue-property-decorator";
import axios from "axios";
import { config, Status, UserAuthData } from "@/../api";
import Toaster from "@/components/Toaster.vue";
import { Views } from "@/router";
import PhotosList from "@/components/lists/PhotosList.vue";
import { FriendsPostsLoader, PhotosLoader, SelfLoader } from "@/loaders";

// Страница входа
@Component({
  components: { PhotosList },
})
export default class Photos extends Vue {
  @InjectReactive() readonly self!: SelfLoader;
  photos: PhotosLoader | null = null;

  private created() {
    if (this.self.id) {
      this.photos = new PhotosLoader(this.self.id);
      this.photos.fetch();
    }
  }
}
</script>

<style scoped lang="scss"></style>
