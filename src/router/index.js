import Vue from 'vue'
import VueRouter from 'vue-router'
import SalesView from '../views/SalesView.vue'
import DailyMenuView from '../views/DailyMenuView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/ventas',
    name: 'home',
    component: SalesView
  },
  {
    path: '/menu-dia',
    name: 'menu',
    component: DailyMenuView
  },
  {
    path: '/resumen',
    name: 'resumen',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/ResumenView.vue')
  },
  {
    path: '/historial',
    name: 'historial',
    component: () => import('../views/HistorialView.vue')
  },
  {
    path: '/historial/:id_resumen/:id_menu',
    name: 'resumen-pasado',
    component: () => import('../views/ResumenPasadoView.vue')
  },
  {
    path: '/',
    name: 'login',
    component: () => import('../views/LoginView.vue')
  },
]

const router = new VueRouter({
  routes
})

export default router
