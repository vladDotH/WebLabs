<template>
  <section id="app">
    <nav class="navbar navbar-expand-sm px-3 navbar-dark bg-primary">
      <font-awesome-icon
        class="text-light navbar-brand fs-1"
        icon="fa-solid fa-money-bill-wave"
      />
      <button
        class="navbar-toggler text-info"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarContent"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div
        class="collapse navbar-collapse text-white fs-5 fw-semibold justify-content-between gap-3"
        id="navbarContent"
        v-if="authorized"
      >
        <div>
          <ul class="navbar-nav">
            <li class="nav-item" v-for="route of routes" :key="route[1]">
              <router-link
                class="nav-link"
                :to="{ name: route[1] }"
                exact-active-class="text-light"
              >
                {{ route[0] }}
              </router-link>
            </li>
          </ul>
        </div>
        <div class="d-flex gap-4 p-2">
          <div>
            <font-awesome-icon class="fs-4" icon="fa-solid fa-user" />
            <span class="ms-1">{{ self.login }}</span>
          </div>
          <div role="button" @click="logout">Выход</div>
        </div>
      </div>
    </nav>
    <main class="container-md">
      <transition name="main-view" mode="out-in">
        <router-view class="m-auto"></router-view>
      </transition>
    </main>

    <BrokerModalForm ref="brokerModal" />
  </section>
</template>

<script lang="ts">
import { Component, Vue, ProvideReactive } from "vue-property-decorator";
import { Views } from "./router";
import BrokerModalForm from "./components/BrokerModalForm.vue";
import { SocketManager } from "@/util";
import { User } from "@stocks_exchange/server";

@Component({ components: { BrokerModalForm } })
export default class App extends Vue {
  private routes = [
    ["Брокеры", Views.BROKERS],
    ["Акции", Views.STOCKS],
    ["Торги", Views.TRADES],
  ];
  private socket: SocketManager | null = null;

  get authorized() {
    return this.self !== null;
  }

  get self(): User | null {
    return this.$store.state.self;
  }

  $refs!: {
    brokerModal: BrokerModalForm;
  };

  private created() {
    this.$store.dispatch("fetch");
  }

  private mounted() {
    this.brokerModal = this.$refs.brokerModal;
    this.socket = new SocketManager(this.$store);
  }

  private logout() {
    this.$store.dispatch("logout");
    this.$router.go(0);
  }

  @ProvideReactive() brokerModal: BrokerModalForm | null = null;
}
</script>

<style lang="scss">
@import "styles/main";

.main-view-enter-active,
.main-view-leave-active {
  transition: all 0.3s;
}
.main-view-enter,
.main-view-leave-to {
  opacity: 0;
}
</style>
