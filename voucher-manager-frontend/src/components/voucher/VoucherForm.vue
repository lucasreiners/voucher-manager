<script setup lang="ts">
import { Html5Qrcode } from "html5-qrcode";
import { onUnmounted, ref } from "vue";
import { createVoucher } from "../../services/apiService";
import { useVoucherStore } from "../../state/voucherStore";

interface Props {
	shopId: string;
}

const props = defineProps<Props>();
const voucherStore = useVoucherStore();

const voucherCode = ref<string>("");
const codeFormat = ref<string>(""); // Removed default value
const isSubmitting = ref<boolean>(false);
const error = ref<string | null>(null);
const showScanner = ref<boolean>(false);
const scannerRef = ref<HTMLDivElement | null>(null);
const scannerInstance = ref<Html5Qrcode | null>(null);
const snackbar = ref<boolean>(false);
const snackbarMessage = ref<string>("");
const snackbarColor = ref<string>(""); // Added snackbar color

// Barcode format options
const barcodeFormats = [
	"EAN13",
	"EAN8",
	"EAN5",
	"EAN2",
	"UPCA",
	"UPCE",
	"CODE128",
	"CODE128A",
	"CODE128B",
	"CODE128C",
	"CODE39",
	"ITF",
	"ITF14",
	"MSI10",
	"MSI11",
	"MSI1010",
	"MSI1110",
];

const handleSubmit = async (e: Event): Promise<void> => {
	e.preventDefault();
	if (!voucherCode.value.trim()) return;

	isSubmitting.value = true;
	error.value = null;

	try {
		const newVoucher = await createVoucher(
			props.shopId,
			voucherCode.value,
			codeFormat.value,
		);
		voucherStore.vouchers.push(newVoucher);

		// Show success message
		snackbarMessage.value = "Voucher was successfully added!";
		snackbar.value = true;
		snackbarColor.value = "success"; // Set success color for the snackbar

		// Clear the input field
		voucherCode.value = "";
	} catch (e) {
		error.value = (e as Error).message || "Failed to create voucher";
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

		// Use a more specific type instead of any
		interface DecodedResult {
			result: {
				format?: {
					formatName: string;
				};
			};
		}

		const qrCodeSuccessCallback = (
			decodedText: string,
			decodedResult: DecodedResult,
		) => {
			// Use optional chaining
			if (decodedResult?.result?.format?.formatName) {
				// Map the format from the decoder to our supported formats
				try {
					const detectedFormat = mapDecoderFormatToSupportedFormat(
						decodedResult.result.format.formatName,
					);
					// Only set the code value and format if the format is supported
					voucherCode.value = decodedText;
					codeFormat.value = detectedFormat;
				} catch (err) {
					// Display error toast for unsupported format
					snackbarMessage.value = `${err}`;
					snackbar.value = true;
					snackbarColor.value = "error"; // Set error color for the snackbar
				}
			}

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
			},
		);
	} catch (err) {
		console.error("Error starting scanner:", err);
		error.value = "Failed to start camera. Please check permissions.";
		showScanner.value = false;
	}
};

// Map the decoder format names to our supported formats
const mapDecoderFormatToSupportedFormat = (decoderFormat: string): string => {
	// The library might return formats in different naming convention
	const formatMap: Record<string, string> = {
		EAN_13: "EAN13",
		EAN_8: "EAN8",
		EAN_5: "EAN5",
		EAN_2: "EAN2",
		UPC_A: "UPCA",
		UPC_E: "UPCE",
		CODE_128: "CODE128",
		CODE_93: "CODE93",
		CODE_39: "CODE39",
		ITF: "ITF",
	};

	const upperDecoderFormat = decoderFormat.toUpperCase();
	if (formatMap[upperDecoderFormat]) {
		return formatMap[upperDecoderFormat];
	}

	throw new Error(`Barcode format "${decoderFormat}" is not supported`);
};

const stopScanner = () => {
	if (scannerInstance.value) {
		scannerInstance.value.stop().catch((error: Error) => {
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
          
          <v-col cols="12">
            <v-select
              v-model="codeFormat"
              label="Barcode Format"
              :items="barcodeFormats"
              variant="outlined"
              density="compact"
              hide-details
              class="mb-2"
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
      :color="snackbarColor"
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
