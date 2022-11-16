<template>
  <form
    class="modal fade"
    data-bs-backdrop="static"
    ref="form"
    @submit.prevent="submit"
  >
    <div class="modal-dialog modal-dialog-centered modal-md">
      <div class="modal-content">
        <h3 class="modal-header">Редактировать Пользователя</h3>
        <div class="modal-body" v-if="buffer">
          <PersonalDataRedactor v-model="buffer" />
          <StatusDataRedactor v-if="admin" v-model="buffer" />
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="modal.hide()">
            Отмена
          </button>
          <button
            type="button"
            class="btn btn-info"
            @click="$refs.form.requestSubmit()"
          >
            Обновить
          </button>
        </div>
      </div>
    </div>
  </form>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Modal } from "bootstrap";
import { UserLoader } from "@/util";
import { UserData } from "../../../api";
import PersonalDataRedactor from "@/components/forms/PersonalDataRedactor.vue";
import StatusDataRedactor from "@/components/forms/StatusDataRedactor.vue";

// Всплывающее окно редактирования пользователя
@Component({
  components: { StatusDataRedactor, PersonalDataRedactor },
})
export default class RedactModal extends Vue {
  private modal!: Modal;
  private loader: UserLoader | null = null;
  private buffer: UserData | null = null;
  private admin = false;

  $refs!: {
    form: HTMLFormElement;
  };

  private mounted() {
    this.modal = new Modal(this.$refs.form);
  }

  show(loader: UserLoader, admin = false) {
    this.admin = admin;
    this.loader = loader;
    if (loader.data) {
      this.buffer = { ...loader.data };
    }
    this.modal.show();
  }

  private submit() {
    this.modal.hide();
    if (this.loader?.data && this.buffer) {
      this.loader.updatePersonal(this.buffer);
      if (this.admin) this.loader.updateStatus(this.buffer);
      this.loader = null;
    }
  }
}
</script>

<style scoped lang="scss"></style>
