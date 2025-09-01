'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useExerciseStore, useCurrentMonthStats } from '@/store/exercise-store';
import { 
  getMonthDays, 
  formatDateForDisplay, 
  isTodayDate,
  getDayName,
  formatDateForHeader
} from '@/lib/date-utils';
import { INTENSITY_CONFIG } from '@/lib/exercise-utils';
import { Exercise } from '@/types/exercise';
import ExerciseDialog from './ExerciseDialog';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

export default function MonthlyCalendar() {
  const { currentDate, setCurrentDate, getExercisesForDate } = useExerciseStore();
  const exercises = useExerciseStore(state => state.exercises);
  const monthlyStats = useCurrentMonthStats();
  
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [dialogMode, setDialogMode] = useState<'edit' | 'view'>('view');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;
  const monthDays = getMonthDays(year, month);

  const handleExerciseClick = (exercise: Exercise, mode: 'edit' | 'view' = 'view') => {
    setSelectedExercise(exercise);
    setDialogMode(mode);
  };

  const handleCloseDialog = () => {
    setSelectedExercise(null);
  };

  const goToPrevMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  const goToNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // 월의 첫날이 무슨 요일인지 확인 (0: 일요일, 1: 월요일, ...)
  const firstDayOfMonth = new Date(year, month - 1, 1).getDay();
  
  // 캘린더 그리드를 위한 빈 셀들
  const emptyCells = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  // 캘린더를 주 단위로 나누기
  const calendarWeeks: (string | null)[][] = [];
  let currentWeek: (string | null)[] = [...emptyCells.map(() => null), ...monthDays.slice(0, 7 - firstDayOfMonth)];
  
  let dayIndex = 7 - firstDayOfMonth;
  calendarWeeks.push(currentWeek);

  while (dayIndex < monthDays.length) {
    currentWeek = monthDays.slice(dayIndex, dayIndex + 7);
    // 주가 7일보다 적으면 null로 채우기
    while (currentWeek.length < 7) {
      currentWeek.push(null);
    }
    calendarWeeks.push(currentWeek);
    dayIndex += 7;
  }

  const weekDayLabels = ['일', '월', '화', '수', '목', '금', '토'];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold flex items-center gap-3">
            <Calendar className="w-5 h-5" />
            월간 캘린더
          </CardTitle>
          
          {/* 월 네비게이션 */}
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={goToPrevMonth} className="h-9 px-3">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <div className="flex items-center gap-2 min-w-[140px] justify-center">
              <span className="font-semibold text-lg">
                {formatDateForHeader(monthDays[0])}
              </span>
            </div>
            
            <Button variant="outline" size="sm" onClick={goToNextMonth} className="h-9 px-3">
              <ChevronRight className="w-4 h-4" />
            </Button>
            
            <Button variant="ghost" size="sm" onClick={goToToday} className="h-9 px-3 text-sm">
              오늘
            </Button>
          </div>
        </div>

        {/* 월간 요약 */}
        <div className="flex items-center gap-4 text-base flex-wrap">
          <Badge variant="outline" className="font-medium px-3 py-1">
            완료일: {monthlyStats.completedDays}/{monthlyStats.totalDays}
          </Badge>
          <Badge variant="outline" className="font-medium px-3 py-1">
            총 시간: {monthlyStats.totalMinutes}분
          </Badge>
          <Badge variant="outline" className="font-medium px-3 py-1">
            완료율: {Math.round((monthlyStats.completedDays / monthlyStats.totalDays) * 100)}%
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {/* 요일 헤더 */}
          <div className="grid grid-cols-7 gap-1">
            {weekDayLabels.map((day, index) => (
              <div
                key={day}
                className={cn(
                  "text-center text-sm font-medium py-3",
                  index === 0 ? "text-red-500" : "text-gray-500"
                )}
              >
                {day}
              </div>
            ))}
          </div>

          {/* 캘린더 그리드 */}
          <div className="space-y-1">
            {calendarWeeks.map((week, weekIndex) => (
              <div key={weekIndex} className="grid grid-cols-7 gap-1">
                {week.map((date, dayIndex) => {
                  if (!date) {
                    return <div key={`empty-${weekIndex}-${dayIndex}`} className="h-20"></div>;
                  }

                  const dayExercises = getExercisesForDate(date);
                  const hasExercise = dayExercises.length > 0;
                  const totalMinutes = dayExercises.reduce((sum, ex) => sum + ex.minutes, 0);
                  const isToday = isTodayDate(date);
                  const dayOfWeek = dayIndex;
                  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

                  return (
                    <div
                      key={date}
                      className={cn(
                        "h-20 p-2 border rounded-lg transition-colors cursor-pointer relative",
                        isToday && "border-blue-500 bg-blue-50",
                        hasExercise && !isToday && "border-green-200 bg-green-50",
                        !hasExercise && !isToday && "border-gray-200 bg-white hover:bg-gray-50"
                      )}
                      onClick={() => {
                        if (hasExercise && dayExercises.length > 0) {
                          handleExerciseClick(dayExercises[0], 'edit');
                        }
                      }}
                    >
                      {/* 날짜 */}
                      <div
                        className={cn(
                          "text-sm font-medium",
                          isToday && "text-blue-600",
                          hasExercise && !isToday && "text-green-600",
                          !hasExercise && !isToday && (isWeekend ? "text-red-500" : "text-gray-700")
                        )}
                      >
                        {new Date(date).getDate()}
                      </div>

                      {/* 운동 기록 표시 */}
                      {hasExercise && (
                        <div className="mt-1">
                          {/* 완료 표시 점 */}
                          <div className="flex justify-center mb-1">
                            <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
                          </div>

                          {/* 시간 표시 */}
                          <div className="text-center">
                            <div className="text-sm font-semibold text-green-600">
                              {totalMinutes}분
                            </div>
                          </div>

                          {/* 강도별 점들 (최대 5개) */}
                          {dayExercises.length > 0 && (
                            <div className="flex justify-center gap-px mt-1 flex-wrap">
                              {dayExercises.slice(0, 5).map((exercise, index) => (
                                <div
                                  key={`${exercise.id}-${index}`}
                                  className={cn(
                                    "w-1.5 h-1.5 rounded-full cursor-pointer",
                                    INTENSITY_CONFIG[exercise.intensity].dotColor
                                  )}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleExerciseClick(exercise, 'edit');
                                  }}
                                />
                              ))}
                              {dayExercises.length > 5 && (
                                <div className="text-xs text-gray-400 ml-1">+{dayExercises.length - 5}</div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* 범례 */}
          <div className="pt-4 border-t">
            <div className="text-xs text-gray-500 mb-2">범례</div>
            <div className="flex flex-wrap gap-4 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 border-2 border-blue-500 bg-blue-50 rounded"></div>
                <span>오늘</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>운동 완료</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                  <span>낮음</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-1 h-1 bg-yellow-500 rounded-full"></div>
                  <span>중간</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                  <span>높음</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Exercise Dialog */}
        <ExerciseDialog
          exercise={selectedExercise}
          isOpen={!!selectedExercise}
          onClose={handleCloseDialog}
          mode={dialogMode}
        />
      </CardContent>
    </Card>
  );
}