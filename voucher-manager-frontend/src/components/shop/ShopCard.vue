<script setup>
defineProps({
  shop: {
    type: Object,
    required: true
  }
});
</script>

<template>
  <div 
    class="shop-card"
    :style="{ backgroundColor: shop.backgroundColor }"
  >
    <img :src="shop.iconUrl" alt="Shop icon" class="shop-icon" crossorigin="anonymous"/>
    <h2>{{ shop.name }}</h2>
  </div>
</template>

<style scoped>
.shop-card {
  border-radius: 8px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: transform 0.2s;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  color: white;
}

.shop-card:hover {
  transform: translateY(-5px);
}

.shop-icon {
  width: 80px;
  height: 80px;
  object-fit: contain;
  margin-bottom: 1rem;
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