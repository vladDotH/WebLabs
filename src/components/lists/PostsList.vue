<template>
  <section class="m-auto">
    <transition-group name="list">
      <Post v-for="post of list" :key="post" :id="post" class="border mt-3"
    /></transition-group>
  </section>
</template>

<script lang="ts">
import { Component } from "vue-property-decorator";
import Post from "@/components/Post.vue";
import List from "@/components/lists/List";

// Список постов
@Component({
  components: { Post },
})
export default class PostsList extends List {}
</script>

<style scoped lang="scss">
.list-enter-active,
.list-leave-active {
  transition: all 0.5s;
  max-height: 100vh;
}
.list-enter,
.list-leave-to {
  opacity: 0;
  max-height: 0;
}
</style>
