<template>
  <card-component :cardTitle="sectionTitle">
    <table-component
      class="my-3"
      :headers="resumenTableHeaders"
      :items="resumenItems"
      tableTitle="Ventas"
    />
    <table-component
      class="my-3"
      :headers="servidoresTableHeaders"
      :items="servidoresItems"
      tableTitle="Para servidores"
    />
    <table-component
      class="my-3"
      :headers="extraTableHeaders"
      :items="extraItems"
      :deleteButton="allowDeleteExtras"
      @deleteTableItem="deleteExtraItem"
      tableTitle="Extras"
    />
    <h2 class="my-6 font-weight-black blue--text text--darken-4">
      Total ventas: {{ totalVentas }}
      <v-divider class="my-2"></v-divider>
      Total ventas +/- extras: {{ totalFinal }}
      <v-divider class="my-2"></v-divider>
      Total / 2: {{ totalFinal / 2 }}
    </h2>
    <slot></slot>
    <v-btn class="mt-5" color="info" x-large @click="verpdf"
      >generar pdf</v-btn
    >
  </card-component>
</template>

<script>
import TableComponent from "../UI/TableComponent.vue";
import CardComponent from "../UI/CardComponent.vue";
//pdf
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

export default {
  name: "ResumenComponent",
  components: { TableComponent, CardComponent },
  props: {
    resumenItems: Array,
    extraItems: Array,
    servidoresItems: Array,
    idResumen: Number,
    allowDeleteExtras: Boolean,
  },
  computed: {
    totalFinal() {
      return this.totalVentas + this.totalExtras;
    },
    totalVentas() {
      let total = 0;
      this.resumenItems.map((item) => {
        total += item.subtotal;
      });
      return total;
    },
    totalExtras() {
      let tot = 0;
      this.extraItems.map((item) => {
        if (item.tipo === 1) tot -= item.monto;
        else tot += item.monto;
      });
      return tot;
    },
  },
  data() {
    return {
      resumenData: {},
      sectionTitle: "",
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
      servidoresTableHeaders: [
        {
          text: "Nombre",
          align: "start",
          sortable: false,
          value: "nombre",
        },
        { text: "Cantidad", value: "cantidad" }
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
        { text: "Eliminar", value: "actions", sortable: false },
      ],
    };
  },

  methods: {
    getResumenData() {
      this.$http
        .get(`${this.$store.state.urlapi}resumenes/${this.idResumen}`)
        .then((response) => {
          if (response.status == 200) {
            this.resumenData = { ...response.data[0] };
            this.sectionTitle = `Resumen diario: ${this.resumenData.fecha_resumen.slice(0,10)}`;
            if(this.allowDeleteExtras !== true){
              this.extraTableHeaders.splice(3,1);
            }
            this.checkTotalRecaudado();
          }
        })
        .catch((error) => {
          alert(`${error.message}`);
        });
    },
    checkTotalRecaudado() {
      if (this.resumenData.total_recaudado === 0 && this.totalFinal !== 0) {
        const resu = { total_recaudado: this.totalFinal };
        this.$http
          .put(
            `${this.$store.state.urlapi}resumenes/${this.resumenData.id_resumen}`,
            resu
          )
          .then(console.log("total actualizado"))
          .catch((error) => {
            alert(`${error.message}`);
          });
      }
    },

    deleteExtraItem(item){
      this.$emit("deleteExtra", item);
    },

    verpdf() {
      let ventasData = [
        [
          { text: "Nombre", bold: true },
          { text: "Precio", bold: true },
          { text: "Cantidad", bold: true },
          { text: "Subtotal", bold: true },
        ],
      ];
      this.resumenItems.map((item) => {
        ventasData.push(Object.values(item));
      });
      let extrasData = [
        [
          { text: "Descripción", bold: true },
          { text: "Monto", bold: true },
          { text: "Tipo", bold: true },
        ],
      ];
      this.extraItems.map((item) => {
        const it = [item.descripcion, item.monto, item.tipo_display];
        extrasData.push(Object.values(it));
      });
      let servidoresData = [
        [
          { text: "Nombre", bold: true },
          { text: "Cantidad", bold: true }
        ],
      ];
      this.servidoresItems.map((item) => {
        const it = [item.nombre, item.cantidad];
        servidoresData.push(Object.values(it));
      });

      let docDefinition = {
        content: [
          {
            text: `Resumen diario: ${this.resumenData.fecha_resumen.slice(
              0,
              10
            )}`,
            style: "header",
          },
          { text: "Ventas", style: "tableTitle" },
          {
            table: {
              headerRows: 1,
              widths: ["*", 100, 100, 100],
              body: ventasData,
            },
          },
          " ",
          { text: "Para servidores", style: "tableTitle" },
          {
            table: {
              headerRows: 1,
              widths: ["*", "*"],
              body: servidoresData,
            },
          },
          " ",
          { text: "Extras", style: "tableTitle" },
          {
            table: {
              headerRows: 1,
              widths: ["*", 100, 100],
              body: extrasData,
            },
          },
          " ",
          { text: `Total ventas: ${this.totalVentas}`, style: "resultsStyle" },
          { text: `Total extras: ${this.totalExtras}`, style: "resultsStyle" },
          " ",
          { text: `Total final: ${this.totalFinal}`, style: "resultsStyle" },
          {
            text: `Total/2: ${this.totalFinal / 2}`,
            style: ["resultsStyle", "finalResults"],
          },
        ],

        styles: {
          header: {
            fontSize: 22,
            lineHeight: 2,
            bold: true,
          },
          tableTitle: {
            italics: true,
            lineHeight: 2,
            fontSize: 18,
          },
          resultsStyle: {
            italics: true,
            fontSize: 14,
            alignment: "center",
          },
          finalResults: {
            color: "blue",
          },
        },
      };

      const pdf = pdfMake.createPdf(docDefinition);
      pdf.open();
    },
  },
  created() {
    this.getResumenData();
  }
};
</script>
