<script setup lang="ts">
import type { Shop } from '../../types';

interface Props {
  shop: Shop;
}

defineProps<Props>();
</script>

<template>
  <div class="shop-card" :style="{ backgroundColor: shop.backgroundColor }">
    <img :src="shop.iconUrl" :alt="shop.name" class="shop-icon" crossorigin="anonymous" />
    <h3>{{ shop.name }}</h3>
  </div>
</template>

<style scoped>
.shop-card {
  border-radius: 8px;
  padding: 1rem;
  cursor: pointer;
  transition: transform 0.2s;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
}

.shop-card:hover {
  transform: translateY(-2px);
}

.shop-icon {
  width: 80px;
  height: 80px;
  object-fit: contain;
  margin-bottom: 1rem;
}

h3 {
  margin: 0;
  text-align: center;
}

@media (max-width: 768px) {
  .shop-card {
    padding: 1.5rem;
    margin: 0 0.5rem;
    width: calc(100% - 1rem);
  }

  .shop-icon {
    width: 60px;
    height: 60px;
  }

  .shop-card h2 {
    font-size: 1rem;
    text-align: center;
  }
}
</style>