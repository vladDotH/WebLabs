<template>
  <div v-show="profit.length" class="table-responsive text-center p-0">
    <table class="table">
      <thead>
        <tr>
          <th scope="col">Акция</th>
          <th scope="col">Количество</th>
          <th scope="col">Доход</th>
        </tr>
      </thead>
      <tbody class="fw-semibold">
        <tr v-for="stock of profit" :key="stock.key">
          <td class="col-4 text-primary">{{ stock.key }}</td>
          <td class="col-4">
            <span class="badge rounded-pill text-bg-secondary">
              {{ getCount(stock.key) }}
            </span>
          </td>
          <td
            class="col-4 bg-opacity-25"
            :class="stock.value > 0 ? 'bg-success' : 'bg-danger'"
          >
            {{ Math.round(stock.value * 100) / 100 }}$
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { ProfitRecord, User } from "@stocks_exchange/server";

// Информация об акциях и доходах брокера (для администратора)
@Component({})
export default class BrokerProfitInfo extends Vue {
  @Prop({ required: true }) readonly user!: User;
  @Prop({ required: true }) readonly profit!: ProfitRecord[];

  private getCount(key: string) {
    return this.user.stocks.find((s) => s.key == key)?.amount ?? 0;
  }
}
</script>

<style scoped lang="scss"></style>
