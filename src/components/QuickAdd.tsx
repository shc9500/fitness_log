'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useExerciseStore } from '@/store/exercise-store';
import { getTodayUTC } from '@/lib/date-utils';
import { INTENSITY_CONFIG } from '@/lib/exercise-utils';
import { Plus, Zap } from 'lucide-react';

export default function QuickAdd() {
  const { exerciseTypes, addExercise } = useExerciseStore();
  const [selectedType, setSelectedType] = useState<string>('');
  const [minutes, setMinutes] = useState<string>('');
  const [intensity, setIntensity] = useState<1 | 2 | 3>(2);
  const [memo, setMemo] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>(getTodayUTC());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedType || !minutes) {
      return;
    }

    const selectedTypeData = exerciseTypes.find(t => t.id === selectedType);
    if (!selectedTypeData) return;

    setIsSubmitting(true);

    try {
      addExercise({
        date: selectedDate,
        type: selectedTypeData.name,
        minutes: parseInt(minutes),
        intensity,
        memo: memo.trim() || undefined,
      });

      // Reset form
      setSelectedType('');
      setMinutes('');
      setIntensity(2);
      setMemo('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickAdd = (typeId: string, defaultMinutes: number) => {
    const typeData = exerciseTypes.find(t => t.id === typeId);
    if (!typeData) return;

    setIsSubmitting(true);
    
    try {
      addExercise({
        date: selectedDate,
        type: typeData.name,
        minutes: defaultMinutes,
        intensity: typeData.defaultIntensity,
        memo: undefined,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center gap-3">
          <Plus className="w-5 h-5" />
          빠른 추가
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* 빠른 추가 버튼들 */}
        <div>
          <Label className="text-base font-medium text-gray-700 mb-3 block">
            원클릭 추가
          </Label>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickAdd('1', 30)} // 러닝 30분
              disabled={isSubmitting}
              className="h-10 text-sm"
            >
              러닝 30분
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickAdd('2', 60)} // 헬스 60분
              disabled={isSubmitting}
              className="h-10 text-sm"
            >
              헬스 60분
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickAdd('3', 45)} // 요가 45분
              disabled={isSubmitting}
              className="h-10 text-sm"
            >
              요가 45분
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickAdd('6', 20)} // 걷기 20분
              disabled={isSubmitting}
              className="h-10 text-sm"
            >
              걷기 20분
            </Button>
          </div>
        </div>

        {/* 구분선 */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-sm uppercase">
            <span className="bg-white px-3 text-gray-500">또는</span>
          </div>
        </div>

        {/* 상세 추가 폼 */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="date" className="text-base font-medium">
              날짜
            </Label>
            <Input
              id="date"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full h-10"
            />
          </div>

          <div>
            <Label htmlFor="exercise-type" className="text-base font-medium">
              운동 종류
            </Label>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="h-10">
                <SelectValue placeholder="운동을 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {exerciseTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="minutes" className="text-base font-medium">
              시간 (분)
            </Label>
            <Input
              id="minutes"
              type="number"
              min="1"
              max="600"
              value={minutes}
              onChange={(e) => setMinutes(e.target.value)}
              placeholder="30"
              className="h-10"
            />
          </div>

          <div>
            <Label className="text-base font-medium mb-3 block">
              강도
            </Label>
            <div className="flex gap-3">
              {([1, 2, 3] as const).map((level) => (
                <Button
                  key={level}
                  type="button"
                  variant={intensity === level ? "default" : "outline"}
                  size="sm"
                  onClick={() => setIntensity(level)}
                  className="flex-1 h-10"
                >
                  <div className="flex items-center gap-2">
                    <div 
                      className={`w-2.5 h-2.5 rounded-full ${INTENSITY_CONFIG[level].dotColor}`}
                    />
                    <span className="text-sm">{INTENSITY_CONFIG[level].label}</span>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="memo" className="text-base font-medium">
              메모 (선택)
            </Label>
            <Textarea
              id="memo"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="운동 내용이나 느낀 점을 기록해보세요"
              rows={3}
              className="resize-none"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full h-11"
            disabled={!selectedType || !minutes || isSubmitting}
          >
            <Plus className="w-5 h-5 mr-2" />
            <span className="text-base">{isSubmitting ? '추가 중...' : '운동 기록 추가'}</span>
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}