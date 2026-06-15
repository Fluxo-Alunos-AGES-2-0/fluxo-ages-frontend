import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";

export type OnboardingPage = "dashboard" | "relatorios" | "projetos";

interface OnboardingContextType {
  isActive: boolean;
  currentPage: OnboardingPage | null;
  currentStep: number;
  totalSteps: number;
  resetCount: number;
  startOnboarding: (page: OnboardingPage, total: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  finishOnboarding: () => void;
  skipOnboarding: () => void;
  hasSeenPage: (page: OnboardingPage) => boolean;
  resetOnboarding: () => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(
  undefined,
);

const STORAGE_KEY = "fluxo_ages_onboarding_seen";

function getSeenPages(): Set<OnboardingPage> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    return new Set(JSON.parse(raw) as OnboardingPage[]);
  } catch {
    return new Set();
  }
}

function markPageSeen(page: OnboardingPage) {
  const seen = getSeenPages();
  seen.add(page);
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...seen]));
}

function clearSeenPages() {
  localStorage.removeItem(STORAGE_KEY);
}

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [isActive, setIsActive] = useState(false);
  const [currentPage, setCurrentPage] = useState<OnboardingPage | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);
  const [resetCount, setResetCount] = useState(0);

  const hasSeenPage = useCallback((page: OnboardingPage) => {
    return getSeenPages().has(page);
  }, []);

  const startOnboarding = useCallback(
    (page: OnboardingPage, total: number) => {
      setCurrentPage(page);
      setCurrentStep(0);
      setTotalSteps(total);
      setIsActive(true);
    },
    [],
  );

  const nextStep = useCallback(() => {
    setCurrentStep((prev) => prev + 1);
  }, []);

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  }, []);

  const finishOnboarding = useCallback(() => {
    if (currentPage) markPageSeen(currentPage);
    setIsActive(false);
    setCurrentPage(null);
    setCurrentStep(0);
    setTotalSteps(0);
  }, [currentPage]);

  const skipOnboarding = useCallback(() => {
    if (currentPage) markPageSeen(currentPage);
    setIsActive(false);
    setCurrentPage(null);
    setCurrentStep(0);
    setTotalSteps(0);
  }, [currentPage]);

  const resetOnboarding = useCallback(() => {
    clearSeenPages();
    setResetCount((c) => c + 1);
  }, []);

  return (
    <OnboardingContext.Provider
      value={{
        isActive,
        currentPage,
        currentStep,
        totalSteps,
        resetCount,
        startOnboarding,
        nextStep,
        prevStep,
        finishOnboarding,
        skipOnboarding,
        hasSeenPage,
        resetOnboarding,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context)
    throw new Error("useOnboarding must be used within OnboardingProvider");
  return context;
}