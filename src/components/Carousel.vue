<template>
  <section :id="'carousel' + id" class="carousel slide">
    <div class="carousel-indicators" v-show="list.length > 1">
      <button
        v-for="(photo, index) of list"
        :key="index"
        type="button"
        :data-bs-target="'#carousel' + id"
        :data-bs-slide-to="index"
        ref="indicators"
      ></button>
    </div>
    <div class="carousel-inner">
      <div
        v-for="(photo, index) of list"
        :key="index"
        ref="images"
        class="carousel-item w-100"
      >
        <div class="w-100 h-100 d-flex justify-content-center">
          <Photo :id="photo" class=""></Photo>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { Component } from "vue-property-decorator";
import Photo from "@/components/Photo.vue";
import List from "@/components/lists/List";

// Карусель фотографий в посте
@Component({
  components: { Photo },
})
export default class Carousel extends List {
  private id = 0;

  $refs!: {
    indicators: HTMLButtonElement[];
    images: HTMLDivElement[];
  };

  private mounted() {
    if (this.list.length) {
      this.id = Date.now();
      this.$refs.indicators[0].classList.add("active");
      this.$refs.images[0].classList.add("active");
    }
  }
}
</script>

<style scoped lang="scss">
@import "@/styles/main.scss";
.carousel-item {
  background: $gray-600;
  height: 400px;
  width: auto;
}
</style>
