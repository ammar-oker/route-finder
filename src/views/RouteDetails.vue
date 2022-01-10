<template>
<v-card style="min-height: calc(100vh - 56px)">
  <v-card-text v-if="!routeReady" style="text-align: center; margin: 4em 0">Start a new route to see details</v-card-text>
  <template v-else>
    <v-card-title>
      <h2>Route Details</h2>
    </v-card-title>
    <v-card-text>
      <p>
        <strong>Starting point</strong>
        {{ originPoint }}
      </p>
      <p>
        <strong>Destination point</strong>
        {{ destinationPoint }}
      </p>
      <p>
        <strong>Total route distance</strong>
        {{ totalDistance }}
      </p>
      <p>
        <strong>Total route duration</strong>
        {{ totalDuration }}
      </p>
      <p>
        <strong>Average of passengers' trip duration</strong>
        {{ averageDuration }}
      </p>
    </v-card-text>
  </template>
</v-card>
</template>

<script>
export default {
  name: 'RouteDetails',

  computed: {
    routeReady () {
      return this.$store.getters.routeReady
    },
    originPoint () {
      return this.$store.getters.originPoint
    },
    destinationPoint () {
      return this.$store.getters.destinationPoint
    },
    totalDistance () {
      return Math.round((this.$store.getters.totalDistance / 1000) * 10) / 10 + ' km'
    },
    totalDuration () {
      return this.secondsToHM(this.$store.getters.totalDuration)
    },
    averageDuration () {
      const total = this.$store.getters.totalDuration
      const passengersCount = this.$store.getters.enrichedPassengersInfo.length
      return this.secondsToHM(total / passengersCount)
    }
  },

  methods: {
    secondsToHM (d) {
      d = Number(d)
      const h = Math.floor(d / 3600)
      const m = Math.floor(d % 3600 / 60)

      const hDisplay = h > 0 ? h + (h === 1 ? ' hour, ' : ' hours, ') : ''
      const mDisplay = m > 0 ? m + (m === 1 ? ' minute ' : ' minutes ') : ''
      return hDisplay + mDisplay
    }
  }
}
</script>
