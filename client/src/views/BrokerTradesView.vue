<template>
  <section class="mt-3" v-if="state.active">
    <div class="row mb-3 fw-bold">
      <span class="col-3 col-sm-2">Компания</span>
      <span class="col-3 col-sm-2">Цена</span>
      <span class="col-3 col-sm-2">Количество</span>
      <span class="col-3 col-sm-2">Доход</span>
    </div>
    <div v-for="key of active" :key="key">
      <BrokerStock :stock="getStock(key)" class="mb-3 mb-sm-1" />
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { ExchangeState, Stock, StocksRate } from "@stocks_exchange/server";
import { createStore } from "vuex-smart-module";
import { Store } from "vuex";
import { stocks, StocksState } from "@/store/modules/stocks";
import BrokerStock from "@/components/BrokerStock.vue";

// Страница торгов брокера
@Component({
  components: { BrokerStock },
})
export default class BrokerTradesView extends Vue {
  private stocksStore: Store<StocksState> = createStore(stocks);

  private async created() {
    await this.stocksStore.dispatch("fetch");
    await this.$store.dispatch("fetchProfit");
  }

  private get active(): string[] {
    return (this.$store.state.trades.rate as StocksRate).stocks.map(
      (s) => s.key
    );
  }

  private get state(): ExchangeState {
    return this.$store.state.trades.exchangeState;
  }

  private getStock(key: string): Stock {
    return {
      key,
      company:
        this.stocksStore.state.available.find((s) => s.key === key)?.company ??
        "",
    };
  }

  @Watch("state")
  private watchRate(value: ExchangeState, old: ExchangeState) {
    this.stocksStore.dispatch("fetch");
    this.$store.dispatch("fetch");
    this.$store.dispatch("fetchProfit");
  }
}
</script>

<style scoped></style>
