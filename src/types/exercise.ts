export interface Exercise {
  id: string;
  date: string; // YYYY-MM-DD (UTC)
  type: string;
  minutes: number;
  intensity: 1 | 2 | 3; // 1: 낮음, 2: 중간, 3: 높음
  memo?: string;
  createdAt: string; // UTC timestamp
}

export type ExerciseType = {
  id: string;
  name: string;
  defaultIntensity: 1 | 2 | 3;
}

export type WeeklyStats = {
  weekStart: string; // YYYY-MM-DD (ISO week start)
  completedDays: number;
  totalMinutes: number;
  goal: number; // 주 5회 목표
}

export type MonthlyStats = {
  year: number;
  month: number;
  completedDays: number;
  totalMinutes: number;
  totalDays: number; // 해당 월의 총 일수
}

export type StreakInfo = {
  current: number;
  longest: number;
  lastUpdated: string; // YYYY-MM-DD
}

export type ViewMode = 'weekly' | 'monthly';

export interface AppState {
  exercises: Exercise[];
  exerciseTypes: ExerciseType[];
  viewMode: ViewMode;
  currentDate: Date;
  loading: boolean;
  
  // Supabase helpers
  getUserId: () => Promise<string | null>;
  loadExercises: () => Promise<void>;
  loadExerciseTypes: () => Promise<void>;
  
  // Actions
  addExercise: (exercise: Omit<Exercise, 'id' | 'createdAt'>) => Promise<void>;
  updateExercise: (id: string, exercise: Partial<Exercise>) => Promise<void>;
  deleteExercise: (id: string) => Promise<void>;
  setViewMode: (mode: ViewMode) => void;
  setCurrentDate: (date: Date) => void;
  addExerciseType: (type: Omit<ExerciseType, 'id'>) => Promise<void>;
  
  // Computed values
  getWeeklyStats: (weekStart: string) => WeeklyStats;
  getMonthlyStats: (year: number, month: number) => MonthlyStats;
  getStreakInfo: () => StreakInfo;
  getExercisesForDate: (date: string) => Exercise[];
  getExercisesForWeek: (weekStart: string) => Exercise[];
}