<script setup lang="ts">
import { useRouter } from 'vue-router';
import ShopList from '../components/shop/ShopList.vue';
import { useShopStore } from '../state/shopStore';

const router = useRouter();
const shopStore = useShopStore();

const showShopDetails = (shop: { id: string }) => {
    router.push(`/shops/${shop.id}`);
};
</script>

<template>
  <main>
    <ShopList 
      :shops="shopStore.shops" 
      @shopSelected="showShopDetails"
    />
  </main>
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