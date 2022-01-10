<template>
  <v-app>
    <main-map v-show="activeNav === 'map'"/>
    <passengers-table v-show="activeNav === 'table'"/>
    <route-details v-show="activeNav === 'details'"/>
    <navigation v-model="activeNav"/>
  </v-app>
</template>

<script>
import Navigation from './components/Navigation'
import PassengersTable from './views/PassengersTable'
import RouteDetails from './views/RouteDetails'
import MainMap from './views/MainMap'

export default {
  name: 'App',

  components: {
    MainMap,
    RouteDetails,
    PassengersTable,
    Navigation
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

html {
  overflow: auto;
}
</style>
