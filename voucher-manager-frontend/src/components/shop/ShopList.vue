<script setup>
import ShopCard from './ShopCard.vue';

defineProps({
  shops: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['shopSelected']);

const selectShop = (shop) => {
  emit('shopSelected', shop);
};
</script>

<template>
  <div class="shop-list">
    <div 
      v-for="shop in shops" 
      :key="shop.id"
      @click="selectShop(shop)"
    >
      <ShopCard :shop="shop" />
    </div>
  </div>
</template>

<style scoped>
.shop-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
}

@media (max-width: 768px) {
  .shop-list {
    grid-template-columns: 1fr;
    gap: 1rem;
    margin: 1rem 0.5rem;
  }
}
</style>