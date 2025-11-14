import { useEffect, useRef } from "react";
import { useStepChallenge } from "@/lib/stores/useStepChallenge";

export function TouchControls() {
  const phase = useStepChallenge((state) => state.phase);
  const switchLane = useStepChallenge((state) => state.switchLane);
  const currentLane = useStepChallenge((state) => state.currentLane);
  const jump = useStepChallenge((state) => state.jump);
  const slide = useStepChallenge((state) => state.slide);
  
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  
  useEffect(() => {
    if (phase !== "playing") return;
    
    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      touchStartRef.current = {
        x: touch.clientX,
        y: touch.clientY
      };
    };
    
    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStartRef.current) return;
      
      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchStartRef.current.x;
      const deltaY = touch.clientY - touchStartRef.current.y;
      
      const minSwipeDistance = 30;
      
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (Math.abs(deltaX) > minSwipeDistance) {
          if (deltaX > 0) {
            if (currentLane === "left") switchLane("center");
            else if (currentLane === "center") switchLane("right");
          } else {
            if (currentLane === "right") switchLane("center");
            else if (currentLane === "center") switchLane("left");
          }
        }
      } else {
        if (Math.abs(deltaY) > minSwipeDistance) {
          if (deltaY < 0) {
            jump();
          } else {
            slide();
          }
        }
      }
      
      touchStartRef.current = null;
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
    };
    
    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchend", handleTouchEnd);
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    
    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [phase, switchLane, currentLane, jump, slide]);
  
  return null;
}
