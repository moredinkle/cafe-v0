<template>
  <div>
    <v-card rounded>
      <v-data-table :headers="headers" :items="items" hide-default-footer>
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>{{ tableTitle }}</v-toolbar-title>
          </v-toolbar>
        </template>
        <template v-if="deleteButton" v-slot:[`item.actions`]="{ item }">
          <v-icon small @click="toggleDialog(item)"> mdi-delete </v-icon>
        </template>
      </v-data-table>
    </v-card>

    <popup-dialog
      :dialog="dialog"
      actionConfirmText="eliminar"
      dialogTitle="Seguro que desea eliminar?"
      @closeDialog="closeDialog"
      @confirmDialogAction="confirmDelete"
    />

    <!-- <v-snackbar v-model="snack" :timeout="2000" :color="snackColor">
      {{ snackText }}

      <template v-slot:action="{ attrs }">
        <v-btn v-bind="attrs" text @click="snack = false"> Close </v-btn>
      </template>
    </v-snackbar> -->
  </div>
</template>

<script>
import PopupDialog from "./PopupDialog.vue";

export default {
  name: "TableComponent",
  components: {
    PopupDialog,
  },
  props: {
    headers: Array,
    items: Array,
    tableTitle: String,
    editButton: Boolean,
    deleteButton: Boolean,
  },
  data() {
    return {
      dialog: false,
    };
  },
  methods: {
    toggleDialog(item) {
      this.dialog = true;
      console.log(`${item.nombre}  ${this.dialog}`);
    },

    closeDialog() {
      this.dialog = false;
    },

    confirmDelete(item) {
      this.dialog = false;
      this.$emit("deleteMenuItem", item);
    },
  },
};
</script>
