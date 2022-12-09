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

  get options() {
    return { responsive: true };
  }

  get plotData() {
    return {
      labels: this.history?.records?.map((r) => r.date),
      datasets: [
        {
          label: `Курс ${this.history.stock.key}`,
          data: this.history?.records?.map((r) => r.cost),
          borderColor: "#198754",
        },
      ],
    };
  }
}
</script>

<style scoped lang="scss"></style>
