import {defineStore} from 'pinia';

export const useShopStore = defineStore('shopStore', {
    state: () => ({
        shops: [],
    }),
    actions: {
        setShops(shops) {
            this.shops = shops;
        },
    },
});
