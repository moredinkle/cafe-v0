import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import Axios from 'axios'
import store from './store'

Vue.config.productionTip = false
Vue.prototype.$http = Axios

Vue.prototype.$globalLoginCheck = function () {
  if (!this.$store.state.isLoggedIn && this.$router.currentRoute.path !== '/') {
    this.$router.push("/");
  }
}


new Vue({
  router,
  vuetify,
  store,
  render: h => h(App)
}).$mount('#app')