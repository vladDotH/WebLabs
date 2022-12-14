<template>
  <div
    class="d-flex row align-items-stretch justify-content-center border g-0 p-3"
  >
    <div class="col-3 d-none d-sm-block">
      <font-awesome-icon
        icon="fa-circle-user"
        class="rounded-circle img-fluid text-primary"
      />
    </div>
    <div
      class="col-12 col-sm-9 d-flex flex-column justify-content-between ps-0 ps-sm-4"
      v-if="user"
    >
      <div class="row justify-content-between g-0">
        <span class="fs-4 fw-semibold col-6">{{ user.login }}</span>
        <span class="col-3 badge rounded-pill text-bg-secondary fs-5">
          #{{ user.id }}
        </span>

        <font-awesome-icon
          icon="fa-solid fa-user-gear"
          class="text-primary col-1 fs-1 col-3"
          role="button"
          @click="update"
        />
      </div>
      <div class="row justify-content-between g-0 mt-3">
        <span class="col-8 fs-4 fw-semibold">
          Баланс:
          <span class="badge rounded-pill text-bg-primary fs-5">
            {{ user.balance }}$
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
import BrokerModalForm from "@/components/BrokerModalForm.vue";
import { User } from "@stocks_exchange/server";
import { BrokersState } from "@/store/modules/brokers";
import { Store } from "vuex";

// Карточка брокера
@Component({})
export default class BrokerCard extends Vue {
  @InjectReactive() readonly brokerModal!: BrokerModalForm | null;
  @Prop({ required: true }) readonly user!: User;
  @Prop({ required: true }) readonly brokers!: Store<BrokersState>;

  private async update() {
    if (this.brokerModal) {
      this.brokerModal.clear();
      let res: User | null | undefined = undefined;
      while (res === undefined) {
        res = await this.brokerModal.show(this.user);
        if (res) {
          if (await this.brokers.dispatch("updateBroker", res))
            this.brokerModal.hide();
          else {
            this.brokerModal.invalidate();
            res = undefined;
          }
        }
      }
    }
  }

  private remove() {
    this.brokers.dispatch("removeBroker", this.user.id);
  }
}
</script>

<style scoped lang="scss"></style>
