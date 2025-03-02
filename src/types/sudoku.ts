export type CellValue = number | null;

export type SudokuGrid = CellValue[][];

export enum Difficulty {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  HARD = 'hard',
  EXPERT = 'expert'
}

export interface DifficultyConfig {
  minVisible: number;
  maxVisible: number;
}

export const DIFFICULTY_CONFIG: Record<Difficulty, DifficultyConfig> = {
  [Difficulty.BEGINNER]: { minVisible: 36, maxVisible: 40 },
  [Difficulty.INTERMEDIATE]: { minVisible: 32, maxVisible: 36 },
  [Difficulty.HARD]: { minVisible: 28, maxVisible: 32 },
  [Difficulty.EXPERT]: { minVisible: 24, maxVisible: 28 }
};

export interface GameRecord {
  playerName: string;
  score: number;
  difficulty: Difficulty;
  time: number;
  date: string;
}

export interface CellPosition {
  row: number;
  col: number;
}

export interface CellState {
  value: CellValue;
  isOriginal: boolean;
  isError: boolean;
  isHighlighted: boolean;
  notes: number[];
}

export type SudokuState = CellState[][];

export interface DigitCount {
  digit: number;
  count: number;
  completed: boolean;
} 