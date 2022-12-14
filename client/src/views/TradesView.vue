<template>
  <section v-if="state && config">
    <div class="m-auto col-10 col-md-6 pt-3">
      <form ref="form" @submit.prevent="save">
        <div class="mb-3">
          <h5>Дата начала торгов</h5>
          <input
            class="form-control"
            type="date"
            required
            v-model="cfg.startDate"
            :min="config.dateRange[0]"
            :max="config.dateRange[1]"
            :disabled="state.active"
            @input="change"
          />
        </div>
        <div class="mb-3">
          <h5>Скорость смены дат</h5>
          <input
            class="form-control"
            type="number"
            required
            v-model="cfg.dayDelay"
            min="100"
            max="10000"
            :disabled="state.active"
            @input="change"
          />
        </div>

        <div class="text-end">
          <button
            type="submit"
            class="btn"
            :class="changed ? 'btn-outline-success' : ' btn-success'"
            :disabled="state.active"
          >
            Сохранить
          </button>
        </div>
      </form>

      <div class="form-check form-switch fs-2 m-auto">
        <label class="form-check-label"> Торги </label>
        <input
          class="form-check-input"
          type="checkbox"
          role="switch"
          :checked="state.active"
          @input="switchTrades"
        />
      </div>
      <StocksRate v-if="state?.active && rate" :rate="rate" class="pt-4" />
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import StocksRateList from "@/components/StocksRateList.vue";
import {
  ExchangeState,
  StocksRate,
  TradesConfig,
  TradesConfigExtended,
} from "@stocks_exchange/server";
import { createStore } from "vuex-smart-module";
import { Store } from "vuex";
import { ConfigState, tradesConfig } from "@/store/modules/tradesConfig";

// Страница настройки и запуска торгов (и просмотра котировок)
@Component({
  components: { StocksRate: StocksRateList },
})
export default class TradesView extends Vue {
  private readonly configStore: Store<ConfigState> = createStore(tradesConfig);
  private cfg: TradesConfig = { dayDelay: 1000, startDate: "" };
  private active = false;
  private changed = false;

  private change() {
    this.changed = true;
  }

  $refs!: {
    form: HTMLFormElement;
  };

  get config(): TradesConfigExtended {
    return this.configStore.state.config;
  }

  get state(): ExchangeState {
    return this.$store.state.trades.exchangeState;
  }

  get rate(): StocksRate {
    return this.$store.state.trades.rate;
  }

  private syncState() {
    [this.cfg.dayDelay, this.cfg.startDate] = [
      this.config.dayDelay,
      this.config.startDate,
    ];
    this.active = this.state.active;
  }

  private async created() {
    await this.configStore.dispatch("fetch");
    this.syncState();
  }

  private async save() {
    this.configStore.dispatch("update", this.cfg);
    this.changed = false;
  }

  private async switchTrades() {
    this.$store.dispatch("trades/switchTrades");
    await this.configStore.dispatch("fetch");
    this.syncState();
  }
}
</script>

<style scoped></style>
