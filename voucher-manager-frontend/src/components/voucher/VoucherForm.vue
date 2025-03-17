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
    <v-row>
      <v-col cols="12" sm="8">
        <v-text-field
          v-model="code"
          label="Gutschein-Code"
          placeholder="Gutschein-Code eingeben"
          required
          hide-details
          variant="outlined"
          density="comfortable"
        />
      </v-col>
      <v-col cols="12" sm="4" class="d-flex align-center">
        <v-btn
          type="submit"
          color="success"
          block
        >
          Hinzufügen
        </v-btn>
      </v-col>
    </v-row>
  </form>
</template>

<style scoped>
.voucher-form {
  width: 100%;
}
</style>