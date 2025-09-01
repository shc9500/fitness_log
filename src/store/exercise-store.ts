import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppState, Exercise, ExerciseType, ViewMode } from '@/types/exercise';
import { 
  calculateWeeklyStats, 
  calculateMonthlyStats, 
  calculateStreak,
  getExercisesForDate,
  getExercisesForWeek,
  DEFAULT_EXERCISE_TYPES,
  generateId
} from '@/lib/exercise-utils';
import { getISOWeekStart, getTodayUTC } from '@/lib/date-utils';
import { createClient } from '@/lib/supabase/client';
import type { Exercise as SupabaseExercise, ExerciseInsert, ExerciseType as SupabaseExerciseType } from '@/lib/supabase/types';

export const useExerciseStore = create<AppState>()(
  persist(
    (set, get) => ({
      exercises: [],
      exerciseTypes: DEFAULT_EXERCISE_TYPES,
      viewMode: 'weekly',
      currentDate: new Date(),
      loading: false,

      // Supabase helpers
      getUserId: async () => {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        return user?.id || null;
      },

      loadExercises: async () => {
        const userId = await get().getUserId();
        if (!userId) return;

        set({ loading: true });
        const supabase = createClient();

        try {
          const { data: exercises, error } = await (supabase as any)
            .from('exercises')
            .select('*')
            .eq('user_id', userId)
            .order('date', { ascending: false });

          if (error) throw error;

          const mappedExercises = exercises.map((ex: SupabaseExercise): Exercise => ({
            id: ex.id,
            date: ex.date,
            type: ex.type,
            minutes: ex.minutes,
            intensity: ex.intensity,
            memo: ex.memo || undefined,
            createdAt: ex.created_at,
          }));

          set({ exercises: mappedExercises });
        } catch (error) {
          console.error('Error loading exercises:', error);
        } finally {
          set({ loading: false });
        }
      },

      loadExerciseTypes: async () => {
        const userId = await get().getUserId();
        if (!userId) return;

        const supabase = createClient();

        try {
          const { data: types, error } = await (supabase as any)
            .from('exercise_types')
            .select('*')
            .eq('user_id', userId);

          if (error) throw error;

          const mappedTypes = types.map((type: SupabaseExerciseType): ExerciseType => ({
            id: type.id,
            name: type.name,
            defaultIntensity: type.default_intensity,
          }));

          const allTypes = [...DEFAULT_EXERCISE_TYPES, ...mappedTypes];
          set({ exerciseTypes: allTypes });
        } catch (error) {
          console.error('Error loading exercise types:', error);
        }
      },

      // Actions
      addExercise: async (exerciseData) => {
        const userId = await get().getUserId();
        if (!userId) return;

        const supabase = createClient();
        
        try {
          const exerciseInsert: ExerciseInsert = {
            user_id: userId,
            date: exerciseData.date,
            type: exerciseData.type,
            minutes: exerciseData.minutes,
            intensity: exerciseData.intensity,
            memo: exerciseData.memo,
          };

          const { data, error } = await (supabase as any)
            .from('exercises')
            .insert(exerciseInsert)
            .select()
            .single();

          if (error) throw error;

          const exercise: Exercise = {
            id: (data as any).id,
            date: (data as any).date,
            type: (data as any).type,
            minutes: (data as any).minutes,
            intensity: (data as any).intensity,
            memo: (data as any).memo || undefined,
            createdAt: (data as any).created_at,
          };

          set(state => ({
            exercises: [...state.exercises, exercise]
          }));
        } catch (error) {
          console.error('Error adding exercise:', error);
          // Fallback to local storage
          const exercise: Exercise = {
            ...exerciseData,
            id: generateId(),
            createdAt: new Date().toISOString(),
          };

          set(state => ({
            exercises: [...state.exercises, exercise]
          }));
        }
      },

      updateExercise: async (id, updates) => {
        const userId = await get().getUserId();
        if (!userId) return;

        const supabase = createClient();

        try {
          const { error } = await (supabase as any)
            .from('exercises')
            .update({
              date: updates.date,
              type: updates.type,
              minutes: updates.minutes,
              intensity: updates.intensity,
              memo: updates.memo,
            })
            .eq('id', id)
            .eq('user_id', userId);

          if (error) throw error;

          set(state => ({
            exercises: state.exercises.map(ex => 
              ex.id === id ? { ...ex, ...updates } : ex
            )
          }));
        } catch (error) {
          console.error('Error updating exercise:', error);
        }
      },

      deleteExercise: async (id) => {
        const userId = await get().getUserId();
        if (!userId) return;

        const supabase = createClient();

        try {
          const { error } = await (supabase as any)
            .from('exercises')
            .delete()
            .eq('id', id)
            .eq('user_id', userId);

          if (error) throw error;

          set(state => ({
            exercises: state.exercises.filter(ex => ex.id !== id)
          }));
        } catch (error) {
          console.error('Error deleting exercise:', error);
        }
      },

      setViewMode: (mode) => {
        set({ viewMode: mode });
      },

      setCurrentDate: (date) => {
        set({ currentDate: date });
      },

      addExerciseType: async (typeData) => {
        const userId = await get().getUserId();
        if (!userId) return;

        const supabase = createClient();

        try {
          const typeInsert = {
            user_id: userId,
            name: typeData.name,
            default_intensity: typeData.defaultIntensity,
          };

          const { data, error } = await (supabase as any)
            .from('exercise_types')
            .insert(typeInsert)
            .select()
            .single();

          if (error) throw error;

          const exerciseType: ExerciseType = {
            id: (data as any).id,
            name: (data as any).name,
            defaultIntensity: (data as any).default_intensity,
          };

          set(state => ({
            exerciseTypes: [...state.exerciseTypes, exerciseType]
          }));
        } catch (error) {
          console.error('Error adding exercise type:', error);
          // Fallback to local storage
          const exerciseType: ExerciseType = {
            ...typeData,
            id: generateId(),
          };

          set(state => ({
            exerciseTypes: [...state.exerciseTypes, exerciseType]
          }));
        }
      },

      // Computed values
      getWeeklyStats: (weekStart) => {
        const { exercises } = get();
        return calculateWeeklyStats(exercises, weekStart);
      },

      getMonthlyStats: (year, month) => {
        const { exercises } = get();
        return calculateMonthlyStats(exercises, year, month);
      },

      getStreakInfo: () => {
        const { exercises } = get();
        return calculateStreak(exercises);
      },

      getExercisesForDate: (date) => {
        const { exercises } = get();
        return getExercisesForDate(exercises, date);
      },

      getExercisesForWeek: (weekStart) => {
        const { exercises } = get();
        return getExercisesForWeek(exercises, weekStart);
      },
    }),
    {
      name: 'fitness-log-storage',
      // currentDate는 persist하지 않음 (항상 새로운 세션에서 오늘 날짜로 시작)
      partialize: (state) => ({
        exercises: state.exercises,
        exerciseTypes: state.exerciseTypes,
        viewMode: state.viewMode,
      }),
    }
  )
);

// 편의 훅들
export const useCurrentWeekStats = () => {
  const currentDate = useExerciseStore(state => state.currentDate);
  const getWeeklyStats = useExerciseStore(state => state.getWeeklyStats);
  
  const weekStart = getISOWeekStart(currentDate);
  return getWeeklyStats(weekStart);
};

export const useCurrentMonthStats = () => {
  const currentDate = useExerciseStore(state => state.currentDate);
  const getMonthlyStats = useExerciseStore(state => state.getMonthlyStats);
  
  return getMonthlyStats(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1
  );
};

export const useTodayExercises = () => {
  const getExercisesForDate = useExerciseStore(state => state.getExercisesForDate);
  const today = getTodayUTC();
  return getExercisesForDate(today);
};