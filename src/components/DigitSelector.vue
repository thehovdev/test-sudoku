<template>
  <div class="digit-selector">
    <div
      v-for="digit in sudokuStore.digitCounts"
      :key="digit.digit"
      :class="[
        'digit-button',
        { 'completed': digit.completed }
      ]"
      @click="handleDigitClick(digit.digit)"
    >
      {{ digit.digit }}
      <span class="digit-count">{{ digit.count }}/9</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSudokuStore } from '../stores/sudoku';

const sudokuStore = useSudokuStore();

const handleDigitClick = (digit: number) => {
  if (!sudokuStore.gameStarted || sudokuStore.gameCompleted || sudokuStore.gamePaused) {
    return;
  }
  
  const selectedCell = sudokuStore.selectedCell;
  if (!selectedCell) return;
  
  const { row, col } = selectedCell;
  
  if (sudokuStore.isInDraftMode) {
    sudokuStore.toggleNote(row, col, digit);
  } else {
    sudokuStore.setCellValue(row, col, digit);
  }
};
</script>

<style scoped>
.digit-selector {
  @apply flex flex-wrap justify-center gap-2 sm:gap-3 my-4 sm:my-6 w-full max-w-md mx-auto;
}

.digit-button {
  @apply flex flex-col items-center justify-center w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-blue-100 rounded-lg text-lg sm:text-xl md:text-2xl font-bold cursor-pointer transition-all hover:bg-blue-200 hover:shadow-md relative text-blue-800;
}

.completed {
  @apply bg-gray-200 text-gray-500;
}

.digit-count {
  @apply text-[0.6rem] sm:text-xs font-normal text-gray-600 mt-0.5 sm:mt-1;
}
</style> 