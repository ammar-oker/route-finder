<template>
  <v-container>
    <v-card-text v-if='!routeReady' style='text-align: center; margin: 4em 0'>
      Start a new route to see passengers table
    </v-card-text>
    <template v-else>
      <v-card-title>
        <h1>Passengers</h1>
        <v-spacer></v-spacer>
      </v-card-title>
      <v-table>
        <thead>
        <tr>
          <th v-for='header in headers' :key='header.value' v-text='header.text' />
        </tr>
        </thead>
        <tbody>
        <tr v-for='passenger in enrichedPassengersInfo' :key="`tbody-${passenger.name}`">
          <td v-for='header in headers' :key="`${header.value}-${passenger.name}`">
            {{ passenger[header.value] }}
          </td>
        </tr>
        </tbody>
      </v-table>
    </template>
  </v-container>
</template>

<script>
export default {
  name: 'PassengersTable',
  data() {
    return {
      search: '',
      headers: [
        {
          text: 'Pick up point order',
          align: 'start',
          value: 'pickUpPointOrder',
        },
        { text: 'Name', value: 'name' },
        { text: 'Duration', value: 'duration' },
      ],
    };
  },

  computed: {
    routeReady() {
      return this.$store.state.routeReady;
    },
    enrichedPassengersInfo() {
      const passengers = [];
      this.$store.state.enrichedPassengersInfo.forEach(passenger => {
        passengers.push({
          ...passenger,
          duration: this.secondsToHM(passenger.duration),
        });
      });
      return passengers;
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
