<template>
  <section class="m-auto">
    <Post
      v-for="post of list"
      :key="post"
      :id="post"
      class="border mt-3"
    ></Post>
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

<style scoped lang="scss"></style>
