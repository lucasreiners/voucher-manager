<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute } from 'vue-router';
import { useVoucherStore } from "../state/voucherStore";
import { useShopStore } from "../state/shopStore";
import VoucherCard from '../components/voucher/VoucherCard.vue';
import ConfirmDialog from '../components/layout/ConfirmDialog.vue';

const route = useRoute();
const voucherStore = useVoucherStore();
const shopStore = useShopStore();

const isRedeeming = ref(false);
const redeemError = ref(null);
const showConfirmDialog = ref(false);

const shop = computed(() => {
  return shopStore.shops.find(s => s.id === route.params.id);
});

const firstUnredeemedVoucher = computed(() => {
  if (!shop.value) return null;
  return voucherStore.vouchers
    .filter((v) => v.shopId === shop.value.id && !v.redeemedAt)
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))[0] 
    || voucherStore.vouchers.find((v) => v.shopId === shop.value.id);
});

const redeemVoucher = async () => {
  if (!firstUnredeemedVoucher.value || firstUnredeemedVoucher.value.redeemedAt) {
    return;
  }
  try {
    isRedeeming.value = true;
    redeemError.value = null;
    await voucherStore.redeemVoucher(firstUnredeemedVoucher.value.id);
    showConfirmDialog.value = false;
  } catch (error) {
    redeemError.value = "Gutschein konnte nicht als verbraucht markiert werden. Bitte versuchen Sie es erneut.";
    console.error("Redemption error:", error);
  } finally {
    isRedeeming.value = false;
  }
};

const openConfirmDialog = () => {
  showConfirmDialog.value = true;
};

const closeConfirmDialog = () => {
  showConfirmDialog.value = false;
};

const handleRedeem = () => {
  openConfirmDialog();
};
</script>

<template>
  <v-container fluid class="pa-4">
    <div v-if="!shop" class="shop-detail-error">
      <v-alert type="warning" class="mx-4">
        Shop nicht gefunden
      </v-alert>
    </div>
    
    <div v-else class="shop-detail">
      <div
        class="shop-header"
        :style="{ backgroundColor: shop.backgroundColor }"
      >
        <img :src="shop.iconUrl" alt="Shop icon" class="shop-detail-icon" crossorigin="anonymous"/>
        <h2>{{ shop.name }}</h2>
      </div>

      <!-- Voucher Card -->
      <div class="featured-voucher-container" v-if="firstUnredeemedVoucher">
        <VoucherCard 
          :voucher="firstUnredeemedVoucher" 
          @redeem="handleRedeem"
        />
        
        <v-alert
          v-if="redeemError"
          type="error"
          class="mt-4"
        >
          {{ redeemError }}
        </v-alert>
      </div>

      <!-- Confirmation Dialog -->
      <ConfirmDialog
        v-if="showConfirmDialog"
        title="Als verbraucht markieren"
        message="Sind Sie sicher, dass Sie diesen Gutschein als verbraucht markieren wollen?"
        :isLoading="isRedeeming"
        @confirm="redeemVoucher"
        @cancel="closeConfirmDialog"
      />
    </div>
  </v-container>
</template>

<style scoped>
.shop-detail, .shop-detail-error {
  width: 100%;
}

.shop-header {
  border-radius: 8px;
  padding: 2rem;
  display: flex;
  align-items: center;
  color: white;
  margin-bottom: 2rem;
}

.shop-detail-icon {
  width: 100px;
  height: 100px;
  object-fit: contain;
  margin-right: 2rem;
}

.featured-voucher-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 2rem 0;
  width: 100%;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

@media (max-width: 768px) {
  .shop-header {
    flex-direction: column;
    text-align: center;
    padding: 1.5rem 1rem;
    margin: 0 0 2rem 0;
  }

  .shop-detail-icon {
    margin-right: 0;
    margin-bottom: 1rem;
    width: 80px;
    height: 80px;
  }
}

@media (max-width: 480px) {
  .shop-detail h3 {
    font-size: 1.2rem;
    text-align: center;
  }
}
</style>