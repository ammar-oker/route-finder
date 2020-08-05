<template>
  <v-app>
    <Map v-show="activeNav === 'map'"/>
    <Table v-show="activeNav === 'table'"/>
    <Details v-show="activeNav === 'details'"/>
    <v-bottom-navigation
      v-model="activeNav"
      grow
      shift
      fixed
      color="primary"
    >
      <v-btn value="map" class="nav-btn">
        <span>Map</span>
        <v-icon>mdi-map</v-icon>
      </v-btn>

      <v-btn value="table" class="nav-btn">
        <span>Table</span>
        <v-icon>mdi-table</v-icon>
      </v-btn>

      <v-btn value="details" class="nav-btn">
        <span>Details</span>
        <v-icon>mdi-information</v-icon>
      </v-btn>
    </v-bottom-navigation>
  </v-app>
</template>

<script>
import Map from './components/Map'
import Table from './components/Table'
import Details from './components/Details'

export default {
  name: 'App',

  components: {
    Details,
    Table,
    Map
  },

  data: () => ({
    activeNav: 'map'
  })
}
</script>

<style>
::-webkit-scrollbar {
  width: 4px;
}
::-webkit-scrollbar-thumb {
  background: #0084be;
  border-radius: 10px;
}
  .nav-btn {
    height: 100% !important;
  }
</style>
