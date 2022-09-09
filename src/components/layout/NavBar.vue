<template>
  <div>
    <v-app-bar app color="black" dark>
      <v-app-bar-nav-icon @click.stop="drawerIsVisible = !drawerIsVisible"/>
      <v-toolbar-title>logo_cafe.jpg</v-toolbar-title>
    </v-app-bar>

    <v-navigation-drawer
      v-model="drawerIsVisible"
      app
      class="black"
      temporary
    >
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
        { icon: "mdi-coffee-maker-outline", text: "Menú del dia", route: "/menu-dia", },
        { icon: "mdi-receipt-text", text: "Pedidos", route: "/", },
        { icon: "mdi-text-box-check-outline", text: "Cuentas", route: "/cuentas" },
        { icon: "mdi-folder", text: "Historial", route: "/historial" },
      ],
    };
  },
};
</script>
