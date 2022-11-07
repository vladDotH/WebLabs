<template>
  <article
    class="d-flex p-3 flex-column flex-md-row align-items-center align-items-md-stretch"
    v-if="loader?.data"
  >
    <div
      class="col-6 col-sm-5 col-md-3 p-2 d-flex align-items-center justify-content-center"
    >
      <UserThumbnail :loader="loader" class="col-12"></UserThumbnail>
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
    </div>
  </article>
</template>

<script lang="ts">
import { Component, InjectReactive, Prop, Vue } from "vue-property-decorator";
import { UserLoader } from "@/loaders";
import { Views } from "@/router";
import UserThumbnail from "@/components/UserThumbnail.vue";
import RedactModal from "@/components/RedactModal.vue";

// Карточка Пользователя
@Component({
  components: { UserThumbnail },
})
export default class UserCard extends Vue {
  private Views = Views;
  @InjectReactive() readonly redact!: RedactModal | null;
  @Prop({ type: Number, required: true }) readonly id!: number;

  private loader: UserLoader | null = null;

  private async mounted() {
    this.loader = new UserLoader(this.id);
    await this.loader.fetch();
  }

  private settings() {
    if (this.loader?.data) this.redact?.show(this.loader);
  }
}
</script>

<style scoped lang="scss"></style>
