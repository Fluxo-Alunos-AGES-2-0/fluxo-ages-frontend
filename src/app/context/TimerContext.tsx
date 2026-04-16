import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface TimerContextType {
  isRunning: boolean;
  startTime: number | null;
  elapsedTime: number; 
  startTimer: () => void;
  stopTimer: () => void;
  resetTimer: () => void;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export const TimerProvider = ({ children }: { children: ReactNode }) => {
  
  // ========================================================
  // MOCK TEMPORÁRIO PARA TESTE DA TASK
  const DUAS_HORAS_EM_MS = 2 * 60 * 60 * 1000;
  const QUINZE_MIN_EM_MS = 15 * 60 * 1000;
  const mockStartTime = Date.now() - (DUAS_HORAS_EM_MS + QUINZE_MIN_EM_MS);
  // ========================================================

  const [isRunning, setIsRunning] = useState(true); 
  const [startTime, setStartTime] = useState<number | null>(mockStartTime);
  const [elapsedTime, setElapsedTime] = useState(Date.now() - mockStartTime);

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>;

    if (isRunning && startTime !== null) {
      intervalId = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 1000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isRunning, startTime]);

  const startTimer = () => {
    if (!isRunning) {
      const now = Date.now();
      setStartTime(now - elapsedTime);
      setIsRunning(true);
    }
  };

  const stopTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setStartTime(null);
    setElapsedTime(0);
  };

  return (
    <TimerContext.Provider value={{ isRunning, startTime, elapsedTime, startTimer, stopTimer, resetTimer }}>
      {children}
    </TimerContext.Provider>
  );
};

export const useTimer = () => {
  const context = useContext(TimerContext);
  if (context === undefined) {
    throw new Error('useTimer deve ser usado dentro de um TimerProvider');
  }
  return context;
};