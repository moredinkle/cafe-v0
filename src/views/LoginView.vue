<template>
  <v-row>
    <v-col md="3"></v-col>
    <v-col cols="12" sm="9" md="6">
      <form-component
        :formElements="loginFormItems"
        @saveForm="login"
        sendFormText="Ingresar"
        titleClass="justify-center"
      >
        <v-img
          max-height="auto"
          max-width="350"
          :src="require('../../public/vue.png')"
        ></v-img>
      </form-component>
    </v-col>
    <v-col md="3"></v-col>
  </v-row>
</template>

<script>
import FormComponent from "../components/UI/FormComponent.vue";
export default {
  name: "LoginView",
  components: { FormComponent },
  data() {
    return {
      loginFormItems: [
        {
          count: 50,
          label: "Usuario",
          type: "text",
          rules: [
            (v) => !!v || "Campo obligatorio",
            (v) => (v && v.length <= 50) || "Máximo 50 caracteres",
          ],
        },
        {
          count: 50,
          label: "Contraseña",
          type: "password",
          rules: [
            (v) => !!v || "Campo obligatorio",
            (v) => (v && v.length <= 50) || "Máximo 50 caracteres",
          ],
        },
      ],
    };
  },
  methods: {
    login(formData) {
      const user = { username: formData[0], password: formData[1] };
      this.$http
        .post(`${this.$store.state.urlapi}auth/login`, user)
        .then((response) => {
          if (response.status == 200) {
            this.setCurrentMenuData();
            this.$store.commit("setUserInfo", {username: user.username, nivel: response.data[0].nivel})
            this.$router.push("/ventas");
          }
        })
        .catch(() => {
          alert(`Usuario o contraseña incorrectos`);
        });
    },

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
      this.$http.get(`${this.$store.state.urlapi}menu-items/${this.$store.state.idMenuActual}`)
        .then((response) => {
          if (response.status == 200) {
            let aux = JSON.parse(JSON.stringify(response.data));
            aux.map((item) => {
              item.estado === 1
                ? (item["checkbox"] = true)
                : (item["checkbox"] = false);
              item["vendidos"] = Number(0);
            });
            this.$store.commit("setMenuItems", aux);
          }
        })
        .catch((error) => {
          alert(`${error.message}`);
        });
    },
  },
};
//TODO continuar con jwt y todo listo
</script>
