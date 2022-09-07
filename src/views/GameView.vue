<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';
import Tetris from "@/components/Tetris.vue";

@Component({
  components: {Tetris}
})
export default class GameView extends Vue {

}
</script>

<template>
  <Tetris :width="10" :height="20"/>
</template>

<style scoped>

</style>