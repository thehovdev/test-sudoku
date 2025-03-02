<template>
  <div class="sudoku-grid-container">
    <div class="sudoku-grid">
      <div v-for="row in 9" :key="`row-${row}`" class="grid-row">
        <SudokuCell
          v-for="col in 9"
          :key="`cell-${row}-${col}`"
          :cell="sudokuStore.gameState[row - 1][col - 1]"
          :row="row - 1"
          :col="col - 1"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import SudokuCell from './SudokuCell.vue';
import { useSudokuStore } from '../stores/sudoku';

const sudokuStore = useSudokuStore();

const handleKeyDown = (event: KeyboardEvent) => {
  if (!sudokuStore.gameStarted || sudokuStore.gameCompleted || sudokuStore.gamePaused) {
    return;
  }
  
  const selectedCell = sudokuStore.selectedCell;
  if (!selectedCell) return;
  
  const { row, col } = selectedCell;
  
  // Handle number keys (1-9)
  if (event.key >= '1' && event.key <= '9') {
    const value = parseInt(event.key);
    
    if (sudokuStore.isInDraftMode) {
      sudokuStore.toggleNote(row, col, value);
    } else {
      sudokuStore.setCellValue(row, col, value);
    }
  }
  // Handle delete or backspace
  else if (event.key === 'Delete' || event.key === 'Backspace') {
    sudokuStore.setCellValue(row, col, null);
  }
  // Handle arrow keys for navigation
  else if (event.key === 'ArrowUp') {
    if (row > 0) {
      sudokuStore.selectCell(row - 1, col);
    }
    event.preventDefault();
  }
  else if (event.key === 'ArrowDown') {
    if (row < 8) {
      sudokuStore.selectCell(row + 1, col);
    }
    event.preventDefault();
  }
  else if (event.key === 'ArrowLeft') {
    if (col > 0) {
      sudokuStore.selectCell(row, col - 1);
    }
    event.preventDefault();
  }
  else if (event.key === 'ArrowRight') {
    if (col < 8) {
      sudokuStore.selectCell(row, col + 1);
    }
    event.preventDefault();
  }
};

// Handle visibility change for auto-pause
const handleVisibilityChange = () => {
  if (document.hidden && sudokuStore.gameStarted && !sudokuStore.gameCompleted && !sudokuStore.gamePaused) {
    sudokuStore.pauseGame();
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
  document.addEventListener('visibilitychange', handleVisibilityChange);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
  document.removeEventListener('visibilitychange', handleVisibilityChange);
});
</script>

<style scoped>
.sudoku-grid-container {
  @apply flex justify-center items-center my-4 w-full;
}

.sudoku-grid {
  /* padding: 10px 25px 25px 10px; */
  /* @apply border-4 border-gray-900 bg-white rounded-lg shadow-xl overflow-hidden; */
  display: grid;
  grid-template-rows: repeat(9, 1fr);
  width: min(100%, 450px);
  max-width: 90vw;
  aspect-ratio: 1 / 1;
  margin: 0 auto;
}

.grid-row {
  @apply flex;
}
</style> 