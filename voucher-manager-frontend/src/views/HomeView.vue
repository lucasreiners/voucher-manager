<script setup>
import { useRouter } from 'vue-router';
import { useShopStore } from '../state/shopStore';
import AppHeader from '../components/layout/AppHeader.vue';
import ShopList from '../components/shop/ShopList.vue';

const router = useRouter();
const shopStore = useShopStore();

const showShopDetails = (shop) => {
  router.push(`/shops/${shop.id}`);
};
</script>

<template>
  <v-container fluid class="home-container pa-4">
    <AppHeader title="Shops" />
    <ShopList 
      :shops="shopStore.shops" 
      @shopSelected="showShopDetails"
    />
  </v-container>
</template>

<style scoped>
.home-container {
  width: 100%;
}

@media (max-width: 768px) {
  .home-container {
    padding: 8px !important;
  }
}
</style>