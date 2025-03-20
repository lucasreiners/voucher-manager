<script setup lang="ts">
import { ref, onUnmounted } from 'vue';
import { createVoucher } from '../../services/apiService';
import { useVoucherStore } from '../../state/voucherStore';
import { Html5Qrcode } from 'html5-qrcode'; // You'll need to install this

interface Props {
  shopId: string;
}

const props = defineProps<Props>();
const voucherStore = useVoucherStore();

const voucherCode = ref<string>('');
const isSubmitting = ref<boolean>(false);
const error = ref<string | null>(null);
const showScanner = ref<boolean>(false);
const scannerRef = ref<HTMLDivElement | null>(null);
const scannerInstance = ref<Html5Qrcode | null>(null);
const snackbar = ref<boolean>(false);
const snackbarMessage = ref<string>('');

const handleSubmit = async (e: Event): Promise<void> => {
  e.preventDefault();
  if (!voucherCode.value.trim()) return;

  isSubmitting.value = true;
  error.value = null;

  try {
    const newVoucher = await createVoucher(props.shopId, voucherCode.value);
    voucherStore.vouchers.push(newVoucher);
    
    // Show success message
    snackbarMessage.value = 'Voucher was successfully added!';
    snackbar.value = true;
    
    // Clear the input field
    voucherCode.value = '';
  } catch (e) {
    error.value = (e as Error).message || 'Failed to create voucher';
  } finally {
    isSubmitting.value = false;
  }
};

const startScanner = async () => {
  if (!scannerRef.value) return;
  
  showScanner.value = true;
  
  try {
    const html5QrCode = new Html5Qrcode("qr-reader");
    scannerInstance.value = html5QrCode;
    
    const qrCodeSuccessCallback = (decodedText: string) => {
      voucherCode.value = decodedText;
      stopScanner();
    };
    
    const config = { fps: 10, qrbox: { width: 250, height: 250 } };
    
    await html5QrCode.start(
      { facingMode: "environment" }, 
      config, 
      qrCodeSuccessCallback, 
      (errorMessage: string) => {
        // Handle scan errors (optional)
        console.error(errorMessage);
      }
    );
  } catch (err) {
    console.error("Error starting scanner:", err);
    error.value = "Failed to start camera. Please check permissions.";
    showScanner.value = false;
  }
};

const stopScanner = () => {
  if (scannerInstance.value) {
    scannerInstance.value.stop().catch(error => {
      console.error("Error stopping scanner:", error);
    });
    scannerInstance.value = null;
  }
  showScanner.value = false;
};

onUnmounted(() => {
  stopScanner();
});
</script>

<template>
  <v-card class="voucher-form-card">
    <v-card-title class="text-center">Add New Voucher</v-card-title>
    
    <v-card-text>
      <form @submit="handleSubmit" class="voucher-form">
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="voucherCode"
              label="Voucher Code"
              placeholder="Enter or scan voucher code"
              :disabled="isSubmitting"
              variant="outlined"
              density="compact"
              hide-details="auto"
              :error-messages="error ? [error] : []"
              class="mb-2"
              append-inner-icon="mdi-barcode-scan"
              @click:append-inner="startScanner"
            />
          </v-col>
        </v-row>
        
        <div class="d-flex flex-column align-center">
          <div v-show="showScanner" class="scanner-container mb-4">
            <div id="qr-reader" ref="scannerRef" style="width: 100%"></div>
            <v-btn
              icon="mdi-close"
              size="small"
              color="error"
              class="close-scanner-btn"
              @click="stopScanner"
            />
          </div>
          
          <v-btn
            type="submit"
            color="primary"
            variant="elevated"
            :loading="isSubmitting"
            :disabled="isSubmitting || !voucherCode.trim()"
            block
            class="mt-4"
          >
            {{ isSubmitting ? 'Creating...' : 'Create Voucher' }}
          </v-btn>
        </div>
      </form>
    </v-card-text>
    
    <!-- Success Snackbar -->
    <v-snackbar
      v-model="snackbar"
      :timeout="3000"
      color="success"
      location="top"
    >
      {{ snackbarMessage }}
    </v-snackbar>
  </v-card>
</template>

<style scoped>
.voucher-form-card {
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  border-radius: 8px;
}

.scanner-container {
  position: relative;
  width: 100%;
  max-width: 320px;
  border: 1px solid #ccc;
  border-radius: 8px;
  overflow: hidden;
}

.close-scanner-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 10;
}

#qr-reader {
  min-height: 320px;
}

#qr-reader img {
  object-fit: cover;
}

/* Make the scan icon more noticeable */
:deep(.mdi-barcode-scan) {
  font-size: 24px;
  color: #1976d2;
  cursor: pointer;
}

:deep(.v-field__append-inner) {
  padding-top: 6px;
}
</style>