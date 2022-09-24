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

    <h2 class="mb-2">Pagado con:</h2>
    <div class="centrar">
      <v-text-field
        class="mx-2 pagadocon"
        v-model="pagadoCon"
        name="pagadocon"
        label="Pagado con"
        type="number"
        :rules="pagadoConRules"
        outlined
        filled
        @input="calcularCambio"
      ></v-text-field>
    </div>
    <h3>
      Total a pagar: {{ precioFinal }} <br />
      Cambio: {{ cambio }}
    </h3>
    <div class="centrar">
      <v-switch
        v-model="esVenta"
        color="success"
        inset
        :label="switchLabel"
      ></v-switch>
    </div>
    <v-btn
      :disabled="!guardarPedidoValid"
      class="my-3"
      x-large
      color="success"
      @click="saveOrder"
      >Guardar pedido</v-btn
    >

    <snack-bar />
  </div>
</template>

<script>
import TableComponent from "../components/UI/TableComponent";
import SalesMenu from "../components/sales/SalesMenu";
import SnackBar from "../components/UI/SnackBar.vue";

export default {
  name: "SalesView",
  components: {
    SalesMenu,
    TableComponent,
    SnackBar,
  },

  computed: {
    switchLabel() {
      return this.esVenta === true ? "Venta" : "Servidor";
    },

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
      order: [],
      esVenta: true,
      precioFinal: 0,
      pagadoCon: 0,
      cambio: 0,
      guardarPedidoValid: true,
      pagadoConRules: [
        (v) => !!v || "Campo obligatorio",
        (v) => (v && parseInt(v) > 0) || "Error",
      ],
      orderTableHeaders: [
        { text: "Nombre", align: "start", sortable: false, value: "nombre" },
        { text: "Precio (Bs) ", value: "precio", sortable: true },
        { text: "Cantidad", value: "cantidad", sortable: true },
        { text: "Subtotal", value: "subtotal", sortable: true },
        { text: "Eliminar", value: "actions", sortable: false },
      ],
    };
  },
  //TODO aumentar tipo a venta y switch
  methods: {
    addToOrder(item) {
      let aux = { ...item };
      //buscar si el nuevo item ya esta en la orden
      let ind = this.order.findIndex(
        (i) => i.id_item_menu === item.id_item_menu
      );
      let x = 0;
      //si está en la orden ?
      if (ind >= 0) x = Number(this.order[ind].cantidad) + Number(aux.cantidad);
      else x = Number(aux.cantidad);

      //vendidos > stock
      if (x + Number(item.vendidos) > Number(item.stock_actual)) {
        this.$root.vtoast.show({
          text: "No alcanza jefe",
          color: "error",
          timer: 3000,
        });
        return;
      }
      //si pasa, recien lo guarda en order
      if (ind >= 0) {
        this.order[ind].cantidad = x;
        this.order[ind].subtotal =
          Number(this.order[ind].precio) * Number(this.order[ind].cantidad);
      } else {
        aux.subtotal = Number(aux.precio) * Number(aux.cantidad);
        this.order.push(aux);
      }

      this.calcularPrecioFinal();
      this.$root.vtoast.show({ text: "Añadido al pedido", color: "info" });
    },

    deleteOrderItem(item) {
      this.order = this.order.filter(
        (i) => i.id_item_menu !== item.id_item_menu
      );
      this.calcularPrecioFinal();
      this.$root.vtoast.show({ text: "Eliminado", color: "warning" });
    },

    calcularPrecioFinal() {
      let preciofin = 0;
      this.order.map((element) => (preciofin += Number(element.subtotal)));
      this.precioFinal = preciofin;
      this.calcularCambio();
    },

    calcularCambio() {
      this.cambio = this.pagadoCon - this.precioFinal;
      if (this.cambio < 0) this.guardarPedidoValid = false;
      else this.guardarPedidoValid = true;
    },

    saveOrder() {
      const pedido = {
        precio_total: this.precioFinal,
        pagado_con: +this.pagadoCon,
        cambio: this.cambio,
        tipo_pedido: this.esVenta === true ? 1 : 0,
        id_resumen: this.idResumenActual,
      };
      let promesas = [];
      // primero crear el pedido
      this.$http
        .post(`${this.$store.state.urlapi}pedidos`, pedido)
        .then((response) => {
          if (response.status == 200) {
            //ahora guardar cada item del pedido
            this.order.map((item) => {
              const item_pedido = {
                id_item_menu: item.id_item_menu,
                id_pedido: response.data.insertId,
                cantidad: item.cantidad,
                subtotal: item.subtotal,
              };
              promesas.push(
                this.$http
                  .post(`${this.$store.state.urlapi}pedido-items`, item_pedido)
                  .then((response) => {
                    if (response.status == 200) {
                      response.data;
                    }
                  })
                  .catch((error) => {
                    alert(`${error.message}`);
                  })
              );
            });

            Promise.all(promesas).then(() => {
              this.requestMenuItems();
              this.order = [];
              this.cambio = 0;
              this.pagadoCon = +0;
              this.precioFinal = 0;
              this.guardarPedidoValid = true;
              this.esVenta = true;
              //si el menú es nuevo, lo bloquea
              if (this.estadoMenuActual === 0) this.setCurrentMenu();
              this.$root.vtoast.show({
                text: "Pedido guardado!",
                color: "info",
              });
            });
          }
        })
        .catch((error) => {
          alert(`${error.message}`);
        });
    },

    setCurrentMenu() {
      const menu = { estado_menu: 1 };
      this.$http
        .put(
          `${this.$store.state.urlapi}menus/${this.$store.state.idMenuActual}`,
          menu
        )
        .then((response) => {
          if (response.status == 200) {
            this.$store.commit("cambiarEstadoMenu", 1);
          }
        })
        .catch((error) => {
          alert(`${error.message}`);
        });
    },

    requestMenuItems() {
      this.$http
        .get(`${this.$store.state.urlapi}menu-items/${this.idMenuActual}`)
        .then((response) => {
          if (response.status == 200) {
            let aux = JSON.parse(JSON.stringify(response.data));
            aux.map((item) => {
              item.estado === 1
                ? (item["checkbox"] = true)
                : (item["checkbox"] = false);
              item["vendidos"] = 0;
            });
            this.$store.commit("setMenuItems", aux);
          }
        })
        .catch((error) => {
          alert(`${error.message}`);
        });
    },
  },

  created() {
    this.$globalLoginCheck();
  },
};
</script>

<style scoped>
.centrar {
  display: flex;
  justify-content: center;
}
.pagadocon {
  max-width: 600px;
}
</style>
