import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

export default new Vuex.Store({
  plugins: [
    createPersistedState({
      storage: window.sessionStorage,
    }),
  ],

  state: {
    // loggedin: false,
    idMenuActual: 0,
    idResumenActual: 0,
    estadoMenuActual: 0,
    menuActualItems: [],
    totalFinalActual: 0,
    fechaActual: "",
    urlapi: "http://localhost:3000/api/",
  },

  mutations: {
    cambiarIdMenu(state, nuevoId) {
      state.idMenuActual = nuevoId;
    },

    cambiarIdResumen(state, nuevoId) {
      state.idResumenActual = nuevoId;
    },

    cambiarEstadoMenu(state, estadoMenu) {
      state.estadoMenuActual = +estadoMenu;
    },

    cambiarTotalFinal(state, payload) {
      state.totalFinalActual = +payload;
    },

    setMenuItems(state, payload) {
      state.menuActualItems = [...payload];
    },

    setMenuData(state, { fecha, idMenu, idResumen, estadoMenu }) {
      state.fechaActual = fecha;
      state.idMenuActual = +idMenu;
      state.idResumenActual = +idResumen;
      state.estadoMenuActual = +estadoMenu;
    },
  },
});
