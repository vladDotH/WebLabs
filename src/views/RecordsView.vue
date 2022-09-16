<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import {Records} from "@/components/Tetris.vue";

@Component
export default class RecordsView extends Vue {
  private records!: Records;

  private created() {
    this.records = JSON.parse(localStorage.getItem('tetris.records') ?? '{"records":[]}') as Records;
    this.records.records.sort((a, b) => b[1] - a[1]);
  }
}

</script>

<template>
  <section class="main">
    Таблица рекордов
    <hr>
    <table>
      <tr v-for="rec of records.records">
        <td class="name">{{ rec[0] }}</td>
        <td class="score">{{ rec[1] }}</td>
      </tr>
    </table>
  </section>
</template>

<style scoped lang="scss">
@import "../styles/main";

table {
  text-align: center;
  margin: auto;
  border-spacing: 1vh;

  .name {
    color: $primary;
  }

  .score {
    font-weight: bold;
    color: $secondary;
  }
}
</style>