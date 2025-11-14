import { useEffect } from "react";
import { KeyboardControls } from "@react-three/drei";
import { useStepChallenge } from "@/lib/stores/useStepChallenge";
import { GameScene } from "./GameScene";
import { GameUI } from "./GameUI";
import { MenuScreen } from "./MenuScreen";
import { VictoryScreen } from "./VictoryScreen";
import { SoundManager } from "./SoundManager";

enum Controls {
  left = "left",
  right = "right"
}

export function Game() {
  const phase = useStepChallenge((state) => state.phase);
  const switchLane = useStepChallenge((state) => state.switchLane);
  
  const keyMap = [
    { name: Controls.left, keys: ["ArrowLeft", "KeyA"] },
    { name: Controls.right, keys: ["ArrowRight", "KeyD"] }
  ];
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (phase !== "playing") return;
      
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        console.log("Left key pressed");
        switchLane("left");
      } else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        console.log("Right key pressed");
        switchLane("right");
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [phase, switchLane]);
  
  return (
    <KeyboardControls map={keyMap}>
      <SoundManager />
      
      {phase === "menu" && <MenuScreen />}
      {phase === "victory" && <VictoryScreen />}
      
      {phase === "playing" && (
        <>
          <GameScene />
          <GameUI />
        </>
      )}
    </KeyboardControls>
  );
}
