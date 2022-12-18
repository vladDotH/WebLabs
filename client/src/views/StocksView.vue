<template>
  <section v-if="available && active" class="row pt-3">
    <div class="offcanvas offcanvas-start" tabindex="-1" id="offcanvas">
      <div class="offcanvas-header">
        <h5>Выбрать участвующих в торгах</h5>
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="offcanvas"
          id="stocksOffCanvasDismiss"
        ></button>
      </div>
      <div class="offcanvas-body">
        <StocksList :stocks-store="stocksStore" @select="select" />
      </div>
    </div>

    <div class="col-3 d-none d-lg-block">
      <h6>Выбрать участвующих в торгах</h6>
      <StocksList :stocks-store="stocksStore" @select="select" />
    </div>

    <div class="col-12 col-lg-9">
      <button
        class="d-inline d-lg-none btn btn-secondary me-2"
        type="button"
        data-bs-toggle="offcanvas"
        data-bs-target="#offcanvas"
        id="offCanvasButton"
      >
        <font-awesome-icon icon="fa-solid fa-bars" />
      </button>
      <div class="btn-group" role="group">
        <input
          v-model="type"
          :value="ViewTypes.TABLE"
          type="radio"
          name="type"
          class="btn-check"
          id="table"
        />
        <label class="btn btn-outline-primary" for="table">Таблица</label>
        <input
          v-model="type"
          :value="ViewTypes.GRAPHICS"
          type="radio"
          name="type"
          class="btn-check"
          id="graphics"
        />
        <label class="btn btn-outline-primary" for="graphics">График</label>
      </div>
      <div v-if="history">
        <StockTable
          class="overflow-scroll vh-100 pt-2"
          :history="history"
          v-if="type === ViewTypes.TABLE"
        />
        <StockPlot
          class="pt-2"
          :history="history"
          v-else-if="type === ViewTypes.GRAPHICS"
        />
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import StockTable from "@/components/StockTable.vue";
import StockPlot from "@/components/StockPlot.vue";
import { createStore } from "vuex-smart-module";
import { stocks, StocksState } from "@/store/modules/stocks";
import { Stock, StockHistory } from "@stocks_exchange/server";
import { Store } from "vuex";
import StocksList from "@/components/StocksList.vue";

enum ViewTypes {
  TABLE,
  GRAPHICS,
}

// Страница активации акций и просмотра их историй
@Component({
  components: { StocksList, StockPlot, StockTable },
})
export default class StocksView extends Vue {
  private ViewTypes = ViewTypes;
  private selected = "";
  private type: ViewTypes = ViewTypes.TABLE;
  private stocksStore: Store<StocksState> = createStore(stocks);

  private get available(): Stock[] {
    return this.stocksStore.state.available;
  }

  private get active(): string[] {
    return this.stocksStore.state.active;
  }

  private get history(): StockHistory | undefined {
    return this.stocksStore.state.history.find(
      (h) => h.stock.key === this.selected
    );
  }

  private async created() {
    await this.stocksStore.dispatch("fetch");
  }

  private select(key: string) {
    this.selected = key;
  }
}
</script>

<style scoped lang="scss"></style>
