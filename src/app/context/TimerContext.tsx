import { createContext, useContext, useState, useEffect, useRef } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface TimerContextValue {
  seconds: number;
  running: boolean;
  activity: string;
  saved: boolean;
  /** True while the full TimerCard is intersecting the viewport */
  timerCardVisible: boolean;
  setTimerCardVisible: (v: boolean) => void;
  setActivity: (v: string) => void;
  handleStart: () => void;
  /** Pause without clearing — resumes from current position */
  handlePause: () => void;
  /** Stop, save and reset */
  handleSave: () => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────
const TimerContext = createContext<TimerContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────
export function TimerProvider({ children }: { children: React.ReactNode }) {
  const [seconds, setSeconds]               = useState(0);
  const [running, setRunning]               = useState(false);
  const [activity, setActivity]             = useState("");
  const [saved, setSaved]                   = useState(false);
  const [timerCardVisible, setTimerCardVisible] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  const handleStart = () => { setSaved(false); setRunning(true); };

  const handlePause = () => { setRunning(false); };

  const handleSave = () => {
    setRunning(false);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setSeconds(0);
      setActivity("");
    }, 3000);
  };

  return (
    <TimerContext.Provider
      value={{
        seconds, running, activity, saved,
        timerCardVisible, setTimerCardVisible,
        setActivity, handleStart, handlePause, handleSave,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useTimer(): TimerContextValue {
  const ctx = useContext(TimerContext);
  if (!ctx) throw new Error("useTimer must be used inside <TimerProvider>");
  return ctx;
}
