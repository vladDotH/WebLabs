<template>
  <div class="position-relative" v-if="photo && photoInfo?.data">
    <img
      :src="photo.url.toString()"
      :alt="id"
      class="h-100 w-100"
      :class="{
        banned:
          photoInfo.data.status === Status.BLOCKED &&
          user.loader?.data?.role === Role.ADMIN,
      }"
    />
    <BanSwitcher
      :status="photoInfo.data.status"
      class="position-absolute fs-2 pt-1 pe-2 icon"
      @switched="switchStatus"
    />
  </div>
</template>

<script lang="ts">
import { Component, InjectReactive, Prop, Vue } from "vue-property-decorator";
import { PhotoInfoLoader, PhotoLoader, UserController } from "@/util";
import { Status, Role } from "@/../api";
import BanSwitcher from "@/components/BanSwitcher.vue";
import Toaster, { States } from "@/components/Toaster.vue";

// Фотография в галерее/постах
@Component({
  components: { BanSwitcher },
})
export default class Photo extends Vue {
  private Status = Status;
  private Role = Role;
  @InjectReactive() readonly toaster!: Toaster | null;
  @InjectReactive() readonly user!: UserController;
  @Prop({ required: true }) readonly id!: number;

  private photo: PhotoLoader | null = null;
  private photoInfo: PhotoInfoLoader | null = null;

  private async mounted() {
    this.photo = new PhotoLoader(this.id);
    this.photoInfo = new PhotoInfoLoader(this.id);
    await this.photoInfo?.fetch();
  }

  private switchStatus(s: Status) {
    this.toaster?.show(
      s === Status.ACTIVE ? "Разблокировано" : "Заблокировано",
      s === Status.ACTIVE ? States.SUCCESS : States.DANGER
    );
    this.photoInfo?.updateStatus(s);
  }
}
</script>

<style scoped lang="scss">
.banned {
  opacity: 0.5;
}

img {
  object-fit: contain;
  transition: all 0.3s ease-in-out;
}

.icon {
  top: 0;
  right: 0;
}
</style>
