<template>
  <v-app>
    <slot/>
    <navigation/>
  </v-app>
</template>

<script>
import Navigation from '../components/Navigation';

export default {
  name: 'MainLayout',
  components: { Navigation },
}
</script>
