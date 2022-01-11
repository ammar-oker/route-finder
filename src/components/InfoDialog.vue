<template>
  <v-dialog
    :model-value="value"
    @update:modelValue="$emit('update:modelValue', $event)"
    @click:outside.prevent="$emit('update:modelValue', false)"
  >
    <v-card>
      <v-card-title class="headline">
        <v-icon class="mr-2" :color="type">
          mdi-alert-circle
        </v-icon>
        {{ type.toLocaleUpperCase() }}
      </v-card-title>

      <v-card-text v-html="text"/>

      <v-card-actions>
        <v-spacer/>
        <v-btn
          text
          @click="$emit('update:modelValue', false)"
        >
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'InfoDialog',

  props: {
    value: Boolean,
    text: {
      type: [String, Error],
      default: null
    },
    type: {
      type: String,
      required: true
    }
  }
}
</script>
