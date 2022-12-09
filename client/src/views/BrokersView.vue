<template>
  <section class="py-3">
    <div>
      <button class="btn btn-outline-primary" @click="add">Добавить</button>
    </div>
    <transition-group
      name="list"
      tag="div"
      v-if="brokers.ids.length"
      class="m-auto pt-3 row g-5 col-12 col-md-10 col-lg-12"
    >
      <div v-for="id of brokers.ids" :key="id" class="col-lg-6 col-12">
        <BrokerCard :id="id" :list="brokers" />
      </div>
    </transition-group>
  </section>
</template>

<script lang="ts">
import { Component, Vue, InjectReactive } from "vue-property-decorator";
import { BrokersListLoader } from "@/util/loaders";
import BrokerCard from "@/components/BrokerCard.vue";
import BrokerModalForm from "@/components/BrokerModalForm.vue";

// Страница брокеров
@Component({
  components: { BrokerCard },
})
export default class BrokersView extends Vue {
  @InjectReactive() readonly brokerModal!: BrokerModalForm | null;
  private brokers = new BrokersListLoader();

  private created() {
    this.brokers.fetch();
  }

  private add() {
    this.brokerModal?.show(this.brokers);
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
