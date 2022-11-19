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
    <main v-if="user.id" class="container">
      <transition name="network-view" mode="out-in">
        <router-view class="col-lg-8 m-auto"></router-view>
      </transition>
    </main>

    <RedactModal ref="redact" />
    <UpdateAvatarModal ref="avatarUpdate" />
    <PostModal ref="postModal" />
  </section>
</template>

<script lang="ts">
import {
  Component,
  InjectReactive,
  ProvideReactive,
  Vue,
} from "vue-property-decorator";
import { Views } from "@/router";
import { SocketManager, UserController } from "@/util";
import RedactModal from "@/components/forms/RedactModal.vue";
import UpdateAvatarModal from "@/components/forms/UpdateAvatarModal.vue";
import PostModal from "@/components/forms/PostModal.vue";
import { UserData } from "../../api";
import Toaster, { States } from "@/components/Toaster.vue";

// Главный view соцсети для авторизованных пользователей
@Component({
  components: { PostModal, UpdateAvatarModal, RedactModal },
})
export default class Network extends Vue {
  @InjectReactive() readonly toaster!: Toaster | null;

  private Views = Views;
  private get routes() {
    const requests = this.user.loader?.data?.friendsRequests.length;
    return [
      ["Моя страница", Views.PROFILE],
      ["Новости", Views.NEWS],
      ["Друзья " + (requests ? `(${requests})` : ""), Views.FRIENDS],
      ["Фотографии", Views.PHOTOS],
      ["Пользователи", Views.USERS_LIST],
    ];
  }

  $refs!: {
    avatarUpdate: UpdateAvatarModal;
    redact: RedactModal;
    postModal: PostModal;
  };

  private async created() {
    await this.user.fetchId();
    await this.user.loader?.fetch();
    this.redact = this.$refs.redact;
    this.avatarUpdate = this.$refs.avatarUpdate;
    this.postModal = this.$refs.postModal;
    this.socket.addListener(this.postNotification);
  }

  private beforeDestroy() {
    this.socket.removeListener(this.postNotification);
  }

  private notification = require("../assets/notification.mp3");

  // Уведомление о новости
  private postNotification(user: UserData) {
    this.toaster?.show(
      `Пользователь ${user.surname} ${user.name} опубликовал новую запись`,
      States.PRIMARY,
      2000,
      new Audio(this.notification)
    );
  }

  // Объект текущего пользователя
  @ProvideReactive() user: UserController = new UserController();
  // Менеджер сокета
  @ProvideReactive() socket: SocketManager = new SocketManager();
  @ProvideReactive() redact: RedactModal | null = null;
  @ProvideReactive() avatarUpdate: UpdateAvatarModal | null = null;
  @ProvideReactive() postModal: PostModal | null = null;
}
</script>

<style scoped lang="scss">
.network-view-enter-active,
.network-view-leave-active {
  transition: all 0.3s;
}
.network-view-enter,
.network-view-leave-to {
  opacity: 0;
}
</style>
