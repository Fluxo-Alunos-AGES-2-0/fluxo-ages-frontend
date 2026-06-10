import { useEffect, useRef } from "react";
import { useOnboarding, type OnboardingPage } from "@/app/components/Onboarding/OnboardingContext";
import type { OnboardingStep } from "./OnboardingTooltip";

export function usePageOnboarding(
  page: OnboardingPage,
  steps: OnboardingStep[],
) {
  const { hasSeenPage, startOnboarding, resetCount } = useOnboarding();
  const lastResetCount = useRef(resetCount);

  useEffect(() => {
    if (hasSeenPage(page) || steps.length === 0) return;
    const t = setTimeout(() => startOnboarding(page, steps.length), 600);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (resetCount === 0) return;
    if (resetCount === lastResetCount.current) return;
    lastResetCount.current = resetCount;
    const t = setTimeout(() => startOnboarding(page, steps.length), 300);
    return () => clearTimeout(t);
  }, [resetCount]); 
}