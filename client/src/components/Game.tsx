import { useEffect, useState } from "react";
import { KeyboardControls } from "@react-three/drei";
import { useStepChallenge } from "@/lib/stores/useStepChallenge";
import { GameScene } from "./GameScene";
import { GameUI } from "./GameUI";
import { MenuScreen } from "./MenuScreen";
import { GameOverScreen } from "./GameOverScreen";
import { VictoryScreen } from "./VictoryScreen";
import { SoundManager } from "./SoundManager";
import { TouchControls } from "./TouchControls";
import { LoadingScreen } from "./LoadingScreen";

enum Controls {
  left = "left",
  right = "right",
  jump = "jump",
  slide = "slide"
}

export function Game() {
  const phase = useStepChallenge((state) => state.phase);
  const switchLane = useStepChallenge((state) => state.switchLane);
  const currentLane = useStepChallenge((state) => state.currentLane);
  const jump = useStepChallenge((state) => state.jump);
  const slide = useStepChallenge((state) => state.slide);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);
  
  const keyMap = [
    { name: Controls.left, keys: ["ArrowLeft", "KeyA"] },
    { name: Controls.right, keys: ["ArrowRight", "KeyD"] },
    { name: Controls.jump, keys: ["ArrowUp", "KeyW", "Space"] },
    { name: Controls.slide, keys: ["ArrowDown", "KeyS"] }
  ];
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (phase !== "playing") return;
      
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        if (currentLane === "right") switchLane("center");
        else if (currentLane === "center") switchLane("left");
      } else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        if (currentLane === "left") switchLane("center");
        else if (currentLane === "center") switchLane("right");
      } else if (e.key === "ArrowUp" || e.key === "w" || e.key === "W" || e.key === " ") {
        e.preventDefault();
        jump();
      } else if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") {
        e.preventDefault();
        slide();
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [phase, switchLane, currentLane, jump, slide]);
  
  if (isLoading) {
    return <LoadingScreen />;
  }
  
  return (
    <KeyboardControls map={keyMap}>
      <SoundManager />
      <TouchControls />
      
      {phase === "menu" && <MenuScreen />}
      {phase === "gameover" && <GameOverScreen />}
      
      {(phase === "playing" || phase === "victory") && (
        <>
          <GameScene />
          <GameUI />
          {phase === "victory" && <VictoryScreen />}
        </>
      )}
    </KeyboardControls>
  );
}
