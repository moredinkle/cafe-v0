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
    <v-text-field
      class="mx-2"
      v-model="pagadoCon"
      name="pagadocon"
      label="Pagado con"
      type="number"
      :rules="pagadoConRules"
      outlined
      filled
      @input="calcularCambio"
    ></v-text-field>
    <h3>
      Total a pagar: {{ precioFinal }} <br />
      Cambio: {{ cambio }}
    </h3>
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

  methods: {
    addToOrder(item) {
      let repetido = false;
      let aux = { ...item };
      //buscar si el nuevo item ya esta en la orden, si esta calcular la cantidad y el subtotal
      this.order.map((element) => {
        if (element.id_item_menu === item.id_item_menu) {
          element.cantidad =
            parseInt(element.cantidad) + parseInt(item.cantidad);
          element.subtotal =
            parseInt(element.precio) * parseInt(element.cantidad);
          repetido = true;
        }
      });
      if (!repetido) {
        aux.subtotal = parseInt(aux.precio) * parseInt(aux.cantidad);
        this.order.push(aux);
      }
      this.calcularPrecioFinal();
      this.$root.vtoast.show({ text: "Añadido al pedido", color: "success" });
    },

    deleteOrderItem(item) {
      this.order = this.order.filter(
        (i) => i.id_item_menu !== item.id_item_menu
      );
      //? aca se comunica con el backend, esto de splice verlo despues con el backend (tambien en menu diario)
      this.calcularPrecioFinal();
      this.$root.vtoast.show({ text: "Eliminado", color: "warning" });
    },

    calcularPrecioFinal() {
      let preciofin = 0;
      this.order.map((element) => (preciofin += parseInt(element.subtotal)));
      this.precioFinal = preciofin;
      this.calcularCambio();
    },

    calcularCambio() {
      this.cambio = this.pagadoCon - this.precioFinal;
      if (this.cambio < 0) this.guardarPedidoValid = false;
      else this.guardarPedidoValid = true;
    },

    saveOrder() {
      //TODO esto es backend, limpiar el array order y palante, cambio y con cuanto se paga
      const pedido = {
        precio_total: this.precioFinal,
        pagado_con: +this.pagadoCon,
        cambio: this.cambio,
        id_resumen: this.idResumenActual,
      };
      let promesas = [];
      // primero crear el pedido
      this.$http.post(`${this.$store.state.urlapi}pedidos`, pedido)
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
                this.$http.post(`${this.$store.state.urlapi}pedido-items`, item_pedido)
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

            Promise.all(promesas).then((res) => {
              console.log(res);
              this.order = [];
              this.cambio = 0;
              this.pagadoCon = +0;
              this.guardarPedidoValid = true;
              //si el menú es nuevo, lo bloquea
              if (this.estadoMenuActual === 0) {
                const menu = {estado_menu: 1};
                this.$http.put(`${this.$store.state.urlapi}menus/${this.$store.state.idMenuActual}`, menu)
                  .then((response) => {
                    if (response.status == 200) {
                      this.$store.commit("cambiarEstadoMenu", 1);
                    }
                  })
                  .catch((error) => {
                    alert(`${error.message}`);
                  });
              }
              this.$root.vtoast.show({
                text: "Pedido guardado!",
                color: "success",
              });
            });
          }
        })
        .catch((error) => {
          alert(`${error.message}`);
        });
    },
  },
};
</script>
