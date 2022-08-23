<template>
  <!--eslint-disable-next-line vue/no-mutating-props -->
  <v-dialog v-model="dialog" max-width="500px">
    <v-card>
      <v-card-title class="text-h5"> {{ dialogTitle }} </v-card-title>
      <v-card-text class="justify-center">
        <slot></slot>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="gray darken-1" text @click="closeDialog">Cancelar</v-btn>
        <v-btn :color="actionConfirmColor" text @click="confirmAction">{{ actionConfirmText}}</v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "PopupDialog",
  props: {
    dialog: Boolean,
    dialogTitle: String,
    actionConfirmText: String,
    actionConfirmColor: {
      type: String,
      default: "success",
    },
  },
  data() {
    return {};
  },
  methods: {
    closeDialog() {
      this.$emit("closeDialog");
    },
    confirmAction() {
      this.$emit("confirmDialogAction");
    },
  },
};
</script>
