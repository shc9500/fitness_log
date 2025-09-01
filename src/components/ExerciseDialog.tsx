'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useExerciseStore } from '@/store/exercise-store';
import { Exercise } from '@/types/exercise';
import { INTENSITY_CONFIG } from '@/lib/exercise-utils';
import { Trash2, Save, X } from 'lucide-react';

interface ExerciseDialogProps {
  exercise: Exercise | null;
  isOpen: boolean;
  onClose: () => void;
  mode: 'edit' | 'view';
}

export default function ExerciseDialog({ exercise, isOpen, onClose, mode }: ExerciseDialogProps) {
  const { exerciseTypes, updateExercise, deleteExercise } = useExerciseStore();
  const [selectedType, setSelectedType] = useState<string>('');
  const [minutes, setMinutes] = useState<string>('');
  const [intensity, setIntensity] = useState<1 | 2 | 3>(2);
  const [memo, setMemo] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // exercise가 변경될 때 form 필드들을 초기화
  useEffect(() => {
    if (exercise) {
      // 운동 타입 찾기
      const typeData = exerciseTypes.find(t => t.name === exercise.type);
      setSelectedType(typeData?.id || '');
      setMinutes(exercise.minutes.toString());
      setIntensity(exercise.intensity);
      setMemo(exercise.memo || '');
    } else {
      setSelectedType('');
      setMinutes('');
      setIntensity(2);
      setMemo('');
    }
    setShowDeleteConfirm(false);
  }, [exercise, exerciseTypes]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!exercise || !selectedType || !minutes) {
      return;
    }

    const selectedTypeData = exerciseTypes.find(t => t.id === selectedType);
    if (!selectedTypeData) return;

    setIsSubmitting(true);

    try {
      updateExercise(exercise.id, {
        type: selectedTypeData.name,
        minutes: parseInt(minutes),
        intensity,
        memo: memo.trim() || undefined,
      });

      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!exercise) return;

    setIsSubmitting(true);

    try {
      deleteExercise(exercise.id);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!exercise) return null;

  const formattedDate = new Date(exercise.date).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short'
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>운동 기록 {mode === 'edit' ? '수정' : '보기'}</span>
            <span className="text-sm font-normal text-gray-500">
              {formattedDate}
            </span>
          </DialogTitle>
        </DialogHeader>

        {showDeleteConfirm ? (
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600">정말로 이 운동 기록을 삭제하시겠습니까?</p>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="font-medium">{exercise.type}</div>
                <div className="text-sm text-gray-500">{exercise.minutes}분</div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1"
                disabled={isSubmitting}
              >
                취소
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                className="flex-1"
                disabled={isSubmitting}
              >
                {isSubmitting ? '삭제 중...' : '삭제'}
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="exercise-type" className="text-sm font-medium">
                운동 종류
              </Label>
              {mode === 'view' ? (
                <div className="p-2 bg-gray-50 rounded text-sm">{exercise.type}</div>
              ) : (
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger>
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
              )}
            </div>

            <div>
              <Label htmlFor="minutes" className="text-sm font-medium">
                시간 (분)
              </Label>
              {mode === 'view' ? (
                <div className="p-2 bg-gray-50 rounded text-sm">{exercise.minutes}분</div>
              ) : (
                <Input
                  id="minutes"
                  type="number"
                  min="1"
                  max="600"
                  value={minutes}
                  onChange={(e) => setMinutes(e.target.value)}
                  placeholder="30"
                />
              )}
            </div>

            <div>
              <Label className="text-sm font-medium mb-2 block">
                강도
              </Label>
              {mode === 'view' ? (
                <div className="p-2 bg-gray-50 rounded text-sm flex items-center gap-2">
                  <div 
                    className={`w-2 h-2 rounded-full ${INTENSITY_CONFIG[exercise.intensity].dotColor}`}
                  />
                  {INTENSITY_CONFIG[exercise.intensity].label}
                </div>
              ) : (
                <div className="flex gap-2">
                  {([1, 2, 3] as const).map((level) => (
                    <Button
                      key={level}
                      type="button"
                      variant={intensity === level ? "default" : "outline"}
                      size="sm"
                      onClick={() => setIntensity(level)}
                      className="flex-1 h-8"
                    >
                      <div className="flex items-center gap-1">
                        <div 
                          className={`w-2 h-2 rounded-full ${INTENSITY_CONFIG[level].dotColor}`}
                        />
                        <span className="text-xs">{INTENSITY_CONFIG[level].label}</span>
                      </div>
                    </Button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="memo" className="text-sm font-medium">
                메모
              </Label>
              {mode === 'view' ? (
                <div className="p-2 bg-gray-50 rounded text-sm min-h-[60px]">
                  {exercise.memo || '메모 없음'}
                </div>
              ) : (
                <Textarea
                  id="memo"
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  placeholder="운동 내용이나 느낀 점을 기록해보세요"
                  rows={3}
                  className="resize-none"
                />
              )}
            </div>

            <DialogFooter>
              <div className="flex gap-2 w-full">
                {mode === 'edit' && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => setShowDeleteConfirm(true)}
                    disabled={isSubmitting}
                    className="flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    삭제
                  </Button>
                )}
                
                <div className="flex-1"></div>
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  <X className="w-3 h-3 mr-1" />
                  {mode === 'view' ? '닫기' : '취소'}
                </Button>
                
                {mode === 'edit' && (
                  <Button
                    type="submit"
                    disabled={!selectedType || !minutes || isSubmitting}
                  >
                    <Save className="w-3 h-3 mr-1" />
                    {isSubmitting ? '저장 중...' : '저장'}
                  </Button>
                )}
              </div>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}