<script setup>
import { ref, computed, watch } from 'vue';
import { useVoucherStore } from '../state/voucherStore';
import VoucherCard from '../components/voucher/VoucherCard.vue';
import ConfirmDialog from '../components/layout/ConfirmDialog.vue';
import { redeemVoucher as apiRedeemVoucher } from '../services/apiService';

const props = defineProps({
  shop: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['close']);

const voucherStore = useVoucherStore();
const isRedeeming = ref(false);
const redeemError = ref(null);
const showConfirmDialog = ref(false);

const firstUnredeemedVoucher = computed(() => {
  return voucherStore.vouchers
    .filter((v) => v.shopId === props.shop.id && !v.redeemedAt)
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))[0] 
    || voucherStore.vouchers.find((v) => v.shopId === props.shop.id);
});

const closeShopDetails = () => {
  emit('close');
};

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
  <div class="shop-detail">
    <button class="back-button" @click="closeShopDetails">Zurück zur Shop Übersicht</button>
    
    <div
      class="shop-header"
      :style="{ backgroundColor: shop.backgroundColor }"
    >
      <img :src="shop.iconUrl" alt="Shop Icon" class="shop-detail-icon" crossorigin="anonymous"/>
      <h2>{{ shop.name }}</h2>
    </div>

    <!-- Voucher Card -->
    <div class="featured-voucher-container" v-if="firstUnredeemedVoucher">
      <VoucherCard 
        :voucher="firstUnredeemedVoucher" 
        @redeem="handleRedeem"
      />
      
      <div v-if="redeemError" class="error-message">{{ redeemError }}</div>
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
</template>

<style scoped>
.shop-detail {
  margin-top: 2rem;
}

.back-button {
  margin-bottom: 1rem;
  padding: 0.5rem 1rem;
  background-color: #f1f1f1;
  border: none;
  border-radius: 4px;
  cursor: pointer;
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
}

.error-message {
  color: #d32f2f;
  margin-top: 1rem;
  font-size: 0.9rem;
  padding: 0.5rem 1rem;
  background-color: #ffebee;
  border-radius: 4px;
}

@media (max-width: 768px) {
  .shop-header {
    flex-direction: column;
    text-align: center;
    padding: 1.5rem 1rem;
    margin: 0 0.5rem 2rem 0.5rem;
    width: calc(100% - 1rem);
  }

  .shop-detail-icon {
    margin-right: 0;
    margin-bottom: 1rem;
    width: 80px;
    height: 80px;
  }

  .back-button {
    width: calc(100% - 1rem);
    padding: 0.75rem;
    margin: 0 0.5rem 1rem 0.5rem;
  }
}

@media (max-width: 480px) {
  .shop-detail h3 {
    font-size: 1.2rem;
    text-align: center;
  }
}
</style>