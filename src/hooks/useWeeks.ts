import { useState, useEffect } from 'react';
import { WeekInfo } from '../types';

export function useWeeks() {
  const [weeks, setWeeks] = useState<WeekInfo[]>([]);
  const [selectedWeek, setSelectedWeek] = useState<WeekInfo | null>(null);

  useEffect(() => {
    fetch('/weeks-index.json')
      .then(res => res.json())
      .then(data => {
        const weekList: WeekInfo[] = data.weeks;
        setWeeks(weekList);
        // Default to the current (most recent) week
        const current = weekList.find(w => w.current) || weekList[0];
        if (current) setSelectedWeek(current);
      })
      .catch(err => {
        console.error('Failed to load weeks index:', err);
      });
  }, []);

  return { weeks, selectedWeek, setSelectedWeek };
}
