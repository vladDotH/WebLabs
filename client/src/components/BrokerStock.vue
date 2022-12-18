<template>
  <div class="row g-0 text-center fw-semibold">
    <ul class="list-group list-group-horizontal col-12 col-sm-8">
      <li class="list-group-item col-3">{{ stock.key }}</li>
      <li class="list-group-item col-3 text-primary" :id="`costOf${stock.key}`">
        {{ Math.round(cost * 100) / 100 }}$
      </li>
      <li class="list-group-item col-3" :id="`countOf${stock.key}`">
        <span class="badge rounded-pill text-bg-secondary">
          {{ count }}
        </span>
      </li>
      <li class="list-group-item col-3">
        <span
          class="badge rounded-pill"
          :class="profitValue >= 0 ? 'text-bg-success' : 'text-bg-danger'"
          :id="`profitOf${stock.key}`"
        >
          <span v-if="profitValue >= 0">+</span>
          <span v-else>-</span>
          {{ Math.abs(profitValue) }}$
        </span>
      </li>
    </ul>
    <ul class="list-group list-group-horizontal col-12 col-sm">
      <li class="list-group-item col-12">
        <div class="row">
          <div class="col">
            <form
              class="input-group input-group-sm"
              @submit.prevent="transaction"
            >
              <button
                class="btn btn-outline-secondary col-auto"
                type="submit"
                :id="`submitTo${stock.key}`"
              >
                <span v-if="amount >= 0">Купить</span>
                <span v-else>Продать</span>
              </button>
              <input
                type="number"
                class="form-control"
                :min="-count"
                :max="Math.floor(self.balance / cost)"
                v-model.number="amount"
                :id="`amountOf${stock.key}`"
              />
            </form>
          </div>
          <div class="col-auto">
            <font-awesome-icon
              icon="fa-money-bill-trend-up"
              class="fs-3 m-auto d-block text-primary"
              @click="togglePlot"
            />
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, InjectReactive } from "vue-property-decorator";
import {
  ProfitRecord,
  Stock,
  StockBundle,
  StocksRate,
  User,
} from "@stocks_exchange/server";

import StockPlotModal from "@/components/StockPlotModal.vue";

// Акция на странице брокера
@Component({})
export default class BrokerStock extends Vue {
  @InjectReactive() readonly plotModal!: StockPlotModal | null;
  @Prop({ required: true }) readonly stock!: Stock;
  private amount = 0;

  private get profit(): ProfitRecord[] {
    return this.$store.state.profit;
  }

  private get myStocks(): StockBundle[] {
    return this.$store.state.self.stocks;
  }

  private get rate(): StocksRate {
    return this.$store.state.trades.rate;
  }

  private get self(): User {
    return this.$store.state.self;
  }

  private get count(): number {
    return this.myStocks.find((s) => s.key === this.stock.key)?.amount ?? 0;
  }

  private get profitValue() {
    return (
      Math.round(
        (this.profit.find((s) => s.key == this.stock.key)?.value ?? 0) * 100
      ) / 100
    );
  }

  private get cost() {
    return this.rate.stocks.find((s) => s.key === this.stock.key)?.cost;
  }

  private async transaction() {
    if (this.amount !== 0) {
      await this.$store.dispatch(this.amount > 0 ? "buy" : "sell", {
        key: this.stock.key,
        amount: Math.abs(this.amount),
      } as StockBundle);
      this.$store.dispatch("fetch");
      this.amount = 0;
    }
  }

  private togglePlot() {
    this.plotModal?.show(this.stock);
  }
}
</script>

<style scoped lang="scss"></style>
