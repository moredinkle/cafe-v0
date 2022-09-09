<!-- eslint-disable vue/no-mutating-props -->
<template>
  <v-snackbar v-model="snackIsVisible" :timeout="timeout" :color="snackColor">
    {{ snackText }}
    <template v-slot:action="{ attrs }">
      <v-btn v-bind="attrs" text @click="snack = false"> Close </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
export default {
  name: "SnackBar",
  props: {
    snackIsVisible: Boolean,
    snackColor: String,
    snackText: String,
    timeout: Number,
  },
};
</script>
