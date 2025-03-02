<template>
  <div class="game-completed">
    <div class="completion-modal">
      <h2 class="title">Congratulations!</h2>
      
      <div class="stats-container">
        <div class="stat-item">
          <div class="stat-label">Final Score</div>
          <div class="stat-value">{{ sudokuStore.score }}</div>
        </div>
        
        <div class="stat-item">
          <div class="stat-label">Time</div>
          <div class="stat-value">{{ sudokuStore.formattedTime }}</div>
        </div>
        
        <div class="stat-item">
          <div class="stat-label">Difficulty</div>
          <div class="stat-value capitalize">{{ sudokuStore.difficulty }}</div>
        </div>
        
        <div class="stat-item">
          <div class="stat-label">Hints Used</div>
          <div class="stat-value">{{ sudokuStore.hintsUsed }}/10</div>
        </div>
        
        <div class="stat-item">
          <div class="stat-label">Errors</div>
          <div class="stat-value">{{ sudokuStore.errors }}</div>
        </div>
      </div>
      
      <div class="actions">
        <button class="action-button" @click="startNewGame">New Game</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSudokuStore } from '../stores/sudoku';
import { Difficulty } from '../types/sudoku';

const sudokuStore = useSudokuStore();

const startNewGame = () => {
  sudokuStore.newGame(Difficulty.BEGINNER);
};
</script>

<style scoped>
.game-completed {
  @apply fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 p-4;
}

.completion-modal {
  @apply bg-white rounded-xl shadow-xl p-8 max-w-md w-full mx-4 animate-bounce-in;
}

.title {
  @apply text-3xl font-bold text-center mb-8 text-green-600;
}

.stats-container {
  @apply grid grid-cols-2 gap-5 mb-8;
}

.stat-item {
  @apply flex flex-col items-center bg-gray-50 rounded-lg p-4 border border-gray-100;
}

.stat-label {
  @apply text-sm text-gray-500 font-medium mb-1;
}

.stat-value {
  @apply text-xl font-bold text-gray-800;
}

.actions {
  @apply flex justify-center;
}

.action-button {
  @apply px-8 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 hover:shadow-lg transition-all font-medium text-lg;
}

@keyframes bounce-in {
  0% {
    transform: scale(0.8);
    opacity: 0;
  }
  70% {
    transform: scale(1.05);
    opacity: 1;
  }
  100% {
    transform: scale(1);
  }
}

.animate-bounce-in {
  animation: bounce-in 0.5s ease-out;
}
</style> 