<template>
  <div>
    <table class="table table-striped">
      <thead>
        <tr>
          <th scope="col">Дата</th>
          <th scope="col">Цена</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="record of history.records" :key="record.date">
          <td>{{ new Date(record.date).toLocaleDateString() }}</td>
          <td>{{ record.cost }}$</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { Prop, Component, Vue } from "vue-property-decorator";
import { StockHistory } from "@stocks_exchange/server";

// Таблица истории стоимости акции
@Component({})
export default class StockTable extends Vue {
  @Prop({ required: true }) readonly history!: StockHistory;
}
</script>

<style scoped lang="scss"></style>
