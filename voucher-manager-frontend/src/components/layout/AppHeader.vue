<script setup lang="ts">
interface Props {
  title: string;
}

defineProps<Props>();
</script>

<template>
  <header class="app-header">
    <h1>{{ title }}</h1>
  </header>
</template>

<style scoped>
.app-header {
  padding: 1rem;
  background-color: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
}

h1 {
  margin: 0;
  font-size: 1.5rem;
}
</style>