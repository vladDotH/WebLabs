<template>
  <section v-if="user.loader?.data">
    <h3 v-if="user.loader.data.friendsRequests.length" class="mt-3">Заявки</h3>
    <UsersList :list="user.loader.data.friendsRequests" />
    <h3 class="mt-3">Друзья</h3>
    <UsersList :list="user.loader.data.friends" />
  </section>
</template>

<script lang="ts">
import { Component, InjectReactive, Vue } from "vue-property-decorator";
import { UserController } from "@/util";
import UsersList from "@/components/lists/UsersList.vue";

// Список друзей
@Component({
  components: { UsersList },
})
export default class Friends extends Vue {
  @InjectReactive() readonly user!: UserController;
}
</script>

<style scoped lang="scss"></style>
