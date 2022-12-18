<template>
  <div>
    <LineChart :data="plotData" :options="options" />
  </div>
</template>

<script lang="ts">
import { Prop, Component, Vue } from "vue-property-decorator";
import { StockHistory } from "@stocks_exchange/server";
import { Line } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// График истории стоимости акции
@Component({ components: { LineChart: Line } })
export default class StockPlot extends Vue {
  @Prop({ required: true }) readonly history!: StockHistory;

  private get options() {
    return { responsive: true };
  }

  private get plotData() {
    return {
      labels: this.history?.records?.map((r) => r.date),
      datasets: [
        {
          label: `Курс акций ${this.history.stock.company}`,
          data: this.history?.records?.map((r) => r.cost),
          borderColor: "#198754",
        },
      ],
    };
  }
}
</script>

<style scoped lang="scss"></style>
