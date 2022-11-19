<template>
  <Transition name="toast">
    <section class="toast-container text-center" v-if="visible">
      <div class="toast d-block m-0">
        <div
          class="toast-body alert m-0"
          :class="
            'alert-' +
            ['primary', 'secondary', 'success', 'warning', 'danger'][state]
          "
        >
          {{ this.msg }}
        </div>
      </div>
    </section>
  </Transition>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Status } from "@/../api";

// Состояние тостера (цвет алёрта)
export enum States {
  PRIMARY,
  SECONDARY,
  SUCCESS,
  WARNING,
  DANGER,
}

// Компонент вывода всплывающих сообщений
@Component({
  components: {},
})
export default class Toaster extends Vue {
  private Status = Status;

  private msg = "";
  private state: States = States.PRIMARY;
  private visible = false;
  private timerId = 0;

  show(
    msg: string,
    state: States = States.PRIMARY,
    delay = 1500,
    sound?: HTMLAudioElement
  ) {
    this.state = state;
    this.msg = msg;
    this.visible = true;
    clearTimeout(this.timerId);
    this.timerId = window.setTimeout(() => {
      this.visible = false;
    }, delay);
    if (sound)
      try {
        sound.play();
      } catch (e) {
        this.$rollbar.error(`Error during playing sound: ${e}`);
      }
  }
}
</script>

<style scoped lang="scss">
.toast-container {
  z-index: 5000;
}

.toast-enter-active,
.toast-leave-active,
.alert {
  transition: all 0.3s ease-in-out;
}
.toast-enter,
.toast-leave-to {
  opacity: 0;
  transform: translateY(100%);
}
</style>
