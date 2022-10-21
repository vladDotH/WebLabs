<template>
  <div id="app">
    <header
      class="header container-fluid pt-3 pb-3 ps-5 pe-5 bg-primary text-light fw-bold fs-2"
    >
      <router-link
        :to="{ name: Views.HOME }"
        class="text-white text-decoration-none"
      >
        <span class="me-2">Администрация</span>
        <font-awesome-icon icon="fa-wrench" />
      </router-link>
    </header>
    <main class="view col-md-8 col-xl-6 m-auto">
      <router-view />
    </main>

    <Toaster class="position-fixed bottom-0 end-0 p-3" ref="toaster" />
    <RedactModal ref="redact" />
  </div>
</template>

<script lang="ts">
import { Component, ProvideReactive, Vue } from "vue-property-decorator";
import { Views } from "./router";
import Toaster from "@/components/Toaster.vue";
import RedactModal from "@/components/RedactModal.vue";

@Component({
  components: { RedactModal, Toaster },
})
export default class App extends Vue {
  private Views = Views;

  $refs!: {
    toaster: Toaster;
    redact: RedactModal;
  };

  private mounted() {
    this.toaster = this.$refs.toaster;
    this.redact = this.$refs.redact;
  }

  @ProvideReactive() toaster: Toaster | null = null;
  @ProvideReactive() redact: RedactModal | null = null;
}
</script>

<style lang="scss">
@import "styles/main";
</style>
