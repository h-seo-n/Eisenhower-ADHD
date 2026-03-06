import { useCallback, useState } from "react";
import confetti from 'canvas-confetti';

const CONFETTI_CONFIG = {
    particleCount: 5,        // few at a time
    spread: 50,
    startVelocity: 15,
    gravity: 0.3,
    ticks: 250,
    opacity: 0.7,
    origin: { x: Math.random(), y: 0 },  // drift down from top
} as const;

const VIBRATION_DURATION_MS = 200;

function celebrate() {
    const duration = 1500;
  const end = Date.now() + duration;

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