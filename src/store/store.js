import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
    state: {
        // loggedin: false,
        idMenuActual: 0,
        idResumenActual: 0,
        fechaActual: '',
    },

    mutations: {
        cambiarIdMenu(state, nuevoId) {
            state.idMenuActual = nuevoId;
        },

        cambiarIdResumen(state, nuevoId) {
            state.idResumenActual = nuevoId;
        },

        cambiarFecha(state) {
            state.fechaActual = new Date().slice(0, 10);
        },

        setMenuData(state, { fecha, idMenu, idResumen }) {
            state.fechaActual = fecha;
            state.idMenuActual = idMenu;
            state.idResumenActual = idResumen;
        }
    },

})


