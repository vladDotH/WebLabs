<template>
  <section v-if="cfg?.config">
    <div class="m-auto col-10 col-md-6 pt-3">
      <form ref="form" @submit.prevent="switchTrades">
        <div class="mb-3">
          <h5>Дата начала торгов</h5>
          <input
            class="form-control"
            type="date"
            required
            v-model="cfg.config.startDate"
            :min="cfg.config.dateRange[0]"
            :max="cfg.config.dateRange[1]"
            :disabled="cfg.config.active"
          />
        </div>
        <div class="mb-3">
          <h5>Скорость смены дат</h5>
          <input
            class="form-control"
            type="number"
            required
            v-model="cfg.config.dayDelay"
            :disabled="cfg.config.active"
            min="100"
            max="10000"
          />
        </div>

        <div class="text-center">
          <button
            type="submit"
            class="btn px-5"
            :class="cfg.config.active ? 'btn-primary' : 'btn-outline-primary'"
          >
            Торги
          </button>
        </div>
      </form>
      <StocksRate v-if="cfg.config.active && rate" :rate="rate" class="pt-4" />
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { TradesConfigLoader } from "@/util";
import StocksRateList from "@/components/StocksRateList.vue";
import { StocksRate } from "@stocks_exchange/server";

// Страница настройки и запуска торгов (и просмотра котировок)
@Component({
  components: { StocksRate: StocksRateList },
})
export default class Bargaining extends Vue {
  $refs!: {
    form: HTMLFormElement;
  };

  get cfg(): TradesConfigLoader {
    return this.$store.state.cfg;
  }

  get rate(): StocksRate | null {
    return this.$store.state.rate;
  }

  private created() {
    this.cfg.fetch();
  }

  private async switchTrades() {
    if (this.rate?.end && this.cfg.config?.active) {
      this.cfg.config.active = false;
    } else {
      this.$store.commit("refresh");
      if (!this.cfg.config?.active) await this.cfg.save();
      await this.cfg.switchTrades();
    }
  }
}
</script>

<style scoped></style>
