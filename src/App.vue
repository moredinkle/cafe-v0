<template>
  <v-app>
    <nav-bar />
    <v-main>
      <content-wrapper>
        <router-view />
      </content-wrapper>
    </v-main>
  </v-app>
</template>

<script>
import NavBar from "./components/layout/NavBar.vue";
import ContentWrapper from "./components/layout/ContentWrapper.vue";

export default {
  components: { NavBar, ContentWrapper },
  name: "App",

  data: () => ({
    //
  }),
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Chivo:wght@300&family=IBM+Plex+Sans+Arabic&family=Public+Sans&display=swap");

#app {
  /* font-family: "Chivo", sans-serif; */
  /* font-family: "IBM Plex Sans Arabic", sans-serif; */
  font-family: "Public Sans", sans-serif;
}
</style>
