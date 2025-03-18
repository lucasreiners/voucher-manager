<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useShopStore } from '../../state/shopStore';
import type { Shop } from '../../types';
import ShopCard from './ShopCard.vue';

const router = useRouter();
const shopStore = useShopStore();

onMounted(async (): Promise<void> => {
  await shopStore.loadShops();
});

const handleShopClick = (shop: Shop): void => {
  router.push(`/shops/${shop.id}`);
};
</script>

<template>
  <div class="shop-list">
    <div v-if="shopStore.isLoading" class="loading">Loading shops...</div>
    <div v-else-if="shopStore.error" class="error">{{ shopStore.error }}</div>
    <div v-else class="shops-grid">
      <ShopCard
        v-for="shop in shopStore.shops"
        :key="shop.id"
        :shop="shop"
        @click="handleShopClick(shop)"
      />
    </div>
  </div>
</template>

<style scoped>
.shop-list {
  padding: 1rem;
}

.shops-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}

.loading, .error {
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
}

.error {
  color: #d32f2f;
}
</style>