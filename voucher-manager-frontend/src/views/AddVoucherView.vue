<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import VoucherForm from "../components/voucher/VoucherForm.vue";

const route = useRoute();
const router = useRouter();
// Get the id parameter from the route, not shopId
const shopId = route.params.id as string;

const handleVoucherAdded = () => {
	// Also use id here for consistency
	router.push(`/shops/${route.params.id}`);
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