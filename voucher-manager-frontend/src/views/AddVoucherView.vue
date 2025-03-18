<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import VoucherForm from '../components/voucher/VoucherForm.vue';

const route = useRoute();
const router = useRouter();
const shopId = route.params.shopId as string;

const handleVoucherAdded = () => {
  router.push(`/shops/${route.params.shopId}`);
};
</script>

<template>
  <div class="add-voucher-view">
    <h2>Add New Voucher</h2>
    <VoucherForm 
      :shopId="shopId" 
      @voucher-added="handleVoucherAdded"
    />
  </div>
</template>

<style scoped>
.add-voucher-view {
  padding: 1rem;
}

h2 {
  margin-bottom: 1rem;
}
</style>