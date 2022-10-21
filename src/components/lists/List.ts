import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";

// Миксин списка объектов
@Component
export default class List extends Vue {
  @Prop({ required: true }) readonly list!: number[];
}
