<template>
  <Transition name="toast">
    <section class="toast-container text-center" v-if="visible">
      <div class="toast d-block m-0">
        <div
          class="toast-body alert m-0"
          :class="status === Status.ACTIVE ? 'alert-success' : 'alert-danger'"
        >
          {{ this.msg }}
        </div>
      </div>
    </section>
  </Transition>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Status } from "@/../api";

export function getBanMsg(status: Status): string {
  return status == Status.ACTIVE ? "Разблокировано" : "Заблокировано";
}

// Компонент вывода всплывающих сообщений
@Component({
  components: {},
})
export default class Toaster extends Vue {
  private Status = Status;
  @Prop({ default: 1500 }) interval!: number;

  private msg = "";
  private status: Status = Status.UNCONFIRMED;
  private visible = false;
  private timerId = 0;

  show(status: Status, msg: string) {
    this.status = status;
    this.msg = msg;
    this.visible = true;
    clearTimeout(this.timerId);
    this.timerId = setTimeout(() => {
      this.visible = false;
    }, this.interval);
  }
}
</script>

<style scoped lang="scss">
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
