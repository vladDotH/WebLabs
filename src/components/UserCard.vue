<template>
  <article
    class="d-flex p-3 flex-column flex-md-row align-items-center align-items-md-stretch"
    v-if="loader?.data"
  >
    <div
      class="col-6 col-sm-5 col-md-3 p-2 d-flex align-items-center justify-content-center"
    >
      <UserThumbnail :loader="loader" class="col-12" />
    </div>
    <div
      class="col-12 col-md-9 ps-0 ps-md-3 d-flex flex-column justify-content-between"
    >
      <h4 class="row justify-content-between g-0 align-items-start">
        <span class="col-8">
          {{ loader.fullName }}
        </span>
        <span class="badge bg-secondary rounded-pill col-2">#{{ id }}</span>
        <font-awesome-icon
          v-if="configurable"
          icon="fa-solid fa-user-gear"
          class="text-primary col-1 fs-3"
          role="button"
          @click="settings"
        />
      </h4>
      <h5 class="text-primary">
        {{ loader.data.email }}
      </h5>
      <h6 class="text-muted">
        Дата рождения:
        {{ new Date(loader.data.birthDate).toLocaleDateString() }}
      </h6>
      <h6>
        <span
          class="badge rounded-pill"
          :class="['bg-secondary', 'bg-info'][loader.data.role]"
        >
          {{ ["Пользователь", "Администратор"][loader.data.role] }}
        </span>
      </h6>
      <h6>
        <span
          class="badge rounded-pill"
          :class="['bg-success', 'bg-warning', 'bg-danger'][loader.data.status]"
        >
          {{
            ["Активный", "Не подтверждённый", "Заблокированный"][
              loader.data.status
            ]
          }}
        </span>
      </h6>
      <div
        v-if="user.loader?.data && loader.data && user.id !== id"
        class="text-end"
      >
        <div
          v-if="user.loader.data.friendsRequests.includes(id)"
          class="btn-group"
          role="group"
        >
          <button class="btn btn-primary" @click="requestFriend">
            Принять заявку
          </button>
          <button class="btn btn-warning" @click="declineFriend">
            Отклонить
          </button>
        </div>
        <div v-else>
          <button
            class="btn btn-danger"
            v-if="user.loader.data.friends.includes(id)"
            @click="declineFriend"
          >
            Удалить из друзей
          </button>

          <button
            class="btn btn-secondary"
            v-else-if="loader.data.friendsRequests.includes(user.id)"
            @click="declineFriend"
          >
            Отменить заявку
          </button>

          <button v-else class="btn btn-info" @click="requestFriend">
            Добавить в друзья
          </button>
        </div>
      </div>
    </div>
  </article>
</template>

<script lang="ts">
import { Component, InjectReactive, Prop, Vue } from "vue-property-decorator";
import { UserController, UserLoader } from "@/util";
import { Views } from "@/router";
import UserThumbnail from "@/components/UserThumbnail.vue";
import RedactModal from "@/components/forms/RedactModal.vue";
import { Role } from "../../api";

// Карточка Пользователя
@Component({
  components: { UserThumbnail },
})
export default class UserCard extends Vue {
  private Views = Views;
  @InjectReactive() readonly redact!: RedactModal | null;
  @InjectReactive() readonly user!: UserController;
  @Prop({ required: true }) readonly id!: number;
  @Prop({ default: false }) readonly configurable!: boolean;

  private loader: UserLoader | null = null;

  private async mounted() {
    if (this.id === this.user?.id) this.loader = this.user.loader;
    else {
      this.loader = new UserLoader(this.id);
      await this.loader.fetch();
    }
  }

  private settings() {
    if (this.loader?.data)
      this.redact?.show(
        this.loader,
        this.user?.loader?.data?.role === Role.ADMIN
      );
  }

  private requestFriend() {
    if (this.loader) this.user?.requestFriend(this.loader);
  }

  private declineFriend() {
    if (this.loader) this.user?.declineFriend(this.loader);
  }
}
</script>

<style scoped lang="scss"></style>
