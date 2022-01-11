<template>
  <v-dialog
    :model-value='value'
    fullscreen
    hide-overlay
    @update:modelValue="$emit('update:modelValue', $event)"
    @click:outside.prevent='close'
  >
    <v-card>
      <v-app-bar dark color='primary'>
        <v-btn icon='mdi-close' color='primary' @click='close' />
        <v-app-bar-title>Passengers array</v-app-bar-title>
        <v-spacer></v-spacer>
        <div class='modal-actions'>
          <v-btn color='primary' @click='json = []'>Clear</v-btn>
          <v-btn color='primary' @click='resetTextarea'>Default</v-btn>
          <v-btn @click='getRoute' color='white' text-color='primary'>
            <span>Get route</span>
            <v-icon class='mx-2'>mdi-directions</v-icon>
          </v-btn>
        </div>
      </v-app-bar>
      <div style='height: 100vh; padding-top: 70px'>
        <v-textarea v-model='json'/>
<!--        <vue3-json-editor-->
<!--          v-model='json'-->
<!--          expandedOnStart-->
<!--          mode='code'-->
<!--          @json-change='syntaxError = false'-->
<!--          @has-error='syntaxError = true'-->
<!--        />-->
        <!--        <v-jsoneditor-->
        <!--          v-model="json"-->
        <!--          :options="options"-->
        <!--          style="height: calc(100vh - 100px)"-->
        <!--          plus-->
        <!--          @input="syntaxError = false"-->
        <!--          @error="syntaxError = true"-->
        <!--        />-->
        <!--        <v-snackbar-->
        <!--          v-model="snackbar"-->
        <!--          color="error"-->
        <!--        >-->
        <!--          Syntax Error-->
        <!--          <template v-slot:action="{ attrs }">-->
        <!--            <v-btn-->
        <!--              color="white"-->
        <!--              text-->
        <!--              v-bind="attrs"-->
        <!--              @click="snackbar = false"-->
        <!--            >-->
        <!--              Close-->
        <!--            </v-btn>-->
        <!--          </template>-->
        <!--        </v-snackbar>-->
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
import { PASSENGERS } from '../mock';
// import { Vue3JsonEditor } from 'vue3-json-editor';

export default {
  name: 'JsonDialog',

  components: {
    // Vue3JsonEditor,
  },

  props: {
    value: Boolean,
  },

  data: () => ({
    json: JSON.stringify(PASSENGERS),
    snackbar: false,
    syntaxError: false,
    options: { mode: 'code' },
  }),

  watch: {
    json(newVal) {
      this.$emit('change', newVal);
    },
  },

  methods: {
    getRoute() {
      if (this.isValidJson(this.json)) {
        this.$emit('get-route', JSON.parse(this.json));
      } else {
        window.alert('Syntax Error');
      }
    },

    close() {
      this.$emit('update:modelValue', false);
      this.$emit('close');
    },

    resetTextarea() {
      this.json = JSON.stringify(PASSENGERS);
    },

    isValidJson(str) {
      try {
        JSON.parse(str);
      } catch (e) {
        return false;
      }
      return true;
    },
  },
};
</script>

<style lang='scss' scoped>
.modal-actions {
  .v-btn:not(:last-child) {
    margin-right: 10px;
  }
}
</style>
