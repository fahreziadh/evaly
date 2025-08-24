import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

export function useCountdown(targetTimestamp: number | undefined) {
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (!targetTimestamp) {
      setTimeLeft('');
      setIsExpired(false);
      return;
    }

    const updateCountdown = () => {
      const now = Date.now();
      const difference = targetTimestamp - now;

      if (difference <= 0) {
        setIsExpired(true);
        setTimeLeft('Expired');
        return;
      }

      setIsExpired(false);
      const dur = dayjs.duration(difference);
      
      // Always show the most appropriate format
      if (difference < 60000) { // Less than 1 minute - show seconds
        const seconds = Math.floor(difference / 1000);
        setTimeLeft(`${seconds} second${seconds !== 1 ? 's' : ''}`);
      } else if (difference < 3600000) { // Less than 1 hour - show minutes and seconds
        const minutes = dur.minutes();
        const seconds = dur.seconds();
        if (seconds === 0) {
          setTimeLeft(`${minutes} minute${minutes !== 1 ? 's' : ''}`);
        } else {
          setTimeLeft(`${minutes}m ${seconds}s`);
        }
      } else if (difference < 86400000) { // Less than 1 day - show hours and minutes
        const hours = dur.hours();
        const minutes = dur.minutes();
        if (minutes === 0) {
          setTimeLeft(`${hours} hour${hours !== 1 ? 's' : ''}`);
        } else {
          setTimeLeft(`${hours}h ${minutes}m`);
        }
      } else { // More than 1 day - show days and hours
        const days = Math.floor(dur.asDays());
        const hours = dur.hours();
        if (hours === 0) {
          setTimeLeft(`${days} day${days !== 1 ? 's' : ''}`);
        } else {
          setTimeLeft(`${days}d ${hours}h`);
        }
      }
    };

    // Update immediately
    updateCountdown();
    
    // Always update every second - simple and smooth!
    const interval = setInterval(updateCountdown, 1000);
    
    return () => clearInterval(interval);
  }, [targetTimestamp]);

  return { timeLeft, isExpired };
}