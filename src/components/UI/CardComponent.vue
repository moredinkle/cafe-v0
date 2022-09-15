<!-- no se utiliza en todo, solo en ventas e historial -->
<template>
  <v-card rounded>
    <v-card-title class="text-h5"> {{ cardTitle }} </v-card-title>
    <v-card-text class="justify-center">
      <slot></slot>
    </v-card-text>
    <v-card-actions v-if="allowButton">
      <v-btn block x-large :color="buttonColor" dark @click="confirmAction">{{
        buttonText
      }}</v-btn>
      <!-- <div v-if="cancelButton">
        <v-spacer></v-spacer>
        <v-btn class="mx-2" color="gray darken-1" dark @click="cancelAction">Cancelar</v-btn>
        <v-btn class="mx-2" :color="buttonColor" dark @click="confirmAction">{{buttonText}}</v-btn>
      </div>
      <div v-else>
        <v-btn block x-large :color="buttonColor" dark @click="confirmAction">{{
          buttonText
        }}</v-btn>
      </div> -->
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "CardComponent",
  props: {
    cardTitle: String,
    buttonColor: String,
    buttonText: String,
    cancelButton: Boolean,
    allowButton: Boolean,
  },
  data() {
    return {};
  },
  methods: {
    confirmAction() {
      this.$emit("confirmCardAction");
    },
    cancelAction() {
      this.$emit("cancelCardAction");
    },
  },
};
</script>
