<template>
  <!-- eslint-disable-next-line vue/no-mutating-props -->
  <v-snackbar v-model="showSnackbar" :timeout="timer" :color="color">
    {{ text }}
    <template v-slot:action="{ attrs }">
      <v-btn v-bind="attrs" text @click="showSnackbar = false"> Close </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
export default {
  name: "SnackBar",

  data() {
    return {
      showSnackbar: false,
      text: '',
      color: '',
      timer: 1000
    };
  },

  methods: {
    show(data) {
      this.text = data.text || 'missing "text".'
      this.color = data.color || 'success'
      this.timer = data.timer || 1000
      this.showSnackbar = true
    }
  }
};
</script>
