<script setup>
defineProps({
  title: {
    type: String,
    default: 'Bestätigen'
  },
  message: {
    type: String,
    required: true
  },
  isLoading: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['confirm', 'cancel']);

const handleConfirm = () => {
  emit('confirm');
};

const handleCancel = () => {
  emit('cancel');
};
</script>

<template>
  <div class="modal-container">
    <div class="modal-overlay" @click="handleCancel"></div>
    <div class="confirm-dialog">
      <h3>{{ title }}</h3>
      <p>{{ message }}</p>
      <div class="dialog-buttons">
        <button 
          class="cancel-button" 
          @click="handleCancel" 
          :disabled="isLoading"
        >
          Abbrechen
        </button>
        <button 
          class="confirm-button" 
          @click="handleConfirm" 
          :disabled="isLoading"
        >
          {{ isLoading ? 'Verarbeite...' : 'Bestätigen' }}
        </button>
      </div>
    </div>
  </div>
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