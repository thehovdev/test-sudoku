<template>
  <div class="leaderboard">
    <h2 class="leaderboard-title">Leaderboard</h2>
    
    <div class="difficulty-tabs">
      <button
        v-for="diff in difficulties"
        :key="diff"
        :class="['tab-button', { active: selectedDifficulty === diff }]"
        @click="selectedDifficulty = diff"
      >
        {{ diff }}
      </button>
    </div>
    
    <div class="records-container">
      <table class="records-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Player</th>
            <th>Score</th>
            <th>Time</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="!filteredRecords.length">
            <td colspan="5" class="no-records">No records yet</td>
          </tr>
          <tr v-for="(record, index) in filteredRecords" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ record.playerName }}</td>
            <td>{{ record.score }}</td>
            <td>{{ formatTime(record.time) }}</td>
            <td>{{ formatDate(record.date) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useSudokuStore } from '../stores/sudoku';
import { Difficulty } from '../types/sudoku';

const sudokuStore = useSudokuStore();
const selectedDifficulty = ref<Difficulty>(Difficulty.BEGINNER);

const difficulties = [
  Difficulty.BEGINNER,
  Difficulty.INTERMEDIATE,
  Difficulty.HARD,
  Difficulty.EXPERT
];

const filteredRecords = computed(() => {
  return sudokuStore.getAllTopRecords[selectedDifficulty.value] || [];
});

const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString();
};
</script>

<style scoped>
.leaderboard {
  @apply bg-white rounded-xl shadow-lg p-6 my-8 max-w-3xl mx-auto border border-gray-100;
}

.leaderboard-title {
  @apply text-2xl font-bold text-center mb-6 text-gray-800;
}

.difficulty-tabs {
  @apply flex justify-center mb-6 gap-3 flex-wrap;
}

.tab-button {
  @apply px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors capitalize font-medium;
}

.tab-button.active {
  @apply bg-blue-600 text-white hover:bg-blue-700;
}

.records-container {
  @apply overflow-x-auto rounded-lg border border-gray-200;
}

.records-table {
  @apply w-full border-collapse;
}

.records-table th, .records-table td {
  @apply p-3 text-left border-b border-gray-200;
}

.records-table th {
  @apply bg-gray-50 font-semibold text-gray-700;
}

.records-table td {
  @apply text-gray-800;
}

.no-records {
  @apply text-center text-gray-500 py-6;
}
</style> 