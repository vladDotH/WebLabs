<template>
  <section>
    <nav class="navbar navbar-expand-sm px-5 bg-light">
      <font-awesome-icon
        class="text-primary navbar-brand fs-2"
        icon="fa-solid fa-users-rays"
      />
      <button
        class="navbar-toggler text-info"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarContent"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarContent">
        <ul class="navbar-nav">
          <li class="nav-item" v-for="route of routes" :key="route[1]">
            <router-link
              class="nav-link"
              :to="{ name: route[1] }"
              exact-active-class="text-primary"
            >
              {{ route[0] }}
            </router-link>
          </li>
        </ul>
      </div>
    </nav>
    <main v-if="self.id">
      <router-view></router-view>
    </main>
  </section>
</template>

<script lang="ts">
import { Component, ProvideReactive, Vue } from "vue-property-decorator";
import { Views } from "@/router";
import { SelfLoader } from "@/loaders";

@Component({})
export default class Network extends Vue {
  private routes = [
    ["Моя страница", Views.PROFILE],
    ["Новости", Views.NEWS],
    ["Друзья", Views.FRIENDS],
    ["Сообщения", Views.MESSANGER],
    ["Фотографии", Views.PHOTOS],
    // ["Администрирование", Views.ADMINISTRATION],
  ];

  private async created() {
    await this.self.fetch();
  }

  @ProvideReactive() self: SelfLoader = new SelfLoader();
}
</script>

<style scoped lang="scss"></style>
