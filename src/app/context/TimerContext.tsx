import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { api } from "@/app/services/api";

interface TimerContextType {
  isRunning: boolean;
  startTime: number | null;
  elapsedTime: number;
  startTimer: () => Promise<void>;
  stopTimer: (description: string) => Promise<void>;
  resetTimer: () => void;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export const TimerProvider = ({ children }: { children: ReactNode }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    api
      .get<{ id: number; startTime: string }>("/attendance/active")
      .then((data) => {
        const backendStart = Date.parse(data.startTime);
        setStartTime(backendStart);
        setIsRunning(true);
      })
      .catch(() => {});
  }, []);

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

  const startTimer = async () => {
    if (isRunning) return;
    const res = await api.post<{
      id: number;
      startTime: string;
      status: string;
    }>("/attendance/start", {});
    const backendStart = Date.parse(res.startTime);
    setStartTime(backendStart);
    setElapsedTime(0);
    setIsRunning(true);
  };

  const stopTimer = async (description: string) => {
    if (!isRunning) return;
    await api.post("/attendance/stop", { description });
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setStartTime(null);
    setElapsedTime(0);
  };

  return (
    <TimerContext.Provider
      value={{
        isRunning,
        startTime,
        elapsedTime,
        startTimer,
        stopTimer,
        resetTimer,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
};

export const useTimer = () => {
  const context = useContext(TimerContext);
  if (context === undefined) {
    throw new Error("useTimer deve ser usado dentro de um TimerProvider");
  }
  return context;
};
