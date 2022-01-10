<template>
  <v-card class="trip-info">
    <v-card-text>
      <strong>Total distance </strong>
      {{ distance }}
      <v-spacer class="my-2"/>
      <strong>Total duration </strong>
      {{ duration }}
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'TripInfo',

  props: {
    distance: {
      type: String,
      default: ''
    },

    duration: {
      type: String,
      default: ''
    }
  }
}
</script>

<style>
.trip-info {
  position: fixed;
  top: calc(100% - 150px);
  margin: 0 0.3em;
}
</style>
