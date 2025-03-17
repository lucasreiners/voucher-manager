<script setup>
defineProps({
  title: {
    type: String,
    default: 'Voucher Manager'
  }
});
</script>

<template>
  <header class="app-header">
    <h1>{{ title }}</h1>
  </header>
</template>

<style scoped>
.app-header {
  padding: 1rem 0;
  margin-bottom: 1.5rem;
}

.app-header h1 {
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0;
}

@media (max-width: 480px) {
  .app-header h1 {
    font-size: 1.5rem;
    text-align: center;
  }
}
</style>