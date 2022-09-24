<template>
  <div class="ma-3">
    <v-row>
      <v-col
        cols="12"
        sm="6"
        md="4"
        v-for="item in availableItems"
        :key="item.id_item_menu"
      >
        <card-component
          :cardTitle="item.nombre"
          buttonColor="success"
          buttonText="añadir"
          :allowButton="true"
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

    <snack-bar />
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
      cantidadRules: [
        (v) => !!v || "Campo obligatorio",
        (v) =>
          (v && parseInt(v) > 0 && parseInt(v) <= 20) || "Máximo 20, minimo 1",
      ],
      availableItems: [],
    };
  },
  methods: {
    copyMenu() {
      this.availableItems = this.$store.state.menuActualItems.filter(item => item.stock_actual > 0);
      this.availableItems.map((item) => {
        item["textoPrecio"] = `Bs. ${item["precio"]}`;
        item["subtotal"] = item["precio"];
      });
    },

    addToOrder(item) {
      if (item.cantidad > 20 || item.cantidad < 1) {
        this.$root.vtoast.show({ text: "Error", color: "error" });
        return;
      }
      this.$emit("itemAddedToOrder", item);
      item.cantidad = 1;
    },
  },

  mounted() {
    this.copyMenu();
  },
};
</script>
