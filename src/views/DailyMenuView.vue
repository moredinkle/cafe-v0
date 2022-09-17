<template>
  <!-- siempre va a cargar el último menú creado
-->
  <div>
    <h1>Menú diario</h1>
    <h3 class="mb-4">Fecha menú actual: {{ fechaMenuActual }}</h3>
    <v-btn class="mb-3" dark color="black" @click="dateDialog = true"
      >Crear nuevo menú</v-btn
    >
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

    <card-component cardTitle="Disponibilidad">
      <div v-for="item in menuItems" :key="item.id_item_menu">
        <v-spacer></v-spacer>
        <v-switch
          v-model="item.checkbox"
          inset
          :label="item.nombre"
          @change="changeItemState(item)"
        ></v-switch>
      </div>
    </card-component>

    <!-- dialogo para crear un nuevo menú -->
    <popup-dialog
      :dialog="dateDialog"
      actionConfirmText="crear"
      dialogTitle="Crear nuevo menú"
      @closeDialog="dateDialog = false"
      @confirmDialogAction="createNewMenu"
    >
      <v-date-picker
        v-model="newMenuDate"
        class="my-4"
        :min="today"
        max="2035-12-31"
      ></v-date-picker>

      <p>Nuevo menú: {{ newMenuDate }}</p>
    </popup-dialog>

    <snack-bar />
  </div>
</template>

<script>
import FormComponent from "../components/UI/FormComponent.vue";
import TableComponent from "../components/UI/TableComponent.vue";
import CardComponent from "../components/UI/CardComponent.vue";
import PopupDialog from "../components/UI/PopupDialog.vue";
import SnackBar from "../components/UI/SnackBar.vue";

export default {
  name: "DailyMenuView",

  components: {
    FormComponent,
    TableComponent,
    PopupDialog,
    SnackBar,
    CardComponent,
  },

  computed: {
    fechaMenuActual() {
      return this.$store.state.fechaActual;
    },

    idMenuActual() {
      return this.$store.state.idMenuActual;
    },

    idResumenActual() {
      return this.$store.state.idResumenActual;
    },

    estadoMenuActual() {
      return this.$store.state.estadoMenuActual;
    },
  },

  data() {
    return {
      today: "",
      newMenuDate: "",
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
        // { text: "Disponible", value: "checkbox", sortable: false },
        { text: "Eliminar", value: "actions", sortable: false },
      ],
      menuItems: [],
    };
  },

  methods: {
    createNewMenu() {
      this.dateDialog = false;
      //nuevo menú
      const menu = { fecha_menu: this.newMenuDate };
      this.$http
        .post(`${this.$store.state.urlapi}menus/`, menu)
        .then((response) => {
          if (response.status == 200) {
            //nuevo resumen
            const resumen = {
              fecha_resumen: this.newMenuDate,
              id_menu: response.data.insertId,
            };
            this.$http
              .post(`${this.$store.state.urlapi}resumenes/`, resumen)
              .then((resp) => {
                if (resp.status == 200) {
                  //cambiar estado menu a completado
                  this.setMenuCompleted(resumen, resp.data.insertId);
                }
              })
              .catch((error) => {
                alert(`${error.message}`);
              });
          }
        })
        .catch((error) => {
          alert(`${error.message}`);
        });
    },

    saveMenuItem(formData) {
      const menuItem = {
        nombre: formData[0],
        precio: +formData[1],
      };
      this.$http
        .post(
          `${this.$store.state.urlapi}menu-items/${this.idMenuActual}`,
          menuItem
        )
        .then((response) => {
          if (response.status == 200) {
            this.requestMenuItems();
            this.$root.vtoast.show({
              text: "Añadido al menú",
              color: "success",
            });
          }
        })
        .catch((error) => {
          alert(`${error.message}`);
        });
    },

    deleteMenuItem(item) {
      this.$http
        .delete(`${this.$store.state.urlapi}menu-items/${item.id_item_menu}`)
        .then((response) => {
          if (response.status == 200) {
            this.requestMenuItems();
            this.$root.vtoast.show({
              text: "Eliminado del menú",
              color: "warning",
            });
          }
        })
        .catch((error) => {
          alert(`${error.message}`);
        });
    },

    getMenuItems() {
      this.menuItems = this.$store.state.menuActualItems;
      this.menuItems.map((item) => {
        item.estado === 1
          ? (item["checkbox"] = true)
          : (item["checkbox"] = false);
      });
    },

    requestMenuItems(){
      this.$http
        .get(`${this.$store.state.urlapi}menu-items/${this.idMenuActual}`)
        .then((response) => {
          if (response.status == 200) {
            let aux = JSON.parse(JSON.stringify(response.data));
            aux.map((item) => {
              item.estado === 1
                ? (item["checkbox"] = true)
                : (item["checkbox"] = false);
            });
            this.$store.commit("setMenuItems", aux);
            this.getMenuItems();
          }
        })
        .catch((error) => {
          alert(`${error.message}`);
        });
    },

    changeItemState(item) {
      const item_menu = { estado: item.checkbox === true ? 1 : 0 };
      this.$http
        .put(
          `${this.$store.state.urlapi}menu-items/${item.id_item_menu}`,
          item_menu
        )
        .then((response) => {
          if (response.status == 200) {
            this.requestMenuItems();
          }
        })
        .catch((error) => {
          alert(`${error.message}`);
        });
    },

    checkMenuState() {
      if (this.estadoMenuActual !== 0) {
        this.allowDeleteButton = false;
        this.tableHeaders.splice(this.tableHeaders.length - 1, 1);
      }
    },

    setMenuCompleted(resumenData, idresumen) {
      const menu = { estado_menu: 2 };
      //cambia estado menu a completado
      this.$http
        .put(
          `${this.$store.state.urlapi}menus/${this.$store.state.idMenuActual}`,
          menu
        )
        .then((response) => {
          if (response.status == 200) {
            //guarda el resumen con su total recaudado
            const resumen = {
              total_recaudado: this.$store.state.totalFinalActual,
            };
            this.$http
              .put(
                `${this.$store.state.urlapi}resumenes/${this.$store.state.idResumenActual}`,
                resumen
              )
              .then((response) => {
                if (response.status == 200) {
                  //guardar los nuevos ids en el store
                  const menuData = {
                    fecha: resumenData.fecha_resumen,
                    idMenu: resumenData.id_menu,
                    idResumen: idresumen,
                    estadoMenu: 0,
                  };
                  this.$store.commit("setMenuData", menuData);
                  this.$store.commit("cambiarTotalFinal", 0);
                  this.$store.commit("setMenuItems", []);
                  this.getMenuItems();
                  this.checkMenuState();
                  this.$root.vtoast.show({
                    text: "Nuevo menú creado",
                    color: "success",
                  });
                }
              })
              .catch((error) => {
                alert(`${error.message}`);
              });
          }
        })
        .catch((error) => {
          alert(`${error.message}`);
        });
    },
  },

  created() {
    this.getMenuItems();
    this.checkMenuState();
    var date = new Date();
    this.today = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 10);
  },
};
</script>
