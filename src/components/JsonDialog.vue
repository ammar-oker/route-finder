<template>
  <v-dialog
    :value="value"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
    @input="$emit('input', $event)"
    @click:outside.prevent="close"
  >
    <v-card>
      <v-toolbar dark color="primary">
        <v-btn icon dark @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>Passengers array</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn text @click="json = []">Clear</v-btn>
        </v-toolbar-items>
        <v-toolbar-items>
          <v-btn text @click="resetTextarea">Default</v-btn>
        </v-toolbar-items
        >
        <v-toolbar-items>
          <v-btn @click="getRoute" color="white">
            <span style="color: #3883FA">Get route</span>
            <v-icon class="mx-2" style="color: #3883FA">mdi-directions</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <div class="my-3 mx-4">
        <v-jsoneditor
          v-model="json"
          :options="options"
          style="height: calc(100vh - 100px)"
          plus
          @input="syntaxError = false"
          @error="syntaxError = true"
        />
        <v-snackbar
          v-model="snackbar"
          color="error"
        >
          Syntax Error
          <template v-slot:action="{ attrs }">
            <v-btn
              color="white"
              text
              v-bind="attrs"
              @click="snackbar = false"
            >
              Close
            </v-btn>
          </template>
        </v-snackbar>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
import VJsoneditor from 'v-jsoneditor'
import { PASSENGERS } from '../mock'

export default {
  name: 'JsonDialog',

  components: {
    VJsoneditor
  },

  props: {
    value: Boolean
  },

  data: () => ({
    json: { ...PASSENGERS },
    snackbar: false,
    syntaxError: false,
    options: { mode: 'code' }
  }),

  watch: {
    json (newVal) {
      this.$emit('change', newVal)
    }
  },

  methods: {
    getRoute () {
      if (this.syntaxError) this.snackbar = true
      else this.$emit('get-route', this.json)
    },

    close () {
      this.$emit('input', false)
      this.$emit('close')
    },

    resetTextarea () {
      this.json = PASSENGERS
    }
  }
}
</script>
