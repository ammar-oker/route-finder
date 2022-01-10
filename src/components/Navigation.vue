<template>
  <v-bottom-navigation
    :value="value"
    grow
    shift
    fixed
    color="primary"
    background-color="#FFFFFF"
    @change="$emit('input', $event)"
  >
    <v-btn
      v-for="item in items"
      :key="item.value"
      :value="item.value"
      color="#FFFFFF"
       class="nav-btn"
    >
      <span>{{ item.title }}</span>
      <v-icon>{{ item.icon }}</v-icon>
    </v-btn>
  </v-bottom-navigation>
</template>

<script>
export default {
  name: 'Navigation',

  props: {
    value: {
      type: String,
      required: true
    }
  },

  data: () => ({
    items: [
      { title: 'Map', value: 'map', icon: 'mdi-map' },
      { title: 'Passengers', value: 'table', icon: 'mdi-table' },
      { title: 'Details', value: 'details', icon: 'mdi-information' }
    ]
  })
}
</script>

<style scoped>
.nav-btn {
  height: 100% !important;
}
</style>
