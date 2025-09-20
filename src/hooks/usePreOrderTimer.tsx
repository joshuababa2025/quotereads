import { useState, useEffect, useCallback } from 'react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
  totalSeconds: number;
}

export function usePreOrderTimer(releaseDate?: Date): TimeLeft {
  const calculateTimeLeft = useCallback((targetDate: Date): TimeLeft => {
    const now = new Date().getTime();
    const releaseTime = targetDate.getTime();
    const difference = releaseTime - now;

    if (difference > 0) {
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      const totalSeconds = Math.floor(difference / 1000);
      
      return { days, hours, minutes, seconds, isExpired: false, totalSeconds };
    } else {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true, totalSeconds: 0 };
    }
  }, []);

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => {
    if (!releaseDate) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: false, totalSeconds: 0 };
    }
    return calculateTimeLeft(releaseDate);
  });

  useEffect(() => {
    if (!releaseDate) {
      setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: false, totalSeconds: 0 });
      return;
    }

    const updateTimer = () => {
      setTimeLeft(calculateTimeLeft(releaseDate));
    };

    // Update immediately
    updateTimer();
    
    // Set up interval for real-time updates
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [releaseDate, calculateTimeLeft]);

  return timeLeft;
}