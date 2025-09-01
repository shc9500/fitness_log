import { 
  startOfISOWeek, 
  format, 
  parseISO, 
  addDays,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isToday,
  isSameDay
} from 'date-fns';

// ISO 주차의 시작일(월요일)을 UTC 기준으로 반환
export function getISOWeekStart(date: Date): string {
  const weekStart = startOfISOWeek(date);
  return format(weekStart, 'yyyy-MM-dd');
}

// 로컬 날짜를 UTC 날짜 문자열로 변환
export function toUTCDateString(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

// UTC 날짜 문자열을 로컬 Date 객체로 변환
export function fromUTCDateString(dateString: string): Date {
  return parseISO(dateString);
}

// 오늘 날짜를 UTC 문자열로 반환
export function getTodayUTC(): string {
  return toUTCDateString(new Date());
}

// 주어진 주차의 7일을 반환
export function getWeekDays(weekStart: string): string[] {
  const start = parseISO(weekStart);
  return Array.from({ length: 7 }, (_, i) => 
    format(addDays(start, i), 'yyyy-MM-dd')
  );
}

// 주어진 월의 모든 날짜를 반환
export function getMonthDays(year: number, month: number): string[] {
  const start = startOfMonth(new Date(year, month - 1));
  const end = endOfMonth(new Date(year, month - 1));
  
  return eachDayOfInterval({ start, end }).map(date => 
    format(date, 'yyyy-MM-dd')
  );
}

// 날짜가 오늘인지 확인
export function isTodayDate(dateString: string): boolean {
  return isToday(parseISO(dateString));
}

// 두 날짜가 같은 날인지 확인
export function isSameDate(date1: string, date2: string): boolean {
  return isSameDay(parseISO(date1), parseISO(date2));
}

// 날짜 포맷팅 (화면 표시용)
export function formatDateForDisplay(dateString: string): string {
  return format(parseISO(dateString), 'M/d');
}

export function formatDateForHeader(dateString: string): string {
  return format(parseISO(dateString), 'yyyy년 M월');
}

// 요일 이름 반환 (월~일)
export function getDayName(dateString: string): string {
  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
  return dayNames[parseISO(dateString).getDay()];
}