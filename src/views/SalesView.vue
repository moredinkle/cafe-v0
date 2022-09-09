<template>
  <div>
    <h1 class="ma-3">Menú</h1>
    <sales-menu @itemAddedToOrder="addToOrder" />
    <h1 class="mx-3 mt-5 mb-3">Pedido</h1>
    <table-component
      class="ma-3"
      :headers="orderTableHeaders"
      :items="order"
      deleteButton
      @deleteTableItem="deleteOrderItem"
    />
    <v-btn class="my-3" x-large color="success">Guardar pedido</v-btn>

    <snack-bar
      :snackIsVisible="snack"
      :timeout="1000"
      :snackColor="snackColor"
      :snackText="snackText"
    />
  </div>
</template>

<script>
import TableComponent from "../components/UI/TableComponent";
import SalesMenu from "../components/sales/SalesMenu";
import SnackBar from "../components/UI/SnackBar.vue";
import axios from "axios";

const url = "http://localhost:3000/api/";

export default {
  name: "SalesView",
  components: {
    SalesMenu,
    TableComponent,
    SnackBar,
  },
  data() {
    return {
      snack: false,
      snackColor: "",
      snackText: "",
      order: [],
      orderTableHeaders: [
        { text: "Nombre", align: "start", sortable: false, value: "nombre" },
        { text: "Precio (Bs) ", value: "precio", sortable: true },
        { text: "Cantidad", value: "cantidad", sortable: true },
        { text: "Eliminar", value: "actions", sortable: false },
      ],
    };
  },
  methods: {
    addToOrder(item) {
      console.log(`${item.nombre}   ${item.cantidad}   ${item.precio}`);
      let aux = { ...item };
      this.snackColor = "success";
      this.snackText = "Menú actualizado";
      this.snack = true;
      //TODO buscar si ya está en la orden, para solo aumentar la cantidad, tambien arreglar el borrar, añadir cuentas a la barra
      this.order.push(aux);
    },

    deleteOrderItem(item) {
      let index = this.order.indexOf(item);
      this.snackColor = "warning";
      this.snackText = "Eliminado";
      this.snack = true;
      //? aca se comunica con el backend, esto de splice verlo despues con el backend (tambien en menu diario)
      this.order = this.order.splice(index);
    },

    saveOrder() {
      //TODO esto es backend, limpiar el array order y palante
    },

    setCurrentMenuData() {
      const menuData = {};
      menuData.fecha = new Date().toISOString().slice(0, 10);
      axios.get(`${url}menus/extra/ultimo`).then((response) => {
          if (response.status == 200) {
            menuData.idMenu = response.data[0].last_id;
          }
        })
        .catch((error) => {
          alert(`${error.message}`);
        });
      axios.get(`${url}resumenes/extra/ultimo`).then((response) => {
          if (response.status == 200) {
            menuData.idResumen = response.data[0].last_id;
          }
        })
        .catch((error) => {
          alert(`${error.message}`);
        });
        console.log(menuData);
      this.$store.commit("setMenuData", menuData);
    },
  },
  mounted() {
    this.setCurrentMenuData();
  },
};
</script>
