import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Home from '../pages/home.vue'
import Result from '../pages/result.vue'
import PayResult from '../pages/pay-result.vue'
import Pay from '../pages/pay.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/result',
    name: 'Result',
    component: Result
  },
  {
    path: '/pay',
    name: 'Pay',
    component: Pay
  },
  {
    path: '/pay-result',
    name: 'PayResult',
    component: PayResult
  }
]

const router = createRouter({
  history: createWebHashHistory('/static/pay/'),
  routes
})

export default router
