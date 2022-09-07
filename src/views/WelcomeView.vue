<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';

@Component
export default class WelcomeView extends Vue {

}

</script>

<template>
<router-link to="/game">
  <div>Run Game</div>
</router-link>
</template>

<style scoped>

</style>