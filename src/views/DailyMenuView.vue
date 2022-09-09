<template>
  <!-- siempre va a cargar el último menú creado
-->
  <div>
    <h1>Menú diario</h1>
    <v-btn class="mb-3" dark color="black" @click="dateDialog = true">Crear nuevo menú</v-btn>
    <v-btn class="mx-3 mb-3" dark color="warning" @click="blockDialog = true">Bloquear menú</v-btn>
    <form-component
      :formTitle="menuFormTitle"
      :formElements="menuFormItems"
      @saveForm="saveMenuItem"
    />
    <table-component
      class="my-3"
      :headers="tableHeaders"
      :items="menuItems"
      :deleteButton="allowDeleteButton"
      @deleteTableItem="deleteMenuItem"
      :tableTitle="menuTableTitle"
    />

    <!-- dialogo para crear un nuevo menú -->
    <popup-dialog
      :dialog="dateDialog"
      actionConfirmText="crear"
      dialogTitle="Crear nuevo menú"
      @closeDialog="dateDialog = false"
      @confirmDialogAction="createNewMenu"
    >
      <v-date-picker
        v-model="menuDate"
        class="my-4"
        :min="today"
        max="2035-12-31"
      ></v-date-picker>

      <p>Nuevo menú: {{ menuDate }}</p>
    </popup-dialog>

    <!-- dialogo para bloquear el menú -->
    <popup-dialog
      :dialog="blockDialog"
      actionConfirmText="bloquear"
      dialogTitle="Bloquear menú"
      actionConfirmColor="warning"
      @closeDialog="blockDialog = false"
      @confirmDialogAction="blockMenu"
    >
      No se podrá eliminar elementos del menú
    </popup-dialog>
  </div>
</template>

<script>
import FormComponent from "../components/UI/FormComponent.vue";
import TableComponent from "../components/UI/TableComponent.vue";
import PopupDialog from "../components/UI/PopupDialog.vue";

export default {
  name: "DailyMenuView",

  components: {
    FormComponent,
    TableComponent,
    PopupDialog,
  },

  data() {
    return {
      today: new Date().toISOString().slice(0, 10),
      menuDate: "",
      blockDialog: false,
      dateDialog: false,
      dateDialogTitle: "Crear nuevo menú",
      menuFormTitle: "Añadir al menú",
      menuTableTitle: "Menú del dia",
      allowDeleteButton: true,
      menuFormItems: [
        {
          count: 50,
          label: "Nombre",
          type: "text",
          rules: [
            (v) => !!v || "Campo obligatorio",
            (v) => (v && v.length <= 50) || "Máximo 50 caracteres",
          ],
        },
        {
          count: 10,
          label: "Precio",
          type: "number",
          rules: [
            (v) => !!v || "Campo obligatorio",
            (v) => (v && v.length <= 10) || "Máximo 10 caracteres",
          ],
        },
      ],
      tableHeaders: [
        {
          text: "Nombre",
          align: "start",
          sortable: false,
          value: "nombre",
        },
        { text: "Precio", value: "precio" },
        { text: "Eliminar", value: "actions", sortable: false },
      ],
      menuItems: [
        {
          nombre: "cosa 1",
          precio: 23,
        },
        {
          nombre: "cosa 2",
          precio: 234,
        },
      ],
    };
  },

  methods: {
    saveMenuItem(formData) {
      const menuItem = {
        nombre: formData[0],
        precio: +formData[1],
      };
      //aca se comunica con el backend
      this.menuItems.push(menuItem);
      console.log(`${menuItem.nombre}--${menuItem.precio}`);
    },

    deleteMenuItem(item) {
      let index = this.menuItems.indexOf(item);
      //aca se comunica con el backend
      this.menuItems = this.menuItems.splice(index);
    },

    createNewMenu() {
      console.log(`Nuevo menú: ${this.menuDate}`);
      this.menuTableTitle = `${this.menuTableTitle}: ${this.menuDate}`;
      this.dateDialog = false;
    },

    blockMenu() {
      this.tableHeaders.splice(this.tableHeaders.length - 1);
      this.allowDeleteButton = false;
      this.blockDialog = false;
    },
  },

  created() {
    //TODO poner la fecha del último menú en la tabla al crear
  },
};
</script>
