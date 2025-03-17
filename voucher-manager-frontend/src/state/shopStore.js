import { defineStore } from 'pinia';
import { ref } from 'vue';
import { fetchShops } from '../services/apiService';

export const useShopStore = defineStore('shop', () => {
  const shops = ref([]);
  const isLoading = ref(false);
  const error = ref(null);
  
  function setShops(newShops) {
    shops.value = newShops;
  }
  
  async function loadShops() {
    isLoading.value = true;
    error.value = null;
    
    try {
      const shopsData = await fetchShops();
      shops.value = shopsData;
    } catch (e) {
      error.value = e.message || 'Failed to load shops';
      console.error('Error loading shops:', e);
    } finally {
      isLoading.value = false;
    }
  }
  
  return {
    shops,
    isLoading,
    error,
    setShops,
    loadShops
  };
});
