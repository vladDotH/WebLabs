<template>
  <form
    class="modal fade"
    data-bs-backdrop="static"
    ref="form"
    @submit.prevent="submit"
  >
    <div class="modal-dialog modal-dialog-centered modal-md">
      <div class="modal-content">
        <h3 class="modal-header">Регистрация</h3>
        <div class="modal-body" v-if="usud">
          <PersonalDataRedactor v-model="usud" />

          <div class="mb-3">
            <label>Пароль</label>
            <input
              required
              class="form-control"
              type="password"
              v-model="usud.password"
              placeholder="Пароль"
            />
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="modal.hide()">
            Отмена
          </button>
          <button
            type="button"
            class="btn btn-warning"
            @click="$refs.form.requestSubmit()"
          >
            Подтвердить
          </button>
        </div>
      </div>
    </div>
  </form>
</template>

<script lang="ts">
import { Component, InjectReactive, Vue } from "vue-property-decorator";
import { Modal } from "bootstrap";
import { UserController } from "@/util";
import { UserSignUpData } from "../../../api";
import PersonalDataRedactor from "@/components/forms/PersonalDataRedactor.vue";
import StatusDataRedactor from "@/components/forms/StatusDataRedactor.vue";
import Toaster, { States } from "@/components/Toaster.vue";

// Всплывающее окно регистрации
@Component({
  components: { StatusDataRedactor, PersonalDataRedactor },
})
export default class SignUpModal extends Vue {
  @InjectReactive() readonly toaster!: Toaster | null;
  private modal!: Modal;
  private usud: UserSignUpData | null = null;

  $refs!: {
    form: HTMLFormElement;
  };

  private mounted() {
    this.modal = new Modal(this.$refs.form);
  }

  show() {
    this.usud = {
      email: "",
      name: "",
      surname: "",
      lastName: "",
      birthDate: "",
      password: "",
    };

    this.modal.show();
  }

  private async submit() {
    if (this.usud)
      if (await UserController.signUp(this.usud)) {
        this.toaster?.show("Вы успешно зарегистрированы", States.SUCCESS);
        this.modal.hide();
      } else {
        this.toaster?.show(
          "Пользователь c таким email-ом уже существует",
          States.WARNING
        );
      }
  }
}
</script>

<style scoped lang="scss"></style>
