<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useShopStore } from '../state/shopStore';
import { useVoucherStore } from '../state/voucherStore';
import type { Shop, Voucher } from '../types';
import ConfirmDialog from '../components/layout/ConfirmDialog.vue';
import VoucherCard from '../components/voucher/VoucherCard.vue';

const route = useRoute();
const shopStore = useShopStore();
const voucherStore = useVoucherStore();

const shop = computed((): Shop | undefined => {
  return shopStore.shops.find((s) => s.id === route.params.id);
});

// Modified to only include unredeemed vouchers
const firstUnredeemedVoucher = computed((): Voucher | undefined => {
  return voucherStore.vouchers
    .filter((v) => v.shopId === shop.value?.id && !v.redeemedAt)
    .sort((a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt))[0];
});

const isRedeeming = ref(false);
const redeemError = ref<string | null>(null);
const showConfirmDialog = ref(false);

const handleConfirm = async (): Promise<void> => {
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
    console.error('Error redeeming voucher:', error);
  } finally {
    isRedeeming.value = false;
  }
};

const handleCancel = (): void => {
  showConfirmDialog.value = false;
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

      <!-- Voucher Card - Only shown if there's an unredeemed voucher -->
      <div class="featured-voucher-container" v-if="firstUnredeemedVoucher">
        <VoucherCard 
          :voucher="firstUnredeemedVoucher" 
          @redeem="showConfirmDialog = true"
        />
        
        <v-alert
          v-if="redeemError"
          type="error"
          class="mt-4"
        >
          {{ redeemError }}
        </v-alert>
      </div>
      
      <!-- No unredeemed vouchers message -->
      <div v-else-if="shop" class="no-vouchers-message">
        <v-alert type="info" class="mx-4">
          Keine aktiven Gutscheine für diesen Shop verfügbar.
        </v-alert>
      </div>

      <!-- Confirmation Dialog -->
      <ConfirmDialog
        :show="showConfirmDialog"
        title="Als verbraucht markieren"
        message="Sind Sie sicher, dass Sie diesen Gutschein als verbraucht markieren wollen?"
        @update:show="(value) => showConfirmDialog = value"
        @confirm="handleConfirm"
        @cancel="handleCancel"
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

.no-vouchers-message {
  margin: 2rem auto;
  max-width: 600px;
  width: 100%;
}
</style>