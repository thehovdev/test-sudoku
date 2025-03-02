<template>
  <div class="game-controls">
    <div class="control-buttons">
      <button
        class="control-button"
        @click="sudokuStore.useHint()"
        :disabled="!sudokuStore.gameStarted || sudokuStore.gameCompleted || sudokuStore.gamePaused || sudokuStore.hintsUsed >= 10"
      >
        <div class="button-content">
          <svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 20 20" fill="currentColor">
            <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
          </svg>
          <span>Hint ({{ sudokuStore.hintsUsed }}/10)</span>
        </div>
      </button>
      
      <button
        class="control-button"
        @click="sudokuStore.undo()"
        :disabled="!sudokuStore.gameStarted || sudokuStore.gameCompleted || sudokuStore.gamePaused"
      >
        <div class="button-content">
          <svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clip-rule="evenodd" />
          </svg>
          <span>Undo</span>
        </div>
      </button>
      
      <button
        class="control-button"
        @click="sudokuStore.redo()"
        :disabled="!sudokuStore.gameStarted || sudokuStore.gameCompleted || sudokuStore.gamePaused"
      >
        <div class="button-content">
          <svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
          <span>Redo</span>
        </div>
      </button>
      
      <button
        v-if="sudokuStore.gamePaused"
        class="control-button"
        @click="sudokuStore.resumeGame()"
      >
        <div class="button-content">
          <svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
          </svg>
          <span>Resume</span>
        </div>
      </button>
      
      <button
        v-else
        class="control-button"
        @click="sudokuStore.pauseGame()"
        :disabled="!sudokuStore.gameStarted || sudokuStore.gameCompleted"
      >
        <div class="button-content">
          <svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
          <span>Pause</span>
        </div>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSudokuStore } from '../stores/sudoku';

const sudokuStore = useSudokuStore();
</script>

<style scoped>
.game-controls {
  @apply my-6;
}

.control-buttons {
  @apply flex flex-wrap justify-center gap-3;
}

.control-button {
  @apply px-5 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600 font-medium;
}

.control-button.active {
  @apply bg-green-600 hover:bg-green-700;
}

.button-content {
  @apply flex items-center gap-2;
}

.icon {
  @apply w-5 h-5;
}
</style> 