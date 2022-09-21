<template>
  <v-row>
    <v-col
      cols="12"
      sm="6"
      md="4"
      v-for="item in resumenes"
      :key="item.id_resumen"
    >
      <card-component
        cardTitle="Resumen"
        buttonColor="info"
        buttonText="visitar"
        :allowButton="true"
        :toRoute="'historial/' + item.id_resumen+ '/' + item.id_menu"
      >
        <v-divider></v-divider>
        <h2 class="my-3">{{ item.fecha_resumen.slice(0, 10) }}</h2>
        <h2 class="mb-3">{{ diaMenu(item.fecha_resumen) }}</h2>
        <v-divider></v-divider>
      </card-component>
    </v-col>
  </v-row>
</template>

<script>
import CardComponent from "../components/UI/CardComponent.vue";

export default {
  name: "HistorialView",
  components: { CardComponent },
  data() {
    return {
      resumenes: [],
      dias: [
        "Domingo",
        "Lunes",
        "Martes",
        "Miercoles",
        "Jueves",
        "Viernes",
        "Sabado",
      ],
    };
  },
  methods: {
    getResumenes() {
      this.$http
        .get(`${this.$store.state.urlapi}resumenes/`)
        .then((response) => {
          if (response.status == 200) {
            this.resumenes = JSON.parse(JSON.stringify(response.data));
          }
        })
        .catch((error) => {
          alert(`${error.message}`);
        });
    },
    diaMenu(fechaIso) {
      let date = new Date(fechaIso);
      return this.dias[date.getDay()];
    },
  },
  created() {
    this.$globalLoginCheck();
    this.getResumenes();
  },
};
</script>
