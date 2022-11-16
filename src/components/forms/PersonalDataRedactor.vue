<template>
  <div v-if="pd">
    <div class="mb-3">
      <label>Фамилия</label>
      <input
        required
        class="form-control"
        type="text"
        v-model="pd.surname"
        placeholder="Иванов"
      />
    </div>

    <div class="mb-3">
      <label>Имя</label>
      <input
        required
        class="form-control"
        type="text"
        v-model="pd.name"
        placeholder="Иван"
      />
    </div>

    <div class="mb-3">
      <label>Отчество</label>
      <input
        class="form-control"
        type="text"
        v-model="pd.lastName"
        placeholder="Иванович"
      />
    </div>

    <div class="mb-3">
      <label>Дата рождения</label>
      <input
        required
        class="form-control"
        type="date"
        v-model="pd.birthDate"
        placeholder="1970-01-01"
      />
    </div>

    <div class="mb-3">
      <label>Адрес электронной почты</label>
      <input
        required
        class="form-control"
        type="email"
        v-model="pd.email"
        placeholder="example@mail.com"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Model, Vue } from "vue-property-decorator";
import { PersonalData } from "../../../api";

// Поля редактирования персональной информации
@Component
export default class PersonalDataRedactor extends Vue {
  @Model("data-changed", { required: true }) pd!: PersonalData;
}
</script>

<style scoped lang="scss"></style>
