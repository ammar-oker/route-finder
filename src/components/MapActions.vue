<template>
  <div class="fab">
    <v-btn v-if="step === 0 || step === 4" fab large color="primary" @click="$emit('set-origin-point')">
      <div>
        <v-icon>mdi-directions</v-icon>
        <br>
        <span v-if="step === 0" class="mt-2">GO</span>
        <span v-else class="mt-2">NEW</span>
      </div>
    </v-btn>
    <v-btn v-if="step === 1" fab large color="primary" @click="$emit('set-destination-point')">
      <v-icon>mdi-check</v-icon>
    </v-btn>
    <v-btn v-if="step === 2" fab large color="primary" @click="$emit('set-passengers')">
      <v-icon>mdi-check</v-icon>
    </v-btn>
  </div>
</template>

<script>
export default {
  name: 'MapActions',

  props: {
    step: {
      type: Number,
      required: true
    }
  }
}
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
