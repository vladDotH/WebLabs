<template>
  <div v-if="sd">
    <div class="mb-3">
      <label class="d-block">Роль</label>
      <div class="btn-group">
        <input
          type="radio"
          class="btn-check"
          name="role"
          id="user"
          v-model="sd.role"
          :value="Role.USER"
        />
        <label class="btn btn-outline-secondary" for="user">Пользователь</label>

        <input
          type="radio"
          class="btn-check"
          name="role"
          id="admin"
          v-model="sd.role"
          :value="Role.ADMIN"
        />
        <label class="btn btn-outline-info" for="admin">Администратор</label>
      </div>
    </div>

    <div class="mb-3">
      <label class="d-block">Статус</label>
      <div class="btn-group">
        <input
          type="radio"
          class="btn-check"
          name="status"
          id="active"
          v-model="sd.status"
          :value="Status.ACTIVE"
        />
        <label class="btn btn-outline-success" for="active">Активный</label>

        <input
          type="radio"
          class="btn-check"
          name="status"
          id="unconfirmed"
          v-model="sd.status"
          :value="Status.UNCONFIRMED"
        />
        <label class="btn btn-outline-warning" for="unconfirmed">
          Не подтверждённый
        </label>

        <input
          type="radio"
          class="btn-check"
          name="status"
          id="blocked"
          v-model="sd.status"
          :value="Status.BLOCKED"
        />
        <label class="btn btn-outline-danger" for="blocked">
          Заблокированный
        </label>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Model, Vue } from "vue-property-decorator";

import { Role, Status, UserStatusData } from "../../../api";

// Поля редактирования статусной информации
@Component({})
export default class StatusDataRedactor extends Vue {
  private Role = Role;
  private Status = Status;
  @Model("status-changed", { required: true }) sd!: UserStatusData;
}
</script>

<style scoped lang="scss"></style>
