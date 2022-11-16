<template>
  <section>
    <PhotosList :list="photos.list" class="mt-3"></PhotosList>
  </section>
</template>

<script lang="ts">
import { Component, InjectReactive, Vue } from "vue-property-decorator";
import PhotosList from "@/components/lists/PhotosList.vue";
import { PhotosLoader, UserController } from "@/util";

@Component({
  components: { PhotosList },
})
export default class Photos extends Vue {
  @InjectReactive() readonly user!: UserController;
  photos: PhotosLoader | null = null;

  private created() {
    if (this.user.id) {
      this.photos = new PhotosLoader(this.user.id);
      this.photos.fetch();
    }
  }
}
</script>

<style scoped lang="scss"></style>
