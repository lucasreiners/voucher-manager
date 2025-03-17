import { defineStore } from 'pinia';
import { ref } from 'vue';
import { redeemVoucher as apiRedeemVoucher, createVoucher as apiCreateVoucher } from '../services/apiService';

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

  async function createVoucher(voucherData) {
    try {
      const newVoucher = await apiCreateVoucher(voucherData);
      vouchers.value = [...vouchers.value, newVoucher];
      return newVoucher;
    } catch (error) {
      console.error('Error creating voucher:', error);
      throw error;
    }
  }
  
  return {
    vouchers,
    setVouchers,
    redeemVoucher,
    createVoucher
  };
});
