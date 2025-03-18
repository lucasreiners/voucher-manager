import { defineStore } from 'pinia';
import { ref, Ref } from 'vue';
import { fetchVouchers, redeemVoucher as apiRedeemVoucher } from '../services/apiService';
import type { Voucher } from '../types';

export const useVoucherStore = defineStore('voucher', () => {
  const vouchers: Ref<Voucher[]> = ref([]);
  const isLoading: Ref<boolean> = ref(false);
  const error: Ref<string | null> = ref(null);
  
  function setVouchers(newVouchers: Voucher[]): void {
    vouchers.value = newVouchers;
  }
  
  async function loadVouchers(): Promise<void> {
    isLoading.value = true;
    error.value = null;
    
    try {
      const vouchersData = await fetchVouchers();
      vouchers.value = vouchersData;
    } catch (e) {
      error.value = (e as Error).message || 'Failed to load vouchers';
      console.error('Error loading vouchers:', e);
    } finally {
      isLoading.value = false;
    }
  }

  async function redeemVoucher(voucherId: string): Promise<void> {
    try {
      const updatedVoucher = await apiRedeemVoucher(voucherId);
      const index = vouchers.value.findIndex(v => v.id === voucherId);
      if (index !== -1) {
        vouchers.value[index] = updatedVoucher;
      }
    } catch (e) {
      throw new Error((e as Error).message || 'Failed to redeem voucher');
    }
  }
  
  return {
    vouchers,
    isLoading,
    error,
    setVouchers,
    loadVouchers,
    redeemVoucher
  };
});