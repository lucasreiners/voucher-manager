<script setup lang="ts">
import JsBarcode from 'jsbarcode';
import { onMounted, ref, watch } from 'vue';
import type { Voucher } from '../../types';

interface Props {
    voucher: Voucher;
}

const props = defineProps<Props>();
const emit = defineEmits(['redeem']);
const barcodeRef = ref<SVGSVGElement | null>(null);

onMounted(() => {
    if (barcodeRef.value) {
        renderBarcode();
    }
});

// Watch for voucher changes and re-render barcode
watch(
    () => props.voucher,
    () => {
        if (barcodeRef.value) {
            renderBarcode();
        }
    },
    { deep: true },
);

const renderBarcode = (): void => {
    if (!barcodeRef.value || !props.voucher) {
        return;
    }

    try {
        // Clear previous content
        while (barcodeRef.value.firstChild) {
            barcodeRef.value.removeChild(barcodeRef.value.firstChild);
        }

        JsBarcode(barcodeRef.value, props.voucher.code, {
            format: props.voucher.codeFormat,
            lineColor: '#000',
            width: 2,
            height: 80,
            displayValue: true,
            background: '#ffffff',
        });
    } catch (e) {
        console.error('Error generating barcode:', e);
    }
};

const handleRedeem = (): void => {
    emit('redeem', props.voucher.id);
};
</script>

<template>
  <div class="voucher-card">
    <h3>Guthabenkarte</h3>
    
    <div class="barcode-wrapper">
      <svg class="barcode" ref="barcodeRef"></svg>
    </div>

    <button 
      v-if="!voucher.redeemedAt" 
      class="redeem-button" 
      @click="handleRedeem"
    >
      Guthaben eingelöst?
    </button>
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

.voucher-code {
  font-size: 1.2rem;
  font-weight: bold;
  margin: 1rem 0;
  color: #000000;
  text-align: center;
}

.barcode-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  margin: 1.5rem 0;
  padding: 1rem;
  background-color: white;
}

.barcode {
  width: 100%;
  height: auto;
  min-height: 80px;
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

@media (max-width: 768px) {
  .voucher-card {
    padding: 1.5rem;
  }
}
</style>