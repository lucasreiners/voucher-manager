<script setup>
import { useVoucherStore } from "./state/voucherStore";
import { useShopStore } from "./state/shopStore";
import { onMounted, ref } from "vue";
import ShopDetailView from "./components/ShopDetailView.vue";

const voucherStore = useVoucherStore();
const shopStore = useShopStore();
const selectedShop = ref(null);

const showShopDetails = (shop) => {
	selectedShop.value = shop;
};

const closeShopDetails = () => {
	selectedShop.value = null;
};

onMounted(async () => {
	try {
		const response = await fetch("/api/vouchers");
		if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`);
		}
		const data = await response.json();
		voucherStore.setVouchers(data);
	} catch (error) {
		console.error("Failed to fetch vouchers:", error);
	}

	try {
		const response = await fetch("/api/shops");
		if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`);
		}
		const data = await response.json();
		shopStore.setShops(data);
	} catch (error) {
		console.error("Failed to fetch shops:", error);
	}
});
</script>

<template>
  <main>
    <h1>Shops</h1>

    <!-- Shop List -->
    <div class="shop-list" v-if="!selectedShop">
      <div
          v-for="shop in shopStore.shops"
          :key="shop.id"
          class="shop-card"
          :style="{ backgroundColor: shop.backgroundColor }"
          @click="showShopDetails(shop)"
      >
        <img :src="shop.iconUrl" alt="Shop icon" class="shop-icon" crossorigin="anonymous"/>
        <h2>{{ shop.name }}</h2>
      </div>
    </div>

    <!-- Shop Detail Component -->
    <ShopDetailView
        v-if="selectedShop"
        :shop="selectedShop"
        @close="closeShopDetails"
    />
  </main>
</template>

<style scoped>
main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.shop-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

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
  main {
    padding: 1rem;
  }

  .shop-list {
    grid-template-columns: 1fr;
    gap: 1rem;
    margin: 1rem 0.5rem;
  }

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

@media (max-width: 480px) {
  h1 {
    font-size: 1.5rem;
    text-align: center;
  }
}
</style>
