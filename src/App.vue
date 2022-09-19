<template>
  <v-app>
    <nav-bar />
    <v-main>
      <content-wrapper>
        <router-view />
      </content-wrapper>
      <snack-bar ref="vtoast"/>
    </v-main>
  </v-app>
</template>

<script>
import NavBar from "./components/layout/NavBar.vue";
import ContentWrapper from "./components/layout/ContentWrapper.vue";
import SnackBar from "./components/UI/SnackBar.vue";

export default {
  components: { NavBar, ContentWrapper, SnackBar },
  name: "App",

  data: () => ({
    //
  }),

  methods: {
    setCurrentMenuData() {
      const menuData = {};
      //id menu, adentro id resumen
      this.$http
        .get(`${this.$store.state.urlapi}menus/extra/ultimo`)
        .then((response) => {
          if (response.status == 200) {
            menuData.idMenu = response.data[0].id_menu;
            menuData.fecha = response.data[0].fecha_menu.slice(0, 10);
            menuData.estadoMenu = response.data[0].estado_menu;
          }
          this.$http
            .get(`${this.$store.state.urlapi}resumenes/extra/ultimo`)
            .then((response) => {
              if (response.status == 200) {
                menuData.idResumen = response.data[0].id_resumen;
                this.$store.commit("setMenuData", menuData);
                this.getMenuItems();
              }
            })
            .catch((error) => {
              alert(`${error.message}`);
            });
        })
        .catch((error) => {
          alert(`${error.message}`);
        });
    },

    getMenuItems() {
      this.$http
        .get(`${this.$store.state.urlapi}menu-items/${this.$store.state.idMenuActual}`)
        .then((response) => {
          if (response.status == 200) {
            let aux = JSON.parse(JSON.stringify(response.data));
            aux.map((item) => {
              item.estado === 1
                ? (item["checkbox"] = true)
                : (item["checkbox"] = false);
            });
            this.$store.commit("setMenuItems", aux);
          }
        })
        .catch((error) => {
          alert(`${error.message}`);
        });
    },
    //TODO seguir con pruebas
  },
  mounted() {
    this.setCurrentMenuData();
    this.$root.vtoast = this.$refs.vtoast;
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Chivo:wght@300&family=IBM+Plex+Sans+Arabic&family=Public+Sans&display=swap");

#app {
  /* font-family: "Chivo", sans-serif; */
  font-family: "IBM Plex Sans Arabic", sans-serif;
  /* font-family: "Public Sans", sans-serif; */
}
</style>
