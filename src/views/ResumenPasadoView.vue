<template>
  <resumen-component
    :resumenItems="resumenItems"
    :extraItems="extraItems"
    :idResumen="idresumen"
  />
</template>

<script>
import ResumenComponent from "../components/resumen/ResumenComponent.vue";
export default {
  name: "ResumenPasadoView",
  components: { ResumenComponent },
  data() {
    return {
      resumenItems: [],
      extraItems: [],
      idresumen: parseInt(this.$route.params.id_resumen),
    };
  },
  methods: {
    getResumenItems() {
      this.$http
        .get(
          `${this.$store.state.urlapi}menus/extra/data/${this.$route.params.id_menu}`
        )
        .then((response) => {
          if (response.status == 200) {
            this.resumenItems = JSON.parse(JSON.stringify(response.data));
            this.getExtraItems();
          }
        })
        .catch((error) => {
          alert(`${error.message}`);
        });
    },

    getExtraItems() {
      this.$http
        .get(
          `${this.$store.state.urlapi}extras/${this.$route.params.id_resumen}`
        )
        .then((response) => {
          if (response.status == 200) {
            this.extraItems = JSON.parse(JSON.stringify(response.data));
            this.extraItems.map((item) => {
              if (item.tipo === 1) item["tipo_display"] = "Gasto";
              else item["tipo_display"] = "Ingreso";
            });
          }
        })
        .catch((error) => {
          alert(`${error.message}`);
        });
    },
  },
  created() {
    this.getResumenItems();
  },
};
</script>
