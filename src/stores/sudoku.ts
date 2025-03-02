import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { 
  SudokuGrid, 
  GameRecord, 
  CellPosition, 
  SudokuState,
  DigitCount
} from '../types/sudoku';
import { Difficulty, DIFFICULTY_CONFIG } from '../types/sudoku';

const GRID_SIZE = 9;
const BOX_SIZE = 3;
const MAX_HINTS = 10;
const BASE_HINT_PENALTY = 3;
const ERROR_PENALTY = 1;
const CORRECT_CELL_POINTS = 5;
const TIME_BONUS_BASE = 500;

export const useSudokuStore = defineStore('sudoku', () => {
  // State
  const grid = ref<SudokuGrid>(Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null)));
  const solution = ref<SudokuGrid>(Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null)));
  const gameState = ref<SudokuState>(
    Array(GRID_SIZE).fill(null).map(() => 
      Array(GRID_SIZE).fill(null).map(() => ({
        value: null,
        isOriginal: false,
        isError: false,
        isHighlighted: false,
        notes: []
      }))
    )
  );
  
  const difficulty = ref<Difficulty>(Difficulty.BEGINNER);
  const gameStarted = ref<boolean>(false);
  const gameCompleted = ref<boolean>(false);
  const gamePaused = ref<boolean>(false);
  const startTime = ref<number>(0);
  const elapsedTime = ref<number>(0);
  const timerInterval = ref<number | null>(null);
  
  const score = ref<number>(0);
  const hintsUsed = ref<number>(0);
  const errors = ref<number>(0);
  
  const selectedCell = ref<CellPosition | null>(null);
  const records = ref<GameRecord[]>([]);
  const digitCounts = ref<DigitCount[]>([]);
  
  const isInDraftMode = ref<boolean>(false);
  const moveHistory = ref<{action: string, position: CellPosition, prevValue: number | null, newValue: number | null}[]>([]);
  const currentHistoryIndex = ref<number>(-1);

  // Load records from localStorage
  const loadRecords = () => {
    const savedRecords = localStorage.getItem('sudokuRecords');
    if (savedRecords) {
      records.value = JSON.parse(savedRecords);
    }
  };

  // Save records to localStorage
  const saveRecords = () => {
    localStorage.setItem('sudokuRecords', JSON.stringify(records.value));
  };

  // Initialize digit counts
  const initDigitCounts = () => {
    digitCounts.value = Array.from({ length: 9 }, (_, i) => ({
      digit: i + 1,
      count: 0,
      completed: false
    }));
    
    // Count pre-filled cells
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        const value = gameState.value[row][col].value;
        if (value !== null) {
          incrementDigitCount(value);
        }
      }
    }
  };

  // Update digit count
  const incrementDigitCount = (digit: number) => {
    const digitIndex = digit - 1;
    if (digitIndex >= 0 && digitIndex < 9) {
      digitCounts.value[digitIndex].count++;
      if (digitCounts.value[digitIndex].count >= 9) {
        digitCounts.value[digitIndex].completed = true;
      }
    }
  };

  const decrementDigitCount = (digit: number) => {
    const digitIndex = digit - 1;
    if (digitIndex >= 0 && digitIndex < 9) {
      digitCounts.value[digitIndex].count--;
      digitCounts.value[digitIndex].completed = false;
    }
  };

  // Generate a valid Sudoku solution
  const generateSolution = () => {
    // Clear the grid
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        solution.value[i][j] = null;
      }
    }

    // Fill the diagonal boxes first (these can be filled independently)
    for (let box = 0; box < GRID_SIZE; box += BOX_SIZE) {
      fillBox(box, box);
    }

    // Fill the rest of the grid
    solveSudoku();

    return [...solution.value];
  };

  // Fill a 3x3 box with random numbers
  const fillBox = (row: number, col: number) => {
    const nums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    let index = 0;
    
    for (let i = 0; i < BOX_SIZE; i++) {
      for (let j = 0; j < BOX_SIZE; j++) {
        solution.value[row + i][col + j] = nums[index++];
      }
    }
  };

  // Shuffle an array using Fisher-Yates algorithm
  const shuffle = <T>(array: T[]): T[] => {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  };

  // Solve the Sudoku using backtracking
  const solveSudoku = (): boolean => {
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        if (solution.value[row][col] === null) {
          const nums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
          
          for (const num of nums) {
            if (isValidPlacement(row, col, num)) {
              solution.value[row][col] = num;
              
              if (solveSudoku()) {
                return true;
              }
              
              solution.value[row][col] = null;
            }
          }
          
          return false;
        }
      }
    }
    
    return true;
  };

  // Check if a number can be placed at a specific position
  const isValidPlacement = (row: number, col: number, num: number): boolean => {
    // Check row
    for (let i = 0; i < GRID_SIZE; i++) {
      if (solution.value[row][i] === num) {
        return false;
      }
    }
    
    // Check column
    for (let i = 0; i < GRID_SIZE; i++) {
      if (solution.value[i][col] === num) {
        return false;
      }
    }
    
    // Check 3x3 box
    const boxRow = Math.floor(row / BOX_SIZE) * BOX_SIZE;
    const boxCol = Math.floor(col / BOX_SIZE) * BOX_SIZE;
    
    for (let i = 0; i < BOX_SIZE; i++) {
      for (let j = 0; j < BOX_SIZE; j++) {
        if (solution.value[boxRow + i][boxCol + j] === num) {
          return false;
        }
      }
    }
    
    return true;
  };

  // Create a new game with the specified difficulty
  const newGame = (selectedDifficulty: Difficulty) => {
    difficulty.value = selectedDifficulty;
    gameStarted.value = true;
    gameCompleted.value = false;
    gamePaused.value = false;
    score.value = 0;
    hintsUsed.value = 0;
    errors.value = 0;
    selectedCell.value = null;
    moveHistory.value = [];
    currentHistoryIndex.value = -1;
    
    // Generate a complete solution
    generateSolution();
    
    // Create a new game state with some cells revealed based on difficulty
    const { minVisible, maxVisible } = DIFFICULTY_CONFIG[difficulty.value];
    const visibleCells = Math.floor(Math.random() * (maxVisible - minVisible + 1)) + minVisible;
    
    // Initialize game state with all cells empty
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        gameState.value[row][col] = {
          value: null,
          isOriginal: false,
          isError: false,
          isHighlighted: false,
          notes: []
        };
      }
    }
    
    // Randomly reveal cells
    const positions = [];
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        positions.push({ row, col });
      }
    }
    
    shuffle(positions);
    
    for (let i = 0; i < visibleCells; i++) {
      const { row, col } = positions[i];
      gameState.value[row][col].value = solution.value[row][col];
      gameState.value[row][col].isOriginal = true;
    }
    
    // Initialize digit counts
    initDigitCounts();
    
    // Start the timer
    startTimer();
  };

  // Start the game timer
  const startTimer = () => {
    startTime.value = Date.now();
    elapsedTime.value = 0;
    
    if (timerInterval.value) {
      clearInterval(timerInterval.value);
    }
    
    timerInterval.value = window.setInterval(() => {
      if (!gamePaused.value) {
        elapsedTime.value = Math.floor((Date.now() - startTime.value) / 1000);
      }
    }, 1000);
  };

  // Pause the game
  const pauseGame = () => {
    gamePaused.value = true;
  };

  // Resume the game
  const resumeGame = () => {
    gamePaused.value = false;
  };

  // Select a cell
  const selectCell = (row: number, col: number) => {
    if (!gameStarted.value || gameCompleted.value || gamePaused.value) {
      return;
    }
    
    selectedCell.value = { row, col };
  };

  // Check if a cell is valid for a given value
  const isValidCell = (row: number, col: number, value: number): boolean => {
    // Check row
    for (let i = 0; i < GRID_SIZE; i++) {
      if (i !== col && gameState.value[row][i].value === value) {
        return false;
      }
    }
    
    // Check column
    for (let i = 0; i < GRID_SIZE; i++) {
      if (i !== row && gameState.value[i][col].value === value) {
        return false;
      }
    }
    
    // Check 3x3 box
    const boxRow = Math.floor(row / BOX_SIZE) * BOX_SIZE;
    const boxCol = Math.floor(col / BOX_SIZE) * BOX_SIZE;
    
    for (let i = 0; i < BOX_SIZE; i++) {
      for (let j = 0; j < BOX_SIZE; j++) {
        const r = boxRow + i;
        const c = boxCol + j;
        if (r !== row || c !== col) {
          if (gameState.value[r][c].value === value) {
            return false;
          }
        }
      }
    }
    
    return true;
  };

  // Set a value in a cell
  const setCellValue = (row: number, col: number, value: number | null) => {
    if (!gameStarted.value || gameCompleted.value || gamePaused.value) {
      return;
    }
    
    if (gameState.value[row][col].isOriginal) {
      return;
    }
    
    const prevValue = gameState.value[row][col].value;
    
    // Add to move history for undo/redo
    if (currentHistoryIndex.value < moveHistory.value.length - 1) {
      // If we're in the middle of the history, truncate it
      moveHistory.value = moveHistory.value.slice(0, currentHistoryIndex.value + 1);
    }
    
    moveHistory.value.push({
      action: 'setValue',
      position: { row, col },
      prevValue,
      newValue: value
    });
    
    currentHistoryIndex.value = moveHistory.value.length - 1;
    
    // Update digit counts
    if (prevValue !== null) {
      decrementDigitCount(prevValue);
    }
    
    if (value !== null) {
      incrementDigitCount(value);
    }
    
    // Set the value
    gameState.value[row][col].value = value;
    
    // Check if the value is correct
    if (value !== null) {
      const isCorrect = value === solution.value[row][col];
      gameState.value[row][col].isError = !isCorrect;
      
      if (isCorrect) {
        score.value += CORRECT_CELL_POINTS;
      } else {
        score.value = Math.max(0, score.value - ERROR_PENALTY);
        errors.value++;
      }
    } else {
      gameState.value[row][col].isError = false;
    }
    
    // Check if the game is completed
    checkGameCompletion();
  };

  // Toggle a note in a cell
  const toggleNote = (row: number, col: number, value: number) => {
    if (!gameStarted.value || gameCompleted.value || gamePaused.value || !isInDraftMode.value) {
      return;
    }
    
    if (gameState.value[row][col].isOriginal || gameState.value[row][col].value !== null) {
      return;
    }
    
    const noteIndex = gameState.value[row][col].notes.indexOf(value);
    
    // Add to move history for undo/redo
    if (currentHistoryIndex.value < moveHistory.value.length - 1) {
      // If we're in the middle of the history, truncate it
      moveHistory.value = moveHistory.value.slice(0, currentHistoryIndex.value + 1);
    }
    
    moveHistory.value.push({
      action: 'toggleNote',
      position: { row, col },
      prevValue: noteIndex !== -1 ? value : null,
      newValue: noteIndex === -1 ? value : null
    });
    
    currentHistoryIndex.value = moveHistory.value.length - 1;
    
    if (noteIndex === -1) {
      gameState.value[row][col].notes.push(value);
    } else {
      gameState.value[row][col].notes.splice(noteIndex, 1);
    }
  };

  // Use a hint
  const useHint = () => {
    if (!gameStarted.value || gameCompleted.value || gamePaused.value || hintsUsed.value >= MAX_HINTS) {
      return;
    }
    
    if (!selectedCell.value) {
      return;
    }
    
    const { row, col } = selectedCell.value;
    
    if (gameState.value[row][col].isOriginal || gameState.value[row][col].value === solution.value[row][col]) {
      return;
    }
    
    // Calculate hint penalty
    const hintPenalty = BASE_HINT_PENALTY + hintsUsed.value;
    score.value = Math.max(0, score.value - hintPenalty);
    
    hintsUsed.value++;
    
    // Set the correct value
    setCellValue(row, col, solution.value[row][col]);
  };

  // Check if the game is completed
  const checkGameCompletion = () => {
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        if (gameState.value[row][col].value !== solution.value[row][col]) {
          return;
        }
      }
    }
    
    // Game completed
    gameCompleted.value = true;
    
    // Stop the timer
    if (timerInterval.value) {
      clearInterval(timerInterval.value);
      timerInterval.value = null;
    }
    
    // Calculate final score
    const timeBonus = Math.max(0, TIME_BONUS_BASE - elapsedTime.value);
    score.value += timeBonus;
    
    // Add to records if eligible
    addRecord();
  };

  // Add a record to the leaderboard
  const addRecord = () => {
    // Only add successful games to the records
    if (!gameCompleted.value) {
      return;
    }
    
    // Prompt for player name
    const playerName = prompt('Congratulations! Enter your name for the leaderboard:') || 'Anonymous';
    
    const newRecord: GameRecord = {
      playerName,
      score: score.value,
      difficulty: difficulty.value,
      time: elapsedTime.value,
      date: new Date().toISOString()
    };
    
    records.value.push(newRecord);
    
    // Sort records by score (descending)
    records.value.sort((a, b) => b.score - a.score);
    
    // Keep only the top 3 records for each difficulty
    const topRecords: GameRecord[] = [];
    const difficultyRecords: Record<Difficulty, GameRecord[]> = {
      [Difficulty.BEGINNER]: [],
      [Difficulty.INTERMEDIATE]: [],
      [Difficulty.HARD]: [],
      [Difficulty.EXPERT]: []
    };
    
    for (const record of records.value) {
      difficultyRecords[record.difficulty].push(record);
    }
    
    for (const difficulty in difficultyRecords) {
      topRecords.push(...difficultyRecords[difficulty as Difficulty].slice(0, 3));
    }
    
    records.value = topRecords;
    
    // Save records to localStorage
    saveRecords();
  };

  // Undo the last move
  const undo = () => {
    if (!gameStarted.value || gameCompleted.value || gamePaused.value || currentHistoryIndex.value < 0) {
      return;
    }
    
    const move = moveHistory.value[currentHistoryIndex.value];
    const { action, position, prevValue } = move;
    const { row, col } = position;
    
    if (action === 'setValue') {
      // Update digit counts
      const currentValue = gameState.value[row][col].value;
      if (currentValue !== null) {
        decrementDigitCount(currentValue);
      }
      
      if (prevValue !== null) {
        incrementDigitCount(prevValue);
      }
      
      gameState.value[row][col].value = prevValue;
      gameState.value[row][col].isError = prevValue !== null && prevValue !== solution.value[row][col];
    } else if (action === 'toggleNote') {
      const noteIndex = gameState.value[row][col].notes.indexOf(move.newValue as number);
      
      if (noteIndex !== -1) {
        gameState.value[row][col].notes.splice(noteIndex, 1);
      } else if (prevValue !== null) {
        gameState.value[row][col].notes.push(prevValue);
      }
    }
    
    currentHistoryIndex.value--;
  };

  // Redo the last undone move
  const redo = () => {
    if (!gameStarted.value || gameCompleted.value || gamePaused.value || currentHistoryIndex.value >= moveHistory.value.length - 1) {
      return;
    }
    
    currentHistoryIndex.value++;
    
    const move = moveHistory.value[currentHistoryIndex.value];
    const { action, position, newValue } = move;
    const { row, col } = position;
    
    if (action === 'setValue') {
      // Update digit counts
      const currentValue = gameState.value[row][col].value;
      if (currentValue !== null) {
        decrementDigitCount(currentValue);
      }
      
      if (newValue !== null) {
        incrementDigitCount(newValue as number);
      }
      
      gameState.value[row][col].value = newValue;
      gameState.value[row][col].isError = newValue !== null && newValue !== solution.value[row][col];
    } else if (action === 'toggleNote') {
      const noteIndex = gameState.value[row][col].notes.indexOf(newValue as number);
      
      if (noteIndex === -1 && newValue !== null) {
        gameState.value[row][col].notes.push(newValue as number);
      } else if (noteIndex !== -1) {
        gameState.value[row][col].notes.splice(noteIndex, 1);
      }
    }
  };

  // Toggle draft mode
  const toggleDraftMode = () => {
    isInDraftMode.value = !isInDraftMode.value;
  };

  // Format time as MM:SS
  const formattedTime = computed(() => {
    const minutes = Math.floor(elapsedTime.value / 60);
    const seconds = elapsedTime.value % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  });

  // Get top records for a specific difficulty
  const getTopRecords = (difficultyLevel: Difficulty) => {
    return records.value
      .filter(record => record.difficulty === difficultyLevel)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  };

  // Get all top records
  const getAllTopRecords = computed(() => {
    const result: Record<Difficulty, GameRecord[]> = {
      [Difficulty.BEGINNER]: [],
      [Difficulty.INTERMEDIATE]: [],
      [Difficulty.HARD]: [],
      [Difficulty.EXPERT]: []
    };
    
    for (const difficulty in Difficulty) {
      const difficultyValue = Difficulty[difficulty as keyof typeof Difficulty];
      result[difficultyValue] = getTopRecords(difficultyValue);
    }
    
    return result;
  });

  // Initialize the store
  const initialize = () => {
    loadRecords();
  };

  // Call initialize when the store is created
  initialize();

  return {
    grid,
    solution,
    gameState,
    difficulty,
    gameStarted,
    gameCompleted,
    gamePaused,
    elapsedTime,
    score,
    hintsUsed,
    errors,
    selectedCell,
    records,
    digitCounts,
    isInDraftMode,
    formattedTime,
    getAllTopRecords,
    newGame,
    pauseGame,
    resumeGame,
    selectCell,
    setCellValue,
    toggleNote,
    useHint,
    undo,
    redo,
    toggleDraftMode
  };
}); 