<script setup>
import { onMounted } from 'vue';
import { useVoucherStore } from './state/voucherStore';
import { useShopStore } from './state/shopStore';
import { fetchShops, fetchVouchers } from './services/apiService';
import HomeView from './views/HomeView.vue';
import AppHeader from './components/layout/AppHeader.vue'

const voucherStore = useVoucherStore();
const shopStore = useShopStore();

onMounted(async () => {
  try {
    const vouchersData = await fetchVouchers();
    voucherStore.setVouchers(vouchersData);
    
    const shopsData = await fetchShops();
    shopStore.setShops(shopsData);
  } catch (error) {
    console.error('Error loading application data:', error);
  }
});
</script>

<template>
  <div id="app">
    <AppHeader />
    <main>
      <router-view></router-view>
    </main>
  </div>
</template>

<style>
@import './assets/main.css';

main {
  width: 100%;
  min-height: 100vh;
}

#app {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  font-weight: normal;
}
</style>
