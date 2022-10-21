<template>
  <section class="row gap-2 g-0">
    <div v-for="photo of list" :key="photo" class="image">
      <Photo :id="photo" class="w-100 h-100"> </Photo>
    </div>
  </section>
</template>

<script lang="ts">
import { Component } from "vue-property-decorator";

import Photo from "@/components/Photo.vue";
import List from "@/components/lists/List";

// Список фотографий пользователя
@Component({
  components: { Photo },
})
export default class PhotosList extends List {}
</script>

<style scoped lang="scss">
.photos {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}
.image {
  height: 400px;
  width: auto;
}
</style>
