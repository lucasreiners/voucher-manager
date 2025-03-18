import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import HomeView from './views/HomeView.vue'
import ShopDetailView from './views/ShopDetailView.vue'
import AddVoucherView from './views/AddVoucherView.vue'

const routes: RouteRecordRaw[] = [
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
    path: '/shops/:id/add-voucher',
    name: 'add-voucher',
    component: AddVoucherView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router