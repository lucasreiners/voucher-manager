<script setup lang="ts">
import { ref } from 'vue';
import { createVoucher } from '../../services/apiService';
import { useVoucherStore } from '../../state/voucherStore';

interface Props {
  shopId: string;
}

const props = defineProps<Props>();
const voucherStore = useVoucherStore();

const voucherCode = ref<string>('');
const isSubmitting = ref<boolean>(false);
const error = ref<string | null>(null);

const handleSubmit = async (e: Event): Promise<void> => {
  e.preventDefault();
  if (!voucherCode.value.trim()) return;

  isSubmitting.value = true;
  error.value = null;

  try {
    const newVoucher = await createVoucher(props.shopId, voucherCode.value);
    voucherStore.vouchers.push(newVoucher);
    voucherCode.value = '';
  } catch (e) {
    error.value = (e as Error).message || 'Failed to create voucher';
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <form @submit="handleSubmit" class="voucher-form">
    <div class="form-group">
      <input
        v-model="voucherCode"
        type="text"
        placeholder="Enter voucher code"
        :disabled="isSubmitting"
        class="voucher-input"
      />
      <button type="submit" :disabled="isSubmitting || !voucherCode.trim()" class="submit-button">
        {{ isSubmitting ? 'Creating...' : 'Create Voucher' }}
      </button>
    </div>
    <p v-if="error" class="error-message">{{ error }}</p>
  </form>
</template>

<style scoped>
.voucher-form {
  width: 100%;
}
</style>