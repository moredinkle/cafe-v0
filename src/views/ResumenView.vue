<template>
  <div>
    <card-component :cardTitle="sectionTitle">
      <table-component
        class="my-3"
        :headers="resumenTableHeaders"
        :items="resumenItems"
        tableTitle="Ventas"
      />
      <table-component
        class="my-3"
        :headers="extraTableHeaders"
        :items="extraItems"
        tableTitle="Extras"
        deleteButton
        @deleteTableItem="deleteExtraItem"
      />
      <h2 class="my-6 font-weight-black blue--text text--darken-4">
        Total ventas: {{ totalVentas }}
        <v-divider class="my-2"></v-divider>
        Total ventas +/- extras: {{ totalFinal }}
        <v-divider class="my-2"></v-divider>
        Total / 2: {{totalFinal/2}}
      </h2>
      <form-component
        formTitle="Añadir extra"
        :formElements="extraFormItems"
        @saveForm="saveExtraItem"
      >
        <v-switch v-model="esGasto"  color="warning" inset :label="switchLabel"></v-switch>
      </form-component>
    </card-component>
  </div>
</template>

<script>
import TableComponent from "../components/UI/TableComponent.vue";
import CardComponent from "../components/UI/CardComponent.vue";
import FormComponent from "../components/UI/FormComponent.vue";
export default {
  name: "ResumenView",
  components: { TableComponent, CardComponent, FormComponent },
  computed:{
    switchLabel(){
      return this.esGasto === true ? "Gasto" : "Ingreso"
    },
    totalFinal(){
      return this.totalVentas + this.totalExtras;
    }
  },
  data() {
    return {
      sectionTitle: `Resumen diario: ${this.$store.state.fechaActual}`,
      esGasto: true,
      totalVentas: 0,
      totalExtras: 0,
      resumenTableHeaders: [
        {
          text: "Nombre",
          align: "start",
          sortable: false,
          value: "nombre",
        },
        { text: "Precio", value: "precio" },
        { text: "Cantidad", value: "cantidad" },
        { text: "Subtotal", value: "subtotal" },
      ],
      extraTableHeaders: [
        {
          text: "Descripción",
          align: "start",
          sortable: false,
          value: "descripcion",
        },
        { text: "Monto", value: "monto" },
        { text: "Tipo", value: "tipo_display" },
        { text: "Eliminar", value: "actions", sortable: false }
      ],
      extraFormItems: [
        {
          count: 100,
          label: "Descripción",
          type: "text",
          rules: [
            (v) => !!v || "Campo obligatorio",
            (v) => (v && v.length <= 100) || "Máximo 100 caracteres",
          ],
        },
        {
          count: 10,
          label: "Importe",
          type: "number",
          rules: [
            (v) => !!v || "Campo obligatorio",
            (v) => (v && parseInt(v) > 0) || "Mayor a cero!",
          ],
        },
      ],
      resumenItems: [],
      extraItems: [],
    };
  },

  methods: {
    getResumenItems() {
      this.$http.get(`${this.$store.state.urlapi}menus/extra/data/${this.$store.state.idMenuActual}`)
        .then((response) => {
          if (response.status == 200) {
            this.resumenItems = JSON.parse(JSON.stringify(response.data));
            let total = 0;
            this.resumenItems.map((item) => {
              total += item.subtotal;
            });
            this.totalVentas = total;
            this.getExtraItems();
          }
        })
        .catch((error) => {
          alert(`${error.message}`);
        });
    },
    
    getExtraItems(){
      this.$http.get(`${this.$store.state.urlapi}extras/${this.$store.state.idResumenActual}`)
        .then((response) => {
          if (response.status == 200) {
            this.extraItems = JSON.parse(JSON.stringify(response.data));
            let total = 0;
            //TODO verificar esto
            this.extraItems.map((item) => {
              if(item.tipo === 1){
                item["tipo_display"] = "Gasto";
                total -= item.monto;
              }
              else {
                item["tipo_display"] = "Ingreso";
                total += item.monto;
              }
            });
            this.totalExtras = total;
            //guardar el nuevo total
            this.$store.commit("cambiarTotalFinal", this.totalVentas + this.totalExtras);
          }
        })
        .catch((error) => {
          alert(`${error.message}`);
        });
    },

    saveExtraItem(formData) {
      const importe_extra = {
        descripcion: formData[0],
        monto: +formData[1],
        tipo: this.esGasto ? 1 : 0
      };
      this.$http.post(`${this.$store.state.urlapi}extras/${this.$store.state.idResumenActual}`,importe_extra)
        .then((response) => {
          if (response.status == 200) {
            console.log(response.data);
            this.getExtraItems();
          }
        })
        .catch((error) => {
          alert(`${error.message}`);
        });
    },

    deleteExtraItem(item){
      this.$http.delete(`${this.$store.state.urlapi}extras/${item.id_importe_extra}`)
        .then((response) => {
          if (response.status == 200) {
            this.getExtraItems();
          }
        })
        .catch((error) => {
          alert(`${error.message}`);
        });
    }
  },
  created() {
    this.getResumenItems();
  }
};
</script>

//Todo al crear menu nuevo, cambiar el menu del actual
