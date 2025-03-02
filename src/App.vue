<script setup lang="ts">
import { useSudokuStore } from './stores/sudoku';
import SudokuGrid from './components/SudokuGrid.vue';
import DigitSelector from './components/DigitSelector.vue';
import GameControls from './components/GameControls.vue';
import GameInfo from './components/GameInfo.vue';
import LeaderBoard from './components/LeaderBoard.vue';
import DifficultySelector from './components/DifficultySelector.vue';
import GameCompleted from './components/GameCompleted.vue';
import GamePaused from './components/GamePaused.vue';

const sudokuStore = useSudokuStore();
</script>

<template>
  <div class="app-container">
    <header>
      <h1 class="app-title">Sudoku Game</h1>
    </header>

    <main>
      <div v-if="!sudokuStore.gameStarted" class="start-screen">
        <DifficultySelector />
        <LeaderBoard class="mt-8" />
      </div>
      
      <div v-else class="game-screen">
        <GameInfo />
        
        <SudokuGrid />
        
        <DigitSelector />
        
        <GameControls />
      </div>
    </main>
    
    <GameCompleted v-if="sudokuStore.gameCompleted" />
    <GamePaused v-if="sudokuStore.gamePaused && !sudokuStore.gameCompleted" />
  </div>
</template>

<style>
@import './assets/main.css';

body {
  @apply bg-gray-50 min-h-screen text-gray-800;
}

.app-container {
  @apply max-w-4xl mx-auto p-4 sm:p-6 md:p-8;
}

.app-title {
  @apply text-2xl sm:text-3xl md:text-4xl font-bold text-center my-4 sm:my-6 md:my-8 text-blue-700;
}

.start-screen, .game-screen {
  @apply flex flex-col items-center gap-4 sm:gap-6;
}
</style>
