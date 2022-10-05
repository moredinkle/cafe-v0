<template>
  <div class="ma-3">
    <!-- tablet para arriba -->
    <v-row v-if="tamano > 450">
      <v-col
        cols="12"
        sm="4"
        lg="3"
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
<!-- telefono -->
    <v-row v-else class="centrar">
      <v-col cols="12" v-for="item in availableItems" :key="item.id_item_menu">
        <v-divider></v-divider>
        <span class="mt-2 font-weight-bold text-h5 indigo--text text--darken-4">
          {{ item.nombre }} |
          {{ item.textoPrecio }}
        </span>
        <div class="d-flex centrar mt-2">
          <v-form ref="form" v-model="valid">
            <v-text-field
              dense
              class="formcantidad"
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
          <v-btn large class="mx-2" color="success" @click="addToOrder(item)"
            >Añadir</v-btn
          >
        </div>
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
  computed: {
    tamano() {
      return this.$vuetify.breakpoint.width;
    },
  },
  data() {
    return {
      valid: true,
      cantidadRules: [
        (v) => !!v || "Campo obligatorio",
      ],
      availableItems: [],
    };
  },
  methods: {
    copyMenu() {
      this.availableItems = this.$store.state.menuActualItems.filter(
        (item) => item.stock_actual > 0
      );
      this.availableItems.map((item) => {
        item["textoPrecio"] = `Bs. ${item["precio"]}`;
        item["subtotal"] = item["precio"];
      });
    },

    addToOrder(item) {
      if (item.cantidad < 1) {
        this.$root.vtoast.show({ text: "Error", color: "error" });
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

<style scoped>
.centrar {
  display: flex;
  justify-content: center;
}
.formcantidad {
  max-width: 140px;
}

</style>
