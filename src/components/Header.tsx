'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useExerciseStore } from '@/store/exercise-store';
import { formatDateForHeader, getTodayUTC } from '@/lib/date-utils';
import { Calendar, Home } from 'lucide-react';

export default function Header() {
  const { viewMode, currentDate, setViewMode, setCurrentDate } = useExerciseStore();

  const handleTodayClick = () => {
    setCurrentDate(new Date());
  };

  const currentDateString = viewMode === 'weekly' 
    ? formatDateForHeader(currentDate.toISOString().split('T')[0])
    : formatDateForHeader(currentDate.toISOString().split('T')[0]);

  return (
    <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* 로고/타이틀 */}
          <div className="flex items-center gap-3 md:gap-4">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Calendar className="w-4 h-4 md:w-5 md:h-5 text-white" />
              </div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">운동 기록</h1>
            </div>
            
            {/* 현재 날짜 표시 - 모바일에서는 숨김 */}
            <Badge variant="outline" className="text-sm md:text-base hidden sm:inline-flex px-3 py-1">
              {currentDateString}
            </Badge>
          </div>

          {/* 컨트롤 버튼들 */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* 주/월 토글 */}
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <Button
                variant={viewMode === 'weekly' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('weekly')}
                className="h-8 px-3 md:h-9 md:px-4 text-sm"
              >
                주간
              </Button>
              <Button
                variant={viewMode === 'monthly' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('monthly')}
                className="h-8 px-3 md:h-9 md:px-4 text-sm"
              >
                월간
              </Button>
            </div>

            {/* 오늘로 이동 버튼 */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleTodayClick}
              className="h-9 px-3 md:h-10 md:px-4"
            >
              <Home className="w-4 h-4 mr-1" />
              <span className="hidden sm:inline text-sm">오늘</span>
            </Button>
          </div>
        </div>
        
        {/* 모바일에서 날짜 표시 */}
        <div className="mt-3 sm:hidden">
          <Badge variant="outline" className="text-sm px-3 py-1">
            {currentDateString}
          </Badge>
        </div>
      </div>
    </header>
  );
}