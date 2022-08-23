<template>
  <div>
    <v-navigation-drawer v-model="drawer" app class="green darken-4" temporary>
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
  name: "NavDrawer",

  data() {
    return {
      links: [
        {
          icon: "mdi-home-circle-outline",
          text: "Pagina Principal",
          route: "/",
        },
        {
          icon: "mdi-card-multiple-outline",
          text: "Categorias",
          route: "/categorias",
        },
        { icon: "mdi-folder", text: "Mis proyectos", route: "/mis-proyectos" },
        { icon: "mdi-cog-outline", text: "Opciones", route: "/opciones" },
      ],
    };
  },

  
};
</script>
