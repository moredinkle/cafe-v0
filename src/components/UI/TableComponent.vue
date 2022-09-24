<template>
  <div>
    <v-card rounded>
      <v-data-table :headers="headers" :items="items" hide-default-footer disable-pagination>
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>{{ tableTitle }}</v-toolbar-title>
          </v-toolbar>
        </template>
        <template v-if="deleteButton" v-slot:[`item.actions`]="{ item }">
          <v-icon small @click="toggleDialog(item)"> mdi-delete </v-icon>
        </template>
        <!-- <template v-if="allowCheckbox" v-slot:[`item.checkbox`]="{ item }">
          <v-simple-checkbox @input="checkboxChange(item)" v-model="item.checkbox"></v-simple-checkbox>
        </template> -->
      </v-data-table>
    </v-card>

    <popup-dialog
      :dialog="dialog"
      actionConfirmText="eliminar"
      :dialogTitle="dialogTitle"
      @closeDialog="closeDialog"
      @confirmDialogAction="confirmDelete"
    />
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
    tableTitle: {
      type: String,
      default: "",
    },
    editButton: Boolean,
    deleteButton: Boolean,
    // allowCheckbox: Boolean,
  },
  data() {
    return {
      dialog: false,
      dialogTitle: "",
      itemToDelete: {},
    };
  },
  methods: {
    toggleDialog(item) {
      this.dialogTitle = `Seguro que desea eliminar ${item.nombre} ?`;
      this.dialog = true;
      this.itemToDelete = { ...item };
    },

    // checkboxChange(item) {
    //   console.log(item);
    //   this.$emit("checkboxChange", item);
    // },

    closeDialog() {
      this.dialog = false;
    },

    confirmDelete() {
      this.dialog = false;
      this.$emit("deleteTableItem", this.itemToDelete);
    },
  },
};
</script>
