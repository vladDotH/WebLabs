<template>
  <div
    class="p-3 d-flex row align-items-stretch justify-content-center border g-0"
  >
    <div class="col-3">
      <font-awesome-icon
        icon="fa-circle-user"
        class="rounded-circle img-fluid text-primary"
      />
    </div>
    <div
      class="col-9 d-flex flex-column justify-content-between ps-4"
      v-if="loader?.data"
    >
      <div class="row justify-content-between g-0">
        <span class="fs-4 fw-semibold col-6">{{ loader.data.login }}</span>
        <span class="col-3 badge rounded-pill text-bg-secondary fs-5">
          #{{ loader.id }}
        </span>

        <font-awesome-icon
          icon="fa-solid fa-user-gear"
          class="text-primary col-1 fs-1 col-3"
          role="button"
          @click="update"
        />
      </div>
      <div class="row justify-content-between g-0">
        <span class="col-8 fs-4 fw-semibold">
          Баланс:
          <span class="badge rounded-pill text-bg-primary fs-5">
            {{ loader.data.balance }}$
          </span>
        </span>
        <button class="col-4 btn btn-outline-danger" @click="remove">
          Удалить
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Prop, Component, Vue, InjectReactive } from "vue-property-decorator";
import { BrokerLoader, BrokersListLoader } from "@/util/loaders";
import BrokerModalForm from "@/components/BrokerModalForm.vue";

// Карточка брокера
@Component({})
export default class BrokerCard extends Vue {
  @InjectReactive() readonly brokerModal!: BrokerModalForm | null;
  @Prop({ required: true }) readonly id!: number;
  @Prop({ required: true }) readonly list!: BrokersListLoader;
  private loader: BrokerLoader | null = null;

  private created() {
    this.loader = new BrokerLoader(this.id);
    this.loader.fetch();
  }

  private update() {
    if (this.loader) this.brokerModal?.show(this.loader);
  }

  private remove() {
    this.loader?.remove();
    this.list.remove(this.id);
  }
}
</script>

<style scoped lang="scss"></style>
