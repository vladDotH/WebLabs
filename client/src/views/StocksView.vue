<template>
  <section v-if="available.data && active.keys" class="row pt-3">
    <div class="col-3">
      <p class="text-end">Выбрать участвующих в торгах</p>
      <ul class="list-group">
        <li
          class="list-group-item d-flex justify-content-between"
          v-for="stock of available.data"
          :key="stock.key"
          :class="{ active: selected === stock.key }"
          @click="select(stock.key)"
        >
          <span>{{ stock.key }}</span>
          <input
            type="checkbox"
            @click.stop
            @input.stop="switchStock(stock.key)"
            :checked="active.keys.has(stock.key)"
          />
        </li>
      </ul>
    </div>
    <div class="col-9" v-if="history?.data">
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
      <StockTable
        class="overflow-scroll vh-100 pt-2"
        :history="history.data"
        v-if="type === ViewTypes.TABLE"
      />
      <StockPlot
        class="pt-2"
        :history="history.data"
        v-else-if="type === ViewTypes.GRAPHICS"
      />
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import {
  ActiveStocksLoader,
  AvailableStocksLoader,
  StockHistoryLoader,
} from "@/util/loaders";
import StockTable from "@/components/StockTable.vue";
import StockPlot from "@/components/StockPlot.vue";

enum ViewTypes {
  TABLE,
  GRAPHICS,
}

// Страница активации акций и просмотра их историй
@Component({
  components: { StockPlot, StockTable },
})
export default class StocksView extends Vue {
  private ViewTypes = ViewTypes;
  private available = new AvailableStocksLoader();
  private active = new ActiveStocksLoader();
  private selected = "";
  private type: ViewTypes = ViewTypes.TABLE;
  private history: StockHistoryLoader | null = null;

  private created() {
    this.available.fetch();
    this.active.fetch();
  }

  private switchStock(key: string) {
    this.active.switchStock(key);
  }

  private select(key: string) {
    this.selected = key;
    this.history = new StockHistoryLoader(key);
    this.history.fetch();
  }
}
</script>

<style scoped lang="scss"></style>
