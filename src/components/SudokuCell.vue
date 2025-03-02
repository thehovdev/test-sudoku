<template>
  <div
    :class="[
      'sudoku-cell',
      { 'original': cell.isOriginal },
      { 'error': cell.isError },
      { 'highlighted': cell.isHighlighted },
      { 'selected': isSelected },
      { 'same-row': isSameRow },
      { 'same-col': isSameCol },
      { 'same-box': isSameBox },
      { 'same-value': isSameValue && cell.value !== null },
      { 'border-right': (col + 1) % 3 === 0 && col !== 8 },
      { 'border-bottom': (row + 1) % 3 === 0 && row !== 8 }
    ]"
    @click="handleClick"
  >
    <template v-if="cell.value !== null">
      <span :class="{ 'completed-digit': isCompletedDigit }">{{ cell.value }}</span>
    </template>
    <template v-else-if="cell.notes.length > 0">
      <div class="notes-container">
        <div
          v-for="note in sortedNotes"
          :key="note"
          class="note"
          :style="{
            gridArea: `n${note}`
          }"
        >
          {{ note }}
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { CellState, CellPosition } from '../types/sudoku';
import { useSudokuStore } from '../stores/sudoku';

const props = defineProps<{
  cell: CellState;
  row: number;
  col: number;
}>();

const sudokuStore = useSudokuStore();

const isSelected = computed(() => {
  const selectedCell = sudokuStore.selectedCell;
  return selectedCell !== null && selectedCell.row === props.row && selectedCell.col === props.col;
});

const isSameRow = computed(() => {
  const selectedCell = sudokuStore.selectedCell;
  return selectedCell !== null && selectedCell.row === props.row && selectedCell.col !== props.col;
});

const isSameCol = computed(() => {
  const selectedCell = sudokuStore.selectedCell;
  return selectedCell !== null && selectedCell.col === props.col && selectedCell.row !== props.row;
});

const isSameBox = computed(() => {
  const selectedCell = sudokuStore.selectedCell;
  if (selectedCell === null) return false;
  
  const boxRow = Math.floor(props.row / 3);
  const boxCol = Math.floor(props.col / 3);
  const selectedBoxRow = Math.floor(selectedCell.row / 3);
  const selectedBoxCol = Math.floor(selectedCell.col / 3);
  
  return boxRow === selectedBoxRow && boxCol === selectedBoxCol &&
         (selectedCell.row !== props.row || selectedCell.col !== props.col);
});

const isSameValue = computed(() => {
  const selectedCell = sudokuStore.selectedCell;
  if (selectedCell === null) return false;
  
  const selectedCellValue = sudokuStore.gameState[selectedCell.row][selectedCell.col].value;
  return selectedCellValue !== null && selectedCellValue === props.cell.value;
});

const isCompletedDigit = computed(() => {
  if (props.cell.value === null) return false;
  
  const digitIndex = props.cell.value - 1;
  return sudokuStore.digitCounts[digitIndex]?.completed || false;
});

const sortedNotes = computed(() => {
  return [...props.cell.notes].sort((a, b) => a - b);
});

const handleClick = () => {
  sudokuStore.selectCell(props.row, props.col);
};
</script>

<style scoped>
.sudoku-cell {
  @apply flex items-center justify-center w-full h-full border border-gray-300 text-lg md:text-xl lg:text-2xl font-bold cursor-pointer relative transition-colors duration-150;
  aspect-ratio: 1 / 1;
}

.original {
  @apply bg-blue-50 text-blue-800 font-extrabold;
}

.error {
  @apply bg-red-100 text-red-700;
}

.highlighted {
  @apply bg-yellow-100;
}

.selected {
  @apply bg-blue-200 border-blue-500;
}

.same-row, .same-col, .same-box {
  @apply bg-blue-50;
}

.same-value {
  @apply bg-green-100 text-green-800;
}

.border-right {
  @apply border-r-2 border-r-gray-800;
}

.border-bottom {
  @apply border-b-2 border-b-gray-800;
}

.completed-digit {
  @apply text-gray-500;
}

.notes-container {
  @apply grid grid-cols-3 grid-rows-3 w-full h-full text-[0.5rem] sm:text-xs text-gray-600 p-0.5;
}

.note {
  @apply flex items-center justify-center text-gray-500 font-medium;
}
</style> 