<template>
  <section class="modal fade" ref="modal">
    <div class="modal-dialog modal-dialog-centered modal-xl">
      <div class="modal-content">
        <div class="modal-body">
          <StockPlot :history="history" />
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import StockPlot from "@/components/StockPlot.vue";
import {
  Stock,
  StockHistory,
  StockRateRecord,
  StocksRate,
} from "@stocks_exchange/server";

import { Modal } from "bootstrap";

// Всплывающее окно истории торгов
@Component({
  components: { StockPlot },
})
export default class StockPlotModal extends Vue {
  private modal!: Modal;
  private history: StockHistory = {
    stock: { key: "", company: "" },
    records: [],
  };

  private mounted() {
    this.modal = new Modal(this.$refs.modal);
  }

  $refs!: {
    modal: HTMLFormElement;
  };

  private get rate(): StocksRate {
    return this.$store.state.trades.rate;
  }

  @Watch("rate")
  private updateRate() {
    this.history.records.push({
      date: this.$store.state.trades.rate.date,
      cost:
        (this.$store.state.trades.rate.stocks as StockRateRecord[]).find(
          (r) => r.key === this.history.stock.key
        )?.cost ?? 0,
    });
  }

  private initHistory() {
    this.history.records = (
      this.$store.state.trades.history as StocksRate[]
    ).map((r) => ({
      date: r.date,
      cost: r.stocks.find((s) => s.key === this.history.stock.key)?.cost ?? 0,
    }));
  }

  show(stock: Stock) {
    this.history.stock = stock;
    this.initHistory();
    this.modal.show();
  }
}
</script>

<style scoped lang="scss"></style>
