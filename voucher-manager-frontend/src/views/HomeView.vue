<script setup>
import { ref } from 'vue';
import { useShopStore } from '../state/shopStore';
import AppHeader from '../components/layout/AppHeader.vue';
import ShopList from '../components/shop/ShopList.vue';
import ShopDetailView from './ShopDetailView.vue';

const shopStore = useShopStore();
const selectedShop = ref(null);

const showShopDetails = (shop) => {
  selectedShop.value = shop;
};

const closeShopDetails = () => {
  selectedShop.value = null;
};
</script>

<template>
  <div class="home-container">
    <AppHeader title="Shops" />
    
    <template v-if="!selectedShop">
      <ShopList 
        :shops="shopStore.shops" 
        @shopSelected="showShopDetails"
      />
    </template>
    
    <ShopDetailView
      v-else
      :shop="selectedShop"
      @close="closeShopDetails"
    />
  </div>
</template>

<style scoped>
.home-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

@media (max-width: 768px) {
  .home-container {
    padding: 1rem;
  }
}
</style>