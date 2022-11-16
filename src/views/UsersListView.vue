<template>
  <section class="container mt-3 mb-3">
    <UsersList :list="users.list"></UsersList>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import UsersList from "@/components/lists/UsersList.vue";
import { UsersListLoader } from "@/util";

// Страница списка всех пользователей
@Component({
  components: { UsersList },
})
export default class UsersListView extends Vue {
  private users: UsersListLoader = new UsersListLoader();

  private mounted() {
    this.users.fetch();
  }
}
</script>

<style scoped lang="scss"></style>
