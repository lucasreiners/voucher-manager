<script setup>
import { useRoute, useRouter } from 'vue-router';
import VoucherForm from '../components/voucher/VoucherForm.vue';

const route = useRoute();
const router = useRouter();

const handleVoucherAdded = () => {
  router.push(`/shops/${route.params.shopId}`);
};

const goBack = () => {
  router.back();
};
</script>

<template>
  <div class="add-voucher-view">
    <button class="back-button" @click="goBack">Back to shop</button>
    <h2>Add New Voucher</h2>
    <VoucherForm 
      :shopId="route.params.shopId" 
      @voucher-added="handleVoucherAdded"
    />
  </div>
</template>

<style scoped>
.add-voucher-view {
  padding: 1rem;
}

.back-button {
  margin-bottom: 1rem;
  padding: 0.5rem 1rem;
  background-color: #f1f1f1;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

h2 {
  margin-bottom: 1.5rem;
  color: #333;
}
</style>