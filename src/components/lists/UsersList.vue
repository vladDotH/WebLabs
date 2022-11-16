<template>
  <section class="m-auto">
    <transition-group name="list" tag="div">
      <div v-for="id of list" :key="id" class="border mt-3">
        <UserCard :id="id" :configurable="user.isAdmin"></UserCard></div
    ></transition-group>
  </section>
</template>

<script lang="ts">
import { Component, InjectReactive } from "vue-property-decorator";
import UserCard from "@/components/UserCard.vue";
import List from "@/components/lists/List";
import { UserController } from "@/util";

// Список пользователей
@Component({
  components: { UserCard },
})
export default class UsersList extends List {
  @InjectReactive() readonly user!: UserController | null;
}
</script>

<style scoped lang="scss">
.list-enter-active,
.list-leave-active {
  transition: all 0.5s;
  max-height: 30vh;
}
.list-enter,
.list-leave-to {
  opacity: 0;
  max-height: 0;
}
</style>
