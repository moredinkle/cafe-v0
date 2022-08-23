<template>
<!-- siempre va a cargar el último menú creado -->
  <div>
    <v-container>
      <v-row class="text-center">
        <v-col cols="12">
          <h1>Menú diario</h1>
          <v-btn class="mb-3" color="success" @click="dateDialog = true">Crear nuevo menú</v-btn>
          <form-component
            :formTitle="menuFormTitle"
            :formElements="menuFormItems"
            @saveForm="saveMenuItem"
          />
          <table-component
            class="my-3"
            :headers="tableHeaders"
            :items="menuItems"
            deleteButton
            @deleteMenuItem="deleteMenuItem"
            tableTitle="Menú del dia"
          />
        </v-col>
      </v-row>
    </v-container>

<!-- crear un nuevo menú o mostrar el último -->
    <popup-dialog
      :dialog="dateDialog"
      actionConfirmText="crear"
      dialogTitle="Crear nuevo menú"
      @closeDialog="closeDateDialog"
      @confirmDialogAction="confirmDelete"
    >
      <v-date-picker
        v-model="date"
        class="my-4"
        :min=today
        max="2035-12-31"
      ></v-date-picker>
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
      menuDate: '',
      dateDialog: false,
      menuFormTitle: "Añadir al menú",
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
    closeDateDialog() {
      this.dateDialog = false;
    },
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
  },
};
</script>
