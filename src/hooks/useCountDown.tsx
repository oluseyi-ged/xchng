import { useState, useEffect, useRef, useCallback } from "react";
// for countdown
export function useCountdown(initialSeconds: number) {
  const [timeLeft, setTimeLeft] = useState<number>(initialSeconds);
  const [disabled, setDisabled] = useState<boolean>(true); // Initially disabled
  const intervalId = useRef<NodeJS.Timeout | null>(null);

  const startCountdown = useCallback(() => {
    if (!intervalId.current) {
      // Prevent starting multiple timers
      setDisabled(true);
      intervalId.current = setInterval(() => {
        setTimeLeft((prevTimeLeft) => {
          if (prevTimeLeft > 0) {
            return prevTimeLeft - 1;
          } else {
            stopCountdown();
            setDisabled(false);
            return 0;
          }
        });
      }, 1000);
    }
  }, []);

  const stopCountdown = useCallback(() => {
    if (intervalId.current) {
      clearInterval(intervalId.current);
      intervalId.current = null;
      setDisabled(false);
    }
  }, []);

  const resetCountdown = useCallback(() => {
    stopCountdown();
    setTimeLeft(initialSeconds);
    setDisabled(true); // Disable button on reset
  }, [initialSeconds, stopCountdown]);

  // Format the remaining time (optional)
  const formattedTime = useCallback((): string => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  }, [timeLeft]);

  useEffect(() => {
    return () => stopCountdown();
  }, [stopCountdown]);

  return {
    timeLeft,
    formattedTime,
    startCountdown,
    stopCountdown,
    resetCountdown,
    disabled,
  };
}
