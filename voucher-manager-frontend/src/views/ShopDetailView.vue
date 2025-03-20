<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useShopStore } from '../state/shopStore';
import { useVoucherStore } from '../state/voucherStore';
import { useScreenBrightness } from '../composables/useScreenBrightness';
import type { Shop, Voucher } from '../types';
import ConfirmDialog from '../components/layout/ConfirmDialog.vue';
import VoucherCard from '../components/voucher/VoucherCard.vue';

const route = useRoute();
const shopStore = useShopStore();
const voucherStore = useVoucherStore();
const { setMaxBrightness, resetBrightness } = useScreenBrightness();
const showRedeemedVouchers = ref(false);

const shop = computed((): Shop | undefined => {
  return shopStore.shops.find((s) => s.id === route.params.id);
});

// For unredeemed vouchers (active)
const firstUnredeemedVoucher = computed((): Voucher | undefined => {
  return voucherStore.vouchers
    .filter((v) => v.shopId === shop.value?.id && !v.redeemedAt)
    .sort((a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt))[0];
});

// For redeemed vouchers
const redeemedVouchers = computed((): Voucher[] => {
  return voucherStore.vouchers
    .filter((v) => v.shopId === shop.value?.id && v.redeemedAt)
    .sort((a, b) => Date.parse(b.redeemedAt || '') - Date.parse(a.redeemedAt || ''));
});

// Watch for changes in unredeemed vouchers to manage brightness
watch(firstUnredeemedVoucher, (newVal) => {
  if (newVal) {
    setMaxBrightness();
  } else {
    resetBrightness();
  }
});

// Set initial brightness
onMounted(() => {
  if (firstUnredeemedVoucher.value) {
    setMaxBrightness();
  }
});

// Reset brightness when leaving the view
onBeforeUnmount(() => {
  resetBrightness();
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

const toggleRedeemedVouchers = (): void => {
  showRedeemedVouchers.value = !showRedeemedVouchers.value;
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

      <!-- Active Voucher Card -->
      <div class="featured-voucher-container" v-if="firstUnredeemedVoucher">
        <h3 class="section-title">Aktiver Gutschein</h3>
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
      
      <!-- No active vouchers message -->
      <div v-else-if="shop" class="no-vouchers-message">
        <v-alert type="info" class="mx-4">
          Keine aktiven Gutscheine für diesen Shop verfügbar.
        </v-alert>
      </div>

      <!-- Redeemed Vouchers Section -->
      <div v-if="redeemedVouchers.length > 0" class="redeemed-vouchers-section">
        <div 
          class="redeemed-vouchers-header" 
          @click="toggleRedeemedVouchers"
          :class="{ 'expanded': showRedeemedVouchers }"
        >
          <h3 class="section-title">Eingelöste Gutscheine ({{ redeemedVouchers.length }})</h3>
          <v-icon>{{ showRedeemedVouchers ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
        </div>
        
        <div v-if="showRedeemedVouchers" class="redeemed-vouchers-list">
          <div 
            v-for="voucher in redeemedVouchers" 
            :key="voucher.id" 
            class="redeemed-voucher-card"
          >
            <div class="voucher-code">{{ voucher.code }}</div>
            <div class="redemption-date">
              Eingelöst am {{ voucher.redeemedAt ? new Date(voucher.redeemedAt).toLocaleDateString() : 'unbekanntes Datum' }}
            </div>
          </div>
        </div>
      </div>

      <!-- Confirmation Dialog -->
      <ConfirmDialog
        :show="showConfirmDialog"
        title="Als verbraucht markieren"
        message="Sind Sie sicher, dass Sie diesen Gutschein als verbraucht markieren wollen?"
        @update:show="(value) => showConfirmDialog = value"
        @confirm="handleConfirm"
        @cancel="handleCancel"
        confirmText="Ja"
        cancelText="Abbrechen"
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

.section-title {
  width: 100%;
  text-align: center;
  margin-bottom: 1rem;
  font-size: 1.3rem;
  color: #333;
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

.redeemed-vouchers-section {
  margin: 2rem auto;
  max-width: 600px;
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.redeemed-vouchers-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background-color: #f5f5f5;
  cursor: pointer;
  transition: background-color 0.2s;
}

.redeemed-vouchers-header:hover {
  background-color: #eeeeee;
}

.redeemed-vouchers-header.expanded {
  border-bottom: 1px solid #e0e0e0;
}

.redeemed-vouchers-header h3 {
  margin: 0;
}

.redeemed-vouchers-list {
  padding: 1rem;
  background-color: white;
}

.redeemed-voucher-card {
  padding: 1rem;
  border-radius: 8px;
  background-color: #f9f9f9;
  margin-bottom: 0.75rem;
  display: flex;
  flex-direction: column;
  border-left: 4px solid #ffcdd2;
}

.redeemed-voucher-card:last-child {
  margin-bottom: 0;
}

.redeemed-voucher-card .voucher-code {
  font-weight: bold;
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}

.redeemed-voucher-card .redemption-date {
  font-size: 0.9rem;
  color: #777;
}

.no-vouchers-message {
  margin: 2rem auto;
  max-width: 600px;
  width: 100%;
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
  
  .redeemed-vouchers-header {
    padding: 0.75rem 1rem;
  }
  
  .redeemed-voucher-card {
    padding: 0.75rem;
  }
}
</style>