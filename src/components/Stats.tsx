'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useExerciseStore, useCurrentWeekStats, useCurrentMonthStats } from '@/store/exercise-store';
import { TrendingUp, Calendar, Timer, Flame } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Stats() {
  const viewMode = useExerciseStore(state => state.viewMode);
  const exercises = useExerciseStore(state => state.exercises);
  const getStreakInfo = useExerciseStore(state => state.getStreakInfo);
  
  const weeklyStats = useCurrentWeekStats();
  const monthlyStats = useCurrentMonthStats();
  const streakInfo = getStreakInfo();

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />
          통계
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 연속일 (Streak) */}
          <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-100">
            <div className="flex items-center gap-2 mb-2">
              <Flame className="w-5 h-5 text-orange-500" />
              <span className="text-sm font-medium text-gray-700">연속일</span>
            </div>
            <div className="text-2xl font-bold text-orange-600">{streakInfo.current}일</div>
            <div className="text-sm text-gray-500">최고: {streakInfo.longest}일</div>
          </div>

          {/* 주간/월간 통계 */}
          {viewMode === 'weekly' ? (
            <>
              {/* 주간 완료일 */}
              <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-5 h-5 text-green-500" />
                  <span className="text-sm font-medium text-gray-700">완료일</span>
                </div>
                <div className="text-2xl font-bold text-green-600">{weeklyStats.completedDays}</div>
                <div className="text-sm text-gray-500">목표: {weeklyStats.goal}일</div>
              </div>

              {/* 주간 총 시간 */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                <div className="flex items-center gap-2 mb-2">
                  <Timer className="w-5 h-5 text-blue-500" />
                  <span className="text-sm font-medium text-gray-700">총 시간</span>
                </div>
                <div className="text-2xl font-bold text-blue-600">{weeklyStats.totalMinutes}분</div>
                <div className="text-sm text-gray-500">
                  평균: {weeklyStats.completedDays > 0 
                    ? Math.round(weeklyStats.totalMinutes / weeklyStats.completedDays)
                    : 0
                  }분/일
                </div>
              </div>

              {/* 주간 달성률 */}
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-purple-500" />
                  <span className="text-sm font-medium text-gray-700">달성률</span>
                </div>
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round((weeklyStats.completedDays / weeklyStats.goal) * 100)}%
                </div>
                <div className="text-sm text-gray-500">
                  {weeklyStats.completedDays >= weeklyStats.goal ? "목표 달성!" : "목표까지 " + (weeklyStats.goal - weeklyStats.completedDays) + "일"}
                </div>
              </div>
            </>
          ) : (
            <>
              {/* 월간 완료일 */}
              <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-5 h-5 text-green-500" />
                  <span className="text-sm font-medium text-gray-700">완료일</span>
                </div>
                <div className="text-2xl font-bold text-green-600">{monthlyStats.completedDays}</div>
                <div className="text-sm text-gray-500">전체: {monthlyStats.totalDays}일</div>
              </div>

              {/* 월간 총 시간 */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                <div className="flex items-center gap-2 mb-2">
                  <Timer className="w-5 h-5 text-blue-500" />
                  <span className="text-sm font-medium text-gray-700">총 시간</span>
                </div>
                <div className="text-2xl font-bold text-blue-600">{monthlyStats.totalMinutes}분</div>
                <div className="text-sm text-gray-500">
                  평균: {monthlyStats.completedDays > 0 
                    ? Math.round(monthlyStats.totalMinutes / monthlyStats.completedDays)
                    : 0
                  }분/일
                </div>
              </div>

              {/* 월간 완료율 */}
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-purple-500" />
                  <span className="text-sm font-medium text-gray-700">완료율</span>
                </div>
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round((monthlyStats.completedDays / monthlyStats.totalDays) * 100)}%
                </div>
                <div className="text-sm text-gray-500">
                  {monthlyStats.completedDays}/{monthlyStats.totalDays}일
                </div>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}