<template>
  <router-link
    :to="{
      name: Views.USER,
      params: { user_id: this.loader.id.toString() },
    }"
    class="position-relative card-image"
  >
    <font-awesome-icon
      icon="fa-circle-arrow-left"
      class="position-absolute text-info open w-100 h-100 bg-white"
    />

    <font-awesome-icon
      v-if="!loader.data.photoId"
      icon="fa-circle-user"
      class="rounded-circle img-fluid text-primary"
    />
    <img v-else :src="loader.avatarUrl" class="rounded-circle img-fluid" />
  </router-link>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { UserLoader } from "@/loaders";
import { Views } from "@/router";

// Иконка пользователя
@Component({})
export default class UserThumbnail extends Vue {
  private Views = Views;
  @Prop({ required: true }) readonly loader!: UserLoader;
}
</script>

<style scoped lang="scss">
.card-image {
  .open {
    transition: all 0.3s ease-in-out;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    opacity: 0;
  }

  img,
  svg {
    object-fit: cover;
    aspect-ratio: 1/1;
  }

  &:hover {
    .open {
      opacity: 1;
    }
  }
}
</style>
