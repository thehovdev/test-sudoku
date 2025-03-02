<template>
  <div class="game-paused">
    <div class="pause-modal">
      <h2 class="title">Game Paused</h2>
      
      <div class="actions">
        <button class="action-button" @click="sudokuStore.resumeGame()">Resume Game</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSudokuStore } from '../stores/sudoku';

const sudokuStore = useSudokuStore();
</script>

<style scoped>
.game-paused {
  @apply fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 p-4;
}

.pause-modal {
  @apply bg-white rounded-xl shadow-xl p-8 max-w-md w-full mx-4 animate-fade-in;
}

.title {
  @apply text-3xl font-bold text-center mb-8 text-blue-600;
}

.actions {
  @apply flex justify-center;
}

.action-button {
  @apply px-8 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 hover:shadow-lg transition-all font-medium text-lg;
}

@keyframes fade-in {
  0% {
    opacity: 0;
    transform: translateY(-20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}
</style> 