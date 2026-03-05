import { useCallback, useState } from "react";
import confetti from 'canvas-confetti';

const CONFETTI_CONFIG = {
  particleCount: 100,
  spread: 70,
  origin: { y: 0.6 },
} as const;

const VIBRATION_DURATION_MS = 200;

function celebrate() {
  confetti(CONFETTI_CONFIG);
  navigator.vibrate?.(VIBRATION_DURATION_MS);
}


function useCelebration() {
  const [showCelebration, setShowCelebration] = useState(false);

  const triggerCelebration = useCallback(() => {
    celebrate();
    setShowCelebration(true);
  }, []);

  const dismissCelebration = useCallback(() => {
    setShowCelebration(false);
  }, []);

  return { showCelebration, triggerCelebration, dismissCelebration };
}

export default useCelebration;