<template>
  <v-alert v-if='step !== 3' dismissible class="alert" type="info">
    <template v-if="step === 0">
      Click on
      <v-icon>mdi-directions</v-icon>
      button below to get started with new route.
    </template>

    <template v-else-if="step === 1">
      Drag the marker to origin point and click
      <v-icon>mdi-check</v-icon>
    </template>

    <template v-else-if="step === 2">
      Drag the marker to destination point and click
      <v-icon>mdi-check</v-icon>
    </template>

    <template v-else-if="step === 4">
      Click on any marker with number to get passenger's info
    </template>
  </v-alert>
</template>

<script>
export default {
  name: 'InfoAlerts',

  props: {
    step: {
      type: Number,
      required: true
    }
  }
}
</script>

<style scoped>
.alert {
  position: fixed !important;
  z-index: 2;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 2em);
  margin: 0.5em auto;
}

@media only screen and (min-width: 992px) {
  .alert {
    width: 50%;
  }
}
</style>
