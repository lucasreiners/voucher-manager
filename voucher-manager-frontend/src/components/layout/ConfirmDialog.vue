<script setup lang="ts">
interface Props {
  show: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

const props = withDefaults(defineProps<Props>(), {
  confirmText: 'Confirm',
  cancelText: 'Cancel'
});

const emit = defineEmits<{
  (e: 'confirm'): void;
  (e: 'cancel'): void;
  (e: 'update:show', value: boolean): void;
}>();

const handleConfirm = (): void => {
  emit('confirm');
  emit('update:show', false);
};

const handleCancel = (): void => {
  emit('cancel');
  emit('update:show', false);
};
</script>

<template>
  <v-dialog :model-value="show" @update:model-value="(value) => emit('update:show', value)" max-width="500px">
    <v-card>
      <v-card-title>{{ title }}</v-card-title>
      <v-card-text>{{ message }}</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="grey" text @click="handleCancel">{{ cancelText }}</v-btn>
        <v-btn color="on-primary" @click="handleConfirm">{{ confirmText }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.modal-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 100;
}

.confirm-dialog {
  position: relative;
  background-color: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  z-index: 101;
  max-width: 90%;
  width: 400px;
}

.confirm-dialog h3 {
  margin-top: 0;
  color: #333;
}

.confirm-dialog p {
  margin-bottom: 1.5rem;
  color: #666;
}

.dialog-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.cancel-button {
  padding: 0.5rem 1rem;
  background-color: #f1f1f1;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.confirm-button {
  padding: 0.5rem 1rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.confirm-button:disabled,
.cancel-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .confirm-dialog {
    width: 85%;
    padding: 1.2rem;
  }
  
  .dialog-buttons {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .cancel-button,
  .confirm-button {
    width: 100%;
    padding: 0.75rem;
  }
}
</style>