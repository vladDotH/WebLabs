<template>
  <section></section>
</template>

<script lang="ts">
import { Component, InjectReactive, Vue } from "vue-property-decorator";
import axios from "axios";
import { config, Status, UserAuthData } from "@/../api";
import Toaster from "@/components/Toaster.vue";
import { Views } from "@/router";

// Страница входа
@Component({})
export default class Messanger extends Vue {}
</script>

<style scoped lang="scss"></style>
