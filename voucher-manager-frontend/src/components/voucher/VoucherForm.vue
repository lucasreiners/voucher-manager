<script setup>
import { ref } from 'vue'
import { useVoucherStore } from '@/state/voucherStore'

const props = defineProps({
  shopId: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['voucher-added'])
const voucherStore = useVoucherStore()
const code = ref('')

const createVoucher = async () => {
  if (!code.value) return
  
  try {
    const newVoucher = await voucherStore.createVoucher({
      shopId: props.shopId,
      code: code.value
    })
    code.value = ''
    emit('voucher-added', newVoucher)
  } catch (error) {
    console.error('Failed to create voucher:', error)
  }
}
</script>

<template>
  <form @submit.prevent="createVoucher" class="voucher-form">
    <input 
      v-model="code"
      type="text"
      placeholder="Gutschein-Code eingeben"
      class="code-input"
      required
    />
    <button type="submit" class="submit-button">
      Hinzufügen
    </button>
  </form>
</template>

<style scoped>
.voucher-form {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  width: 100%;
}

.code-input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.submit-button {
  padding: 0.75rem 1.5rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
}

.submit-button:hover {
  background-color: #45a049;
}
</style>