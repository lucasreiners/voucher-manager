<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useVoucherStore } from "../state/voucherStore";
import JsBarcode from "jsbarcode";

const props = defineProps({
	shop: {
		type: Object,
		required: true,
	},
});

const emit = defineEmits(["close"]);

const voucherStore = useVoucherStore();
const barcodeRef = ref(null);
const isRedeeming = ref(false);
const redeemError = ref(null);
const showConfirmDialog = ref(false);

const firstShopVoucher = computed(() => {
	return voucherStore.vouchers.find((v) => v.shopId === props.shop.id);
});

// Use onMounted to ensure the DOM is ready
onMounted(() => {
	if (firstShopVoucher.value && barcodeRef.value) {
		// Give DOM time to render
		setTimeout(renderBarcode, 200);
	}
});

// Watch for changes to render barcode when available
watch(firstShopVoucher, (newVal) => {
	if (newVal && barcodeRef.value) {
		setTimeout(renderBarcode, 200);
	}
});

const renderBarcode = () => {
	if (barcodeRef.value && firstShopVoucher.value) {
		try {
			// Clear previous content
			while (barcodeRef.value.firstChild) {
				barcodeRef.value.removeChild(barcodeRef.value.firstChild);
			}

			JsBarcode(barcodeRef.value, firstShopVoucher.value.code, {
				format: "CODE128",
				lineColor: "#000",
				width: 2,
				height: 80,
				displayValue: false,
				background: "#ffffff",
			});

			console.log("Barcode rendered for:", firstShopVoucher.value.code);
		} catch (e) {
			console.error("Error generating barcode:", e);
		}
	} else {
		console.log("Cannot render barcode - missing ref or voucher", {
			ref: !!barcodeRef.value,
			voucher: !!firstShopVoucher.value,
		});
	}
};

const closeShopDetails = () => {
	emit("close");
};

const redeemVoucher = async () => {
	if (!firstShopVoucher.value || firstShopVoucher.value.redeemedAt) {
		return;
	}

	try {
		isRedeeming.value = true;
		redeemError.value = null;
		await voucherStore.redeemVoucher(firstShopVoucher.value.id);
		showConfirmDialog.value = false;
	} catch (error) {
		redeemError.value = "Failed to redeem voucher. Please try again.";
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
</script>

<template>
  <div class="shop-detail">
    <button class="back-button" @click="closeShopDetails">Back to shops</button>
    <div
        class="shop-header"
        :style="{ backgroundColor: shop.backgroundColor }"
    >
      <img :src="shop.iconUrl" alt="Shop icon" class="shop-detail-icon" crossorigin="anonymous"/>
      <h2>{{ shop.name }}</h2>
    </div>

    <!-- First Voucher as Card with Barcode -->
    <div class="featured-voucher-container" v-if="firstShopVoucher">
      <div class="featured-voucher-card">
        <div class="barcode-wrapper">
          <svg class="barcode" ref="barcodeRef"></svg>
        </div>
        <p class="voucher-code">{{ firstShopVoucher.code }}</p>
        <p class="voucher-status" :class="{ 'redeemed': firstShopVoucher.redeemedAt }">
          {{ firstShopVoucher.redeemedAt ? 'Redeemed' : 'Available' }}
        </p>
        
        <div v-if="redeemError" class="error-message">{{ redeemError }}</div>
        
        <button 
          v-if="!firstShopVoucher.redeemedAt" 
          class="redeem-button" 
          @click="openConfirmDialog" 
          :disabled="isRedeeming"
        >
          {{ isRedeeming ? 'Redeeming...' : 'Redeem Voucher' }}
        </button>
        
        <p v-else class="redemption-date">
          Redeemed on {{ new Date(firstShopVoucher.redeemedAt).toLocaleDateString() }}
        </p>
      </div>
    </div>

    <!-- Confirmation Dialog -->
    <div class="modal-overlay" v-if="showConfirmDialog" @click="closeConfirmDialog"></div>
    <div class="confirm-dialog" v-if="showConfirmDialog">
      <h3>Confirm Redemption</h3>
      <p>Are you sure you want to redeem this voucher? This action cannot be undone.</p>
      <div class="dialog-buttons">
        <button class="cancel-button" @click="closeConfirmDialog" :disabled="isRedeeming">Cancel</button>
        <button class="confirm-button" @click="redeemVoucher" :disabled="isRedeeming">
          {{ isRedeeming ? 'Processing...' : 'Confirm' }}
        </button>
      </div>
    </div>
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

.shop-content {
  padding: 1rem;
}

.voucher-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.voucher-card {
  background-color: #f9f9f9;
  border-radius: 6px;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.featured-voucher-container {
  display: flex;
  justify-content: center;
  margin: 2rem 0;
}

.featured-voucher-card {
  background-color: white;
  border-radius: 10px;
  padding: 2rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 90%;
  max-width: 400px;
}

.barcode-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
  padding: 1rem;
  background-color: white;
}

.barcode {
  width: 100%;
  height: auto;
  min-height: 80px; /* Ensure there's space for the barcode to render */
}

.voucher-code {
  font-size: 1.2rem;
  font-weight: bold;
  margin: 0.5rem 0;
  color: #000000; /* Make text black for better readability */
}

.voucher-status {
  margin-top: 0.5rem;
  padding: 0.25rem 0.75rem;
  background-color: #e0e0e0; /* Darker background */
  border-radius: 1rem;
  font-size: 0.9rem;
  font-weight: 600; /* Make text bolder */
  color: #333333; /* Darker text color for contrast */
}

.redeem-button {
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;
}

.redeem-button:hover {
  background-color: #45a049;
}

.redeem-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.error-message {
  color: #d32f2f;
  margin-top: 0.5rem;
  font-size: 0.9rem;
}

.redemption-date {
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: #666;
}

.voucher-status.redeemed {
  background-color: #ffcdd2;
  color: #c62828;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 100;
}

.confirm-dialog {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  z-index: 101;
  max-width: 90%;
  width: 400px;
}

.confirm-dialog h3 {
  margin-top: 0;
  color: #333;
}

.confirm-dialog p {
  margin-bottom: 1.5rem;
  color: #666;
}

.dialog-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.cancel-button {
  padding: 0.5rem 1rem;
  background-color: #f1f1f1;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.confirm-button {
  padding: 0.5rem 1rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.confirm-button:disabled,
.cancel-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
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

  .voucher-list {
    grid-template-columns: 1fr;
  }

  .back-button {
    width: calc(100% - 1rem);
    padding: 0.75rem;
    margin: 0 0.5rem 1rem 0.5rem;
  }

  .featured-voucher-card {
    width: calc(100% - 2rem);
    padding: 1.5rem;
  }

  .confirm-dialog {
    width: 85%;
    padding: 1.2rem;
  }
  
  .dialog-buttons {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .cancel-button,
  .confirm-button {
    width: 100%;
    padding: 0.75rem;
  }
}

@media (max-width: 480px) {
  .shop-content h3 {
    font-size: 1.2rem;
    text-align: center;
  }
}
</style>
