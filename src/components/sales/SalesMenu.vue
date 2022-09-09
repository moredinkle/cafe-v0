<template>
  <div class="ma-3">
    <v-row>
      <v-col
        cols="12"
        sm="6"
        md="4"
        v-for="item in availableItems"
        :key="item.id"
      >
        <card-component
          :cardTitle="item.nombre"
          buttonColor="success"
          buttonText="añadir"
          @confirmCardAction="addToOrder(item)"
        >
          <h2 class="mb-3">{{ item.textoPrecio }}</h2>
          <v-form ref="form" v-model="valid">
            <v-text-field
              v-model="item.cantidad"
              name="cantidad"
              label="Cantidad"
              type="number"
              :rules="cantidadRules"
              outlined
              filled
              single-line
            ></v-text-field>
          </v-form>
        </card-component>
      </v-col>
    </v-row>

    <!-- snack para error al añadir o exito también puede ser -->
    <snack-bar :snackIsVisible="snack" :timeout="2000" :snackColor="snackColor" :snackText="snackText"/>
  </div>
</template>

<script>
import CardComponent from "../UI/CardComponent.vue";
import SnackBar from "../UI/SnackBar.vue";

export default {
  name: "SalesMenu",
  components: {
    CardComponent,
    SnackBar,
  },
  props: {},
  data() {
    return {
      valid: true,
      snack: false,
      snackColor: "",
      snackText: "",
      cantidadRules: [
        (v) => !!v || "Campo obligatorio",
        (v) =>
          (v && parseInt(v) > 0 && parseInt(v) <= 10) || "Máximo 10, minimo 1",
      ],
      menuItems: [
        {
          id: "mi1",
          nombre: "cosa 1",
          precio: 5,
          cantidad: 1,
          textoPrecio: "",
        },
        {
          id: "mi2",
          nombre: "cosa 2",
          precio: 3,
          cantidad: 1,
          textoPrecio: "",
        },
        {
          id: "mi3",
          nombre: "cafe",
          precio: 5,
          cantidad: 1,
          textoPrecio: "",
        },
        {
          id: "mi4",
          nombre: "queque",
          precio: 8,
          cantidad: 1,
          textoPrecio: "",
        },
      ],
      availableItems: [],
      order: [],
    };
  },
  methods: {
    copyMenu() {
      //? enviar con cantidad y textoPrecio desde el backend (?) añadirlo ahi y enviarlo con esto (?)
      this.availableItems = this.menuItems.slice();
      this.availableItems.map((item) => {
        item["textoPrecio"] = `Bs. ${item["precio"]}`;
      });
    },

    addToOrder(item) {
      if (item.cantidad > 10 || item.cantidad < 1) {
        this.snackColor = "error";
        this.snackText = "Intenta otra vez";
        this.snack = true;
        return;
      }
      this.$emit("itemAddedToOrder", item);
      item.cantidad = 1;
    },
  },

  created() {
    this.copyMenu();
  },
};
</script>
