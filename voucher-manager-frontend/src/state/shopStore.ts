import { defineStore } from 'pinia';
import { ref, Ref } from 'vue';
import { fetchShops } from '../services/apiService';
import type { Shop } from '../types';

export const useShopStore = defineStore('shop', () => {
  const shops: Ref<Shop[]> = ref([]);
  const isLoading: Ref<boolean> = ref(false);
  const error: Ref<string | null> = ref(null);
  
  function setShops(newShops: Shop[]): void {
    shops.value = newShops;
  }
  
  async function loadShops(): Promise<void> {
    isLoading.value = true;
    error.value = null;
    
    try {
      const shopsData = await fetchShops();
      shops.value = shopsData;
    } catch (e) {
      error.value = (e as Error).message || 'Failed to load shops';
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