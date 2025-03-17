<script setup>
import { useRoute, useRouter } from 'vue-router';
import VoucherForm from '../components/voucher/VoucherForm.vue';

const route = useRoute();
const router = useRouter();

const handleVoucherAdded = () => {
  router.push(`/shops/${route.params.shopId}`);
};
</script>

<template>
  <v-container fluid class="pa-4">
    <v-row justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card class="pa-4">
          <v-card-title class="text-h5 mb-4">
            Add New Voucher
          </v-card-title>
          <VoucherForm 
            :shopId="route.params.shopId" 
            @voucher-added="handleVoucherAdded"
          />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
/* Remove previous styles as they're no longer needed */
</style>