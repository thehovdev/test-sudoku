<template>
  <div class="difficulty-selector">
    <h2 class="title">Select Difficulty</h2>
    
    <div class="difficulty-buttons">
      <button
        v-for="diff in difficulties"
        :key="diff"
        class="difficulty-button"
        @click="startGame(diff)"
      >
        <div class="button-content">
          <span class="difficulty-name">{{ diff }}</span>
          <span class="difficulty-desc">{{ getDifficultyDescription(diff) }}</span>
        </div>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSudokuStore } from '../stores/sudoku';
import { Difficulty, DIFFICULTY_CONFIG } from '../types/sudoku';

const sudokuStore = useSudokuStore();

const difficulties = [
  Difficulty.BEGINNER,
  Difficulty.INTERMEDIATE,
  Difficulty.HARD,
  Difficulty.EXPERT
];

const getDifficultyDescription = (difficulty: Difficulty): string => {
  const config = DIFFICULTY_CONFIG[difficulty];
  return `${config.minVisible}-${config.maxVisible} cells visible`;
};

const startGame = (difficulty: Difficulty) => {
  sudokuStore.newGame(difficulty);
};
</script>

<style scoped>
.difficulty-selector {
  @apply bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto border border-gray-100;
}

.title {
  @apply text-3xl font-bold text-center mb-8 text-gray-800;
}

.difficulty-buttons {
  @apply flex flex-col gap-4;
}

.difficulty-button {
  @apply px-6 py-4 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 hover:shadow-lg transition-all text-left;
}

.button-content {
  @apply flex flex-col;
}

.difficulty-name {
  @apply text-xl font-bold capitalize mb-1;
}

.difficulty-desc {
  @apply text-sm opacity-90;
}
</style> 