<template>
  <div class='fab'>
    <v-btn v-if='step === 0' icon='mdi-directions' size='x-large' color='primary' @click="$emit('set-origin-point')" />
    <v-btn v-if='step === 1' icon='mdi-check' size='x-large' color='primary' @click="$emit('set-destination-point')" />
    <v-btn v-if='step === 2' icon='mdi-check' size='x-large' color='primary' @click="$emit('set-passengers')" />
    <v-btn v-if='step === 4' icon='mdi-cancel' size='x-large' color='primary' @click="$emit('reset')" />
  </div>
</template>

<script>
export default {
  name: 'MapActions',

  props: {
    step: {
      type: Number,
      required: true,
    },
  },
};
</script>

<style scoped>
.fab {
  position: fixed !important;
  z-index: 2;
  top: calc(100% - 150px);
  right: 0;
  margin: 0 1.5em;
}
</style>
