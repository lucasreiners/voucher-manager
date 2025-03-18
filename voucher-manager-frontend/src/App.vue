<script setup lang="ts">
import { computed } from 'vue';
import { onMounted } from 'vue';
import { useVoucherStore } from './state/voucherStore';
import { useShopStore } from './state/shopStore';
import { fetchShops, fetchVouchers } from './services/apiService';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();
const voucherStore = useVoucherStore();
const shopStore = useShopStore();

const isShopDetail = computed((): boolean => {
  return route.name === 'shop-detail';
});

const goToAddVoucher = (): void => {
  if (isShopDetail.value) {
    router.push(`/shops/${route.params.id}/add-voucher`);
  }
};

onMounted(async (): Promise<void> => {
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
  <v-app>
    <v-app-bar color="primary" elevation="2">
      <template v-slot:prepend>
        <v-app-bar-nav-icon 
          v-if="router.currentRoute.value.path.includes('/shops/')" 
          @click="router.back()"
        >
          <v-icon>mdi-arrow-left</v-icon>
        </v-app-bar-nav-icon>
      </template>
      
      <v-app-bar-title>Voucher Manager</v-app-bar-title>

      <template v-slot:append>
        <v-btn
          v-if="isShopDetail"
          icon
          @click="goToAddVoucher"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </template>
    </v-app-bar>

    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<style>
@import './assets/main.css';
</style>
