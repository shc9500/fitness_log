'use client';

import Header from '@/components/Header';
import WeeklyBoard from '@/components/WeeklyBoard';
import MonthlyCalendar from '@/components/MonthlyCalendar';
import QuickAdd from '@/components/QuickAdd';
import Stats from '@/components/Stats';
import { useExerciseStore } from '@/store/exercise-store';

export default function Home() {
  const viewMode = useExerciseStore(state => state.viewMode);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-4 md:py-6 space-y-4 md:space-y-6">
        {/* 통계 영역을 상단에 배치 */}
        <Stats />
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6">
          <div className="lg:col-span-3 order-2 lg:order-1">
            {viewMode === 'weekly' ? <WeeklyBoard /> : <MonthlyCalendar />}
          </div>
          <div className="order-1 lg:order-2">
            <QuickAdd />
          </div>
        </div>
      </main>
    </div>
  );
}
