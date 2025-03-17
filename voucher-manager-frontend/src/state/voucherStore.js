import {defineStore} from 'pinia';

export const useVoucherStore = defineStore('voucherStore', {
    state: () => ({
        vouchers: [],
    }),
    actions: {
        setVouchers(vouchers) {
            this.vouchers = vouchers;
        },
        
        async redeemVoucher(voucherId) {
            try {
                const response = await fetch(`/api/vouchers/${voucherId}/redeem`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                
                if (!response.ok) {
                    throw new Error(`Failed to redeem voucher: ${response.status}`);
                }
                
                const redeemedVoucher = await response.json();
                
                // Update the voucher in the store
                this.vouchers = this.vouchers.map(voucher => 
                    voucher.id === voucherId ? redeemedVoucher : voucher
                );
                
                return redeemedVoucher;
            } catch (error) {
                console.error('Error redeeming voucher:', error);
                throw error;
            }
        }
    },
});
