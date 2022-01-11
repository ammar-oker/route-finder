<template>
    <v-container>
      <v-card-text v-if='!routeReady' style='text-align: center; margin: 4em 0'>Start a new route to see details
      </v-card-text>
      <template v-else>
        <v-card-title>
          <h1>Route Details</h1>
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
    </v-container>
</template>

<script>
export default {
  name: 'RouteDetails',
  computed: {
    routeReady() {
      return this.$store.state.routeReady;
    },
    originPoint() {
      return this.$store.state.originPoint;
    },
    destinationPoint() {
      return this.$store.state.destinationPoint;
    },
    totalDistance() {
      return Math.round((this.$store.state.totalDistance / 1000) * 10) / 10 + ' km';
    },
    totalDuration() {
      return this.secondsToHM(this.$store.state.totalDuration);
    },
    averageDuration() {
      const total = this.$store.state.totalDuration;
      const passengersCount = this.$store.state.enrichedPassengersInfo.length;
      return this.secondsToHM(total / passengersCount);
    },
  },

  methods: {
    secondsToHM(d) {
      d = Number(d);
      const h = Math.floor(d / 3600);
      const m = Math.floor(d % 3600 / 60);

      const hDisplay = h > 0 ? h + (h === 1 ? ' hour, ' : ' hours, ') : '';
      const mDisplay = m > 0 ? m + (m === 1 ? ' minute ' : ' minutes ') : '';
      return hDisplay + mDisplay;
    },
  },
};
</script>
