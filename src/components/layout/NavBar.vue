<template>
  <div>
    <v-app-bar app color="black" dark>
      <v-app-bar-nav-icon @click.stop="checkLogin" />
      <v-toolbar-title>logo_cafe.png</v-toolbar-title>
      <v-spacer></v-spacer>
      <span v-if="loggedIn">
        <v-btn dark text color="white" @click="logout"
          ><span v-if="tamano > 450">cerrar sesión</span> <v-icon right>mdi-logout-variant</v-icon>
        </v-btn>
      </span>
    </v-app-bar>

    <v-navigation-drawer v-model="drawerIsVisible" app class="black" temporary>
      <v-list>
        <v-list-item
          v-for="link in links"
          :key="link.text"
          router
          :to="link.route"
        >
          <v-list-item-action>
            <v-icon class="white--text">{{ link.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title class="white--text">{{
              link.text
            }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
export default {
  name: "NavBar",

  data() {
    return {
      drawerIsVisible: false,
      links: [
        {
          icon: "mdi-coffee-maker-outline",
          text: "Menú del dia",
          route: "/menu-dia",
        },
        { icon: "mdi-receipt-text", text: "Pedidos", route: "/ventas" },
        {
          icon: "mdi-text-box-check-outline",
          text: "Resumen",
          route: "/resumen",
        },
        { icon: "mdi-folder", text: "Historial", route: "/historial" },
      ],
    };
  },
  computed: {
    loggedIn() {
      return this.$store.state.isLoggedIn;
    },
    tamano(){
      return this.$vuetify.breakpoint.width;
    }
  },
  methods: {
    checkLogin() {
      if (this.loggedIn) this.drawerIsVisible = !this.drawerIsVisible;
    },

    logout() {
      this.$store.commit("logout");
      this.$store.commit("setMenuData", {
        fecha: "",
        idMenu: 0,
        idResumen: 0,
        estadoMenu: 0,
      });
      this.$store.commit("setMenuItems", []);
      this.$router.push("/");
    },
  },
};
</script>
