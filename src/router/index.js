import { createRouter, createWebHistory } from 'vue-router'
import pcStatus from '../components/pcStatus.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/chart',
      name: 'chart',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../components/hardwareChart.vue')
    },
    {
      path: '/status',
      name: 'status',
   
      component: () => import('../components/pcStatus.vue')
    },
    {
      path: '/flight',
      name: 'flight',
      component:() => import('../components/flightIndicator.vue')
    }
  ]
})

export default router
