import { useEffect, useRef } from "react";
import { useOnboarding, type OnboardingPage } from "@/app/components/Onboarding/OnboardingContext";
import type { OnboardingStep } from "./OnboardingTooltip";

/**
 * Hook that auto-starts the onboarding for a page on first visit,
 * and re-starts it immediately if resetOnboarding() is called while the page is mounted.
 */
export function usePageOnboarding(
  page: OnboardingPage,
  steps: OnboardingStep[],
) {
  const { hasSeenPage, startOnboarding, resetCount } = useOnboarding();
  const lastResetCount = useRef(resetCount);

  // First visit: run once on mount
  useEffect(() => {
    if (hasSeenPage(page) || steps.length === 0) return;
    const t = setTimeout(() => startOnboarding(page, steps.length), 600);
    return () => clearTimeout(t);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Reset while already on this page: react to resetCount change
  useEffect(() => {
    if (resetCount === 0) return;
    if (resetCount === lastResetCount.current) return;
    lastResetCount.current = resetCount;
    const t = setTimeout(() => startOnboarding(page, steps.length), 300);
    return () => clearTimeout(t);
  }, [resetCount]); // eslint-disable-line react-hooks/exhaustive-deps
}