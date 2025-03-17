<script setup>
import { ref, onMounted } from "vue";
import JsBarcode from "jsbarcode";

const props = defineProps({
	voucher: {
		type: Object,
		required: true,
	},
});

const emit = defineEmits(["redeem"]);
const barcodeRef = ref(null);

onMounted(() => {
	if (barcodeRef.value) {
		renderBarcode();
	}
});

const renderBarcode = () => {
	if (barcodeRef.value && props.voucher) {
		try {
			// Clear previous content
			while (barcodeRef.value.firstChild) {
				barcodeRef.value.removeChild(barcodeRef.value.firstChild);
			}

			JsBarcode(barcodeRef.value, props.voucher.code, {
				format: "CODE128",
				lineColor: "#000",
				width: 2,
				height: 80,
				displayValue: false,
				background: "#ffffff",
			});
		} catch (e) {
			console.error("Error generating barcode:", e);
		}
	}
};

const handleRedeem = () => {
	emit("redeem", props.voucher.id);
};
</script>

<template>
  <div class="voucher-card">
    <div class="barcode-wrapper">
      <svg class="barcode" ref="barcodeRef"></svg>
    </div>
    <p class="voucher-code">{{ voucher.code }}</p>    
    <button 
      v-if="!voucher.redeemedAt" 
      class="redeem-button" 
      @click="handleRedeem"
    >
      Guthaben verbraucht
    </button>
    
    <p v-else class="redemption-date">
      Verbraucht am {{ new Date(voucher.redeemedAt).toLocaleDateString() }}
    </p>
  </div>
</template>

<style scoped>
.voucher-card {
  background-color: white;
  border-radius: 10px;
  padding: 2rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
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
  min-height: 80px;
}

.voucher-code {
  font-size: 1.2rem;
  font-weight: bold;
  margin: 0.5rem 0;
  color: #000000;
}

.voucher-status {
  margin-top: 0.5rem;
  padding: 0.25rem 0.75rem;
  background-color: #e0e0e0;
  border-radius: 1rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: #333333;
}

.voucher-status.redeemed {
  background-color: #ffcdd2;
  color: #c62828;
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

.redemption-date {
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: #666;
}

@media (max-width: 768px) {
  .voucher-card {
    padding: 1.5rem;
  }
}
</style>