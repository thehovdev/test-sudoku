<template>
  <div class="game-info">
    <div class="info-container">
      <div class="info-item">
        <div class="info-label">Time</div>
        <div class="info-value">{{ sudokuStore.formattedTime }}</div>
      </div>
      
      <div class="info-item">
        <div class="info-label">Score</div>
        <div class="info-value">{{ sudokuStore.score }}</div>
      </div>
      
      <div class="info-item">
        <div class="info-label">Difficulty</div>
        <div class="info-value capitalize">{{ sudokuStore.difficulty }}</div>
      </div>
      
      <div class="info-item">
        <div class="info-label">Errors</div>
        <div class="info-value">{{ sudokuStore.errors }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSudokuStore } from '../stores/sudoku';

const sudokuStore = useSudokuStore();
</script>

<style scoped>
.game-info {
  @apply my-6;
}

.info-container {
  @apply flex flex-wrap justify-center gap-4;
}

.info-item {
  @apply flex flex-col items-center bg-white rounded-lg p-4 min-w-[90px] shadow-md border border-gray-100;
}

.info-label {
  @apply text-sm text-gray-500 font-medium mb-1;
}

.info-value {
  @apply text-xl font-bold text-gray-800;
}
</style> 