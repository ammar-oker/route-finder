<template>
  <v-bottom-navigation
      grow
      shift
      fixed
      color="primary"
  >
    <v-btn
        v-for="item in items"
        :key="item.link"
        :to='item.link'
        class="nav-btn"
    >
      <span>{{ item.title }}</span>
      <v-icon>{{ item.icon }}</v-icon>
    </v-btn>
  </v-bottom-navigation>
</template>

<script>
// import {routes} from "../router";

export default {
  name: 'Navigation',

  data: () => ({
    items: [
      {title: 'Map', link: '/', icon: 'mdi-map'},
      {title: 'Passengers', link: '/passengers', icon: 'mdi-table'},
      {title: 'Details', link: '/details', icon: 'mdi-information'}
    ]
  }),

  methods: {
    // navigate(path) {
    //   this.$root.currentRoute = path
    //   window.history.pushState(null, routes[this.href], path)
    // }
  }
}
</script>

<style lang="scss" scoped>
.nav-btn {
  //filter: none !important;
  height: 100% !important;

  //&.active {
  //  color: #1976d2;
  //  opacity: 1;
  //}
}
</style>
