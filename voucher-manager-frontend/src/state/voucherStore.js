import { defineStore } from 'pinia';
import { ref } from 'vue';
import { redeemVoucher as apiRedeemVoucher } from '../services/apiService';

export const useVoucherStore = defineStore('voucher', () => {
  const vouchers = ref([]);
  
  function setVouchers(newVouchers) {
    vouchers.value = newVouchers;
  }
  
  async function redeemVoucher(voucherId) {
    try {
      const updatedVoucher = await apiRedeemVoucher(voucherId);
      
      // Update the voucher in the store
      const index = vouchers.value.findIndex(v => v.id === voucherId);
      if (index !== -1) {
        vouchers.value[index] = updatedVoucher;
      }
      
      return updatedVoucher;
    } catch (error) {
      console.error('Error redeeming voucher:', error);
      throw error;
    }
  }
  
  return {
    vouchers,
    setVouchers,
    redeemVoucher
  };
});
