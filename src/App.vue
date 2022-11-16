<template>
  <div id="app" class="min-vh-100">
    <router-view />

    <Toaster class="position-fixed bottom-0 end-0 p-3" ref="toaster" />
    <SignUpModal ref="signUp" />
  </div>
</template>

<script lang="ts">
import { Component, ProvideReactive, Vue } from "vue-property-decorator";
import { Views } from "./router";
import Toaster from "@/components/Toaster.vue";
import SignUpModal from "@/components/forms/SignUpModal.vue";

@Component({
  components: {
    SignUpModal,
    Toaster,
  },
})
export default class App extends Vue {
  private Views = Views;

  $refs!: {
    toaster: Toaster;
    signUp: SignUpModal;
  };

  private mounted() {
    this.toaster = this.$refs.toaster;
    this.signUp = this.$refs.signUp;
  }

  @ProvideReactive() toaster: Toaster | null = null;
  @ProvideReactive() signUp: SignUpModal | null = null;
}
</script>

<style lang="scss">
@import "styles/main";
</style>
