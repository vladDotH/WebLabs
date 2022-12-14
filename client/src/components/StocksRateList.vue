<template>
  <section>
    <h3 class="d-flex">
      <span>Текущая дата:</span>
      <span class="badge bg-primary ms-3">
        {{ new Date(rate.date).toLocaleDateString() }}
      </span>
    </h3>

    <div class="mt-3">
      <h3>
        Котировки:
        <span v-if="rate.end" class="badge bg-danger">Торги окончены</span>
      </h3>
      <ul class="list-group">
        <li
          class="list-group-item d-flex justify-content-between fs-5"
          v-for="stock of rate.stocks"
          :key="stock.key"
        >
          <span>{{ stock.key }}</span>
          <span class="badge bg-primary col-6 col-md-4 align-middle">
            {{ stock.cost }}$
          </span>
        </li>
      </ul>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { StocksRate } from "@stocks_exchange/server";

// Список котировок
@Component({})
export default class StocksRateList extends Vue {
  @Prop({ required: true }) readonly rate!: StocksRate;
}
</script>

<style scoped lang="scss"></style>
