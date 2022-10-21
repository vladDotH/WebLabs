<template>
  <div>
    <font-awesome-icon
      v-if="status === Status.ACTIVE"
      icon="fa-solid fa-ban"
      class="text-danger"
      @click="switchStatus(Status.BLOCKED)"
      role="button"
    />
    <font-awesome-icon
      v-else
      icon="fa-solid fa-clock-rotate-left"
      class="text-success"
      @click="switchStatus(Status.ACTIVE)"
      role="button"
    />
  </div>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from "vue-property-decorator";
import { Status } from "@/../api";

// Компонент блокирования/разблокирования ресурсов
@Component({})
export default class BanSwitcher extends Vue {
  private Status = Status;
  @Prop({ required: true }) status!: Status;

  @Emit("switched")
  private switchStatus(s: Status): Status {
    return s;
  }
}
</script>

<style scoped lang="scss"></style>
