<template>
  <section class="m-auto">
    <div v-for="id of list" :key="id" class="border mt-3">
      <UserCard :id="id"></UserCard>
    </div>
  </section>
</template>

<script lang="ts">
import { Component } from "vue-property-decorator";
import UserCard from "@/components/UserCard.vue";
import List from "@/components/lists/List";

// Список пользователей
@Component({
  components: { UserCard },
})
export default class UsersList extends List {}
</script>

<style scoped lang="scss"></style>
