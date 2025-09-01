import { Exercise, WeeklyStats, MonthlyStats, StreakInfo } from '@/types/exercise';
import { 
  getISOWeekStart, 
  getWeekDays, 
  getMonthDays, 
  getTodayUTC,
  isTodayDate,
  toUTCDateString
} from './date-utils';

// 주간 통계 계산
export function calculateWeeklyStats(
  exercises: Exercise[], 
  weekStart: string
): WeeklyStats {
  const weekDays = getWeekDays(weekStart);
  const weekExercises = exercises.filter(ex => 
    weekDays.includes(ex.date)
  );
  
  // 운동한 유니크한 날짜 수 계산 (하루에 여러 운동해도 1일로 카운트)
  const completedDays = new Set(weekExercises.map(ex => ex.date)).size;
  const totalMinutes = weekExercises.reduce((sum, ex) => sum + ex.minutes, 0);
  
  return {
    weekStart,
    completedDays,
    totalMinutes,
    goal: 5 // 주 5회 목표
  };
}

// 월간 통계 계산
export function calculateMonthlyStats(
  exercises: Exercise[], 
  year: number, 
  month: number
): MonthlyStats {
  const monthDays = getMonthDays(year, month);
  const monthExercises = exercises.filter(ex => 
    monthDays.includes(ex.date)
  );
  
  const completedDays = new Set(monthExercises.map(ex => ex.date)).size;
  const totalMinutes = monthExercises.reduce((sum, ex) => sum + ex.minutes, 0);
  
  return {
    year,
    month,
    completedDays,
    totalMinutes,
    totalDays: monthDays.length
  };
}

// 연속일(streak) 계산
export function calculateStreak(exercises: Exercise[]): StreakInfo {
  if (exercises.length === 0) {
    return { current: 0, longest: 0, lastUpdated: getTodayUTC() };
  }

  // 운동한 유니크한 날짜들을 최근순으로 정렬
  const uniqueDates = Array.from(
    new Set(exercises.map(ex => ex.date))
  ).sort((a, b) => b.localeCompare(a)); // 내림차순 정렬

  if (uniqueDates.length === 0) {
    return { current: 0, longest: 0, lastUpdated: getTodayUTC() };
  }

  const today = getTodayUTC();
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;

  // 현재 연속일 계산 (오늘부터 과거로)
  // eslint-disable-next-line prefer-const
  let checkDate = new Date();
  const dateStr = toUTCDateString(checkDate);
  
  // 오늘 운동했는지 확인
  if (uniqueDates.includes(dateStr)) {
    currentStreak = 1;
    checkDate.setDate(checkDate.getDate() - 1);
    
    // 이전 날짜들 확인
    while (true) {
      const prevDateStr = toUTCDateString(checkDate);
      if (uniqueDates.includes(prevDateStr)) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
  }

  // 최장 연속일 계산
  tempStreak = 1;
  longestStreak = 1;
  
  for (let i = 1; i < uniqueDates.length; i++) {
    const currentDate = new Date(uniqueDates[i]);
    const prevDate = new Date(uniqueDates[i - 1]);
    
    // 하루 차이인지 확인
    const diffTime = prevDate.getTime() - currentDate.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    
    if (diffDays === 1) {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 1;
    }
  }

  return {
    current: currentStreak,
    longest: Math.max(longestStreak, currentStreak),
    lastUpdated: today
  };
}

// 특정 날짜의 운동 기록 조회
export function getExercisesForDate(exercises: Exercise[], date: string): Exercise[] {
  return exercises.filter(ex => ex.date === date);
}

// 특정 주차의 운동 기록 조회
export function getExercisesForWeek(exercises: Exercise[], weekStart: string): Exercise[] {
  const weekDays = getWeekDays(weekStart);
  return exercises.filter(ex => weekDays.includes(ex.date));
}

// 기본 운동 타입들
export const DEFAULT_EXERCISE_TYPES = [
  { id: '1', name: '러닝', defaultIntensity: 2 as const },
  { id: '2', name: '헬스', defaultIntensity: 3 as const },
  { id: '3', name: '요가', defaultIntensity: 1 as const },
  { id: '4', name: '사이클링', defaultIntensity: 2 as const },
  { id: '5', name: '수영', defaultIntensity: 3 as const },
  { id: '6', name: '걷기', defaultIntensity: 1 as const },
];

// 강도별 색상/라벨
export const INTENSITY_CONFIG = {
  1: { label: '낮음', color: 'bg-green-100 text-green-800', dotColor: 'bg-green-500' },
  2: { label: '중간', color: 'bg-yellow-100 text-yellow-800', dotColor: 'bg-yellow-500' },
  3: { label: '높음', color: 'bg-red-100 text-red-800', dotColor: 'bg-red-500' },
};

// UUID 생성 (간단한 버전)
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}