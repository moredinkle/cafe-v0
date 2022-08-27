import Vue from 'vue'
import VueRouter from 'vue-router'
import SalesView from '../views/SalesView.vue'
import DailyMenuView from '../views/DailyMenuView.vue'

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
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
