'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useExerciseStore, useCurrentWeekStats } from '@/store/exercise-store';
import { getISOWeekStart, getWeekDays, getDayName, formatDateForDisplay, isTodayDate } from '@/lib/date-utils';
import { INTENSITY_CONFIG } from '@/lib/exercise-utils';
import { Exercise } from '@/types/exercise';
import ExerciseDialog from './ExerciseDialog';
import { cn } from '@/lib/utils';

export default function WeeklyBoard() {
  const currentDate = useExerciseStore(state => state.currentDate);
  const exercises = useExerciseStore(state => state.exercises);
  const getExercisesForDate = useExerciseStore(state => state.getExercisesForDate);
  const weeklyStats = useCurrentWeekStats();
  
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [dialogMode, setDialogMode] = useState<'edit' | 'view'>('view');

  const weekStart = getISOWeekStart(currentDate);
  const weekDays = getWeekDays(weekStart);

  const completionPercentage = (weeklyStats.completedDays / weeklyStats.goal) * 100;

  const handleExerciseClick = (exercise: Exercise, mode: 'edit' | 'view' = 'view') => {
    setSelectedExercise(exercise);
    setDialogMode(mode);
  };

  const handleCloseDialog = () => {
    setSelectedExercise(null);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold">주간 보드</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-medium text-sm px-3 py-1">
              {weeklyStats.completedDays}/{weeklyStats.goal}
            </Badge>
          </div>
        </div>
        
        {/* 진행도 바 */}
        <div className="space-y-3">
          <div className="flex justify-between text-base text-gray-600">
            <span>주간 목표 달성률</span>
            <span className="font-medium">{Math.round(completionPercentage)}%</span>
          </div>
          <Progress 
            value={completionPercentage} 
            className="h-3"
          />
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((date, index) => {
            const dayExercises = getExercisesForDate(date);
            const hasExercise = dayExercises.length > 0;
            const totalMinutes = dayExercises.reduce((sum, ex) => sum + ex.minutes, 0);
            const isToday = isTodayDate(date);
            
            return (
              <div
                key={date}
                className={cn(
                  "p-4 rounded-lg border-2 transition-colors min-h-[200px] flex flex-col",
                  isToday && "border-blue-500 bg-blue-50",
                  hasExercise && !isToday && "border-green-200 bg-green-50",
                  !hasExercise && !isToday && "border-gray-200 bg-white hover:bg-gray-50"
                )}
              >
                {/* 날짜 헤더 */}
                <div className="text-center mb-3">
                  <div className="text-sm text-gray-500 font-medium">
                    {getDayName(date)}
                  </div>
                  <div className={cn(
                    "text-base font-semibold",
                    isToday && "text-blue-600",
                    hasExercise && !isToday && "text-green-600",
                    !hasExercise && !isToday && "text-gray-700"
                  )}>
                    {formatDateForDisplay(date)}
                  </div>
                </div>

                {/* 운동 기록 */}
                <div className="flex-1 space-y-1">
                  {hasExercise ? (
                    <>
                      {/* 완료 표시 점 */}
                      <div className="flex justify-center mb-2">
                        <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                      </div>
                      
                      {/* 총 시간 */}
                      <div className="text-center mb-3">
                        <div className="text-xl font-bold text-green-600">
                          {totalMinutes}
                        </div>
                        <div className="text-sm text-gray-500">분</div>
                      </div>

                      {/* 운동 타입들 (최대 5개 표시) */}
                      <div className="space-y-1">
                        {dayExercises.slice(0, 5).map((exercise) => (
                          <div 
                            key={exercise.id} 
                            className="flex items-center justify-between text-sm cursor-pointer hover:bg-white hover:bg-opacity-50 rounded px-2 py-1 transition-colors"
                            onClick={() => handleExerciseClick(exercise, 'edit')}
                          >
                            <span className="truncate text-gray-600">
                              {exercise.type}
                            </span>
                            <div 
                              className={cn(
                                "w-2.5 h-2.5 rounded-full",
                                INTENSITY_CONFIG[exercise.intensity].dotColor
                              )}
                            />
                          </div>
                        ))}
                        
                        {dayExercises.length > 5 && (
                          <div 
                            className="text-sm text-gray-400 text-center cursor-pointer hover:text-gray-600 py-1"
                            onClick={() => handleExerciseClick(dayExercises[5], 'view')}
                          >
                            +{dayExercises.length - 5}개
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="flex-1 flex items-center justify-center">
                      <div className="text-center text-gray-400">
                        <div className="w-8 h-8 border-2 border-dashed border-gray-300 rounded-full mx-auto mb-2"></div>
                        <div className="text-sm">미완료</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* 주간 총계 */}
        <div className="mt-6 pt-5 border-t bg-gray-50 rounded-lg p-4">
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-base text-gray-500 mb-1">완료일</div>
              <div className="text-xl font-semibold text-green-600">
                {weeklyStats.completedDays}일
              </div>
            </div>
            <div>
              <div className="text-base text-gray-500 mb-1">총 시간</div>
              <div className="text-xl font-semibold text-blue-600">
                {weeklyStats.totalMinutes}분
              </div>
            </div>
            <div>
              <div className="text-base text-gray-500 mb-1">평균</div>
              <div className="text-xl font-semibold text-purple-600">
                {weeklyStats.completedDays > 0 
                  ? Math.round(weeklyStats.totalMinutes / weeklyStats.completedDays)
                  : 0
                }분/일
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