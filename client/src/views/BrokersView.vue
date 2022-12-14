<template>
  <section class="py-3">
    <div>
      <button class="btn btn-outline-primary" @click="add">Добавить</button>
    </div>
    <transition-group
      name="list"
      tag="div"
      v-if="brokers.length"
      class="m-auto pt-3 row g-5 col-12 col-md-10 col-lg-12"
    >
      <div v-for="user of brokers" :key="user.id" class="col-lg-6 col-12">
        <BrokerCard :user="user" :brokers="brokersStore" />
      </div>
    </transition-group>
  </section>
</template>

<script lang="ts">
import { Component, Vue, InjectReactive } from "vue-property-decorator";
import BrokerCard from "@/components/BrokerCard.vue";
import BrokerModalForm from "@/components/BrokerModalForm.vue";
import { brokers, BrokersState } from "@/store/modules/brokers";
import { createStore } from "vuex-smart-module";
import { User } from "@stocks_exchange/server";
import { Store } from "vuex";

// Страница брокеров
@Component({
  components: { BrokerCard },
})
export default class BrokersView extends Vue {
  @InjectReactive() readonly brokerModal!: BrokerModalForm | null;
  private readonly brokersStore: Store<BrokersState> = createStore(brokers);

  get brokers(): User[] {
    return this.brokersStore.state.brokers;
  }

  private async created() {
    await this.brokersStore.dispatch("fetch");
  }

  private async add() {
    if (this.brokerModal) {
      this.brokerModal.clear();
      let res: User | null | undefined = undefined;
      while (res === undefined) {
        res = await this.brokerModal.show();
        if (res) {
          if (await this.brokersStore.dispatch("addBroker", res))
            this.brokerModal.hide();
          else {
            this.brokerModal.invalidate();
            res = undefined;
          }
        }
      }
    }
  }
}
</script>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease-in-out;
}
.list-enter,
.list-leave-to {
  opacity: 0;
}
</style>
