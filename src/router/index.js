import Vue from 'vue'
import VueRouter from 'vue-router'
import SalesView from '../views/SalesView.vue'
import DailyMenuView from '../views/DailyMenuView.vue'
import ResumenComponent from '../components/resumen/ResumenComponent.vue'
// import ResumenView from '../views/ResumenView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
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
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/HistorialView.vue')
  },
  {
    path: '/resumen/:id_resumen',
    name: 'ResumenComponent',
    component: ResumenComponent,
  },
]

const router = new VueRouter({
  routes
})

export default router
