<template>
  <v-card
    style="min-height: calc(100vh - 56px); padding-bottom: 100px"
  >
    <v-card-text v-if="!routeReady" style="text-align: center; margin: 4em 0">Start a new route to see passengers table</v-card-text>
    <template v-else>
      <v-card-title>
        Passengers
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="enrichedPassengersInfo"
        :search="search"
        :hide-default-footer="true"
      ></v-data-table>
    </template>
  </v-card>
</template>

<script>
export default {
  data () {
    return {
      search: '',
      headers: [
        {
          text: 'Pick up point order',
          align: 'start',
          value: 'pickUpPointOrder'
        },
        { text: 'Name', value: 'name' },
        { text: 'Duration', value: 'duration' }
      ]
    }
  },
  computed: {
    routeReady () {
      return this.$store.getters.routeReady
    },
    enrichedPassengersInfo () {
      const passengers = []
      this.$store.getters.enrichedPassengersInfo.forEach(passenger => {
        passengers.push({
          ...passenger,
          duration: this.secondsToHM(passenger.duration)
        })
      })
      return passengers
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
