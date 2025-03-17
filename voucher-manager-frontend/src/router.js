import { createRouter, createWebHistory } from 'vue-router'
import HomeView from './views/HomeView.vue'
import ShopDetailView from './views/ShopDetailView.vue'
import AddVoucherView from './views/AddVoucherView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/shops/:id',
      name: 'shop-detail',
      component: ShopDetailView
    },
    {
      path: '/shops/:shopId/add-voucher',
      name: 'add-voucher',
      component: AddVoucherView
    }
  ]
})

export default router