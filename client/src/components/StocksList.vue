<template>
  <div>
    <ul class="list-group">
      <li
        class="list-group-item d-flex justify-content-between"
        v-for="stock of available"
        :key="stock.key"
        :class="{ active: selected === stock.key }"
        @click="select(stock.key)"
      >
        <span>{{ stock.company }} </span>
        <input
          type="checkbox"
          @click.stop
          @input.stop="switchStock(stock.key)"
          :checked="active.includes(stock.key)"
        />
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from "vue-property-decorator";
import { StocksState } from "@/store/modules/stocks";
import { Stock } from "@stocks_exchange/server";
import { Store } from "vuex";

// Список выбора акций
@Component({})
export default class StocksView extends Vue {
  private selected = "";
  @Prop({ required: true }) private readonly stocksStore!: Store<StocksState>;

  private get available(): Stock[] {
    return this.stocksStore.state.available;
  }

  private get active(): string[] {
    return this.stocksStore.state.active;
  }

  private switchStock(key: string) {
    this.stocksStore.dispatch("switchStock", key);
  }

  @Emit("select")
  private select(key: string): string {
    this.selected = key;
    return key;
  }
}
</script>

<style scoped lang="scss"></style>
